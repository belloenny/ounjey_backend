import { stringArg, idArg, mutationType,arg,intArg, floatArg } from 'nexus'
import { hash,compare } from 'bcrypt'
import { isNil } from 'ramda'
import { sign } from 'jsonwebtoken'
import {Photo}  from '../utils'
import { APP_SECRET,getFacebookUser, getUserId } from '../utils'
import {  createUserFromFacebook } from '../auth'
import { processUpload } from '../uploads';

export const Mutation = mutationType({
    definition(t) {
        t.field('signupUser',{
            type: 'AuthPayload',
            args: {
                email: stringArg() ,
                password: stringArg(),
                firstName: stringArg(),
                lastName: stringArg(),
                phone: stringArg()
            },
            resolve:async(parent,{email,password,firstName,lastName,phone},ctx) => {
                const hashedPassword = await hash(password,10)
                const user = await ctx.prisma.createUser({
                    email,
                    firstName,
                    lastName,
                    phone,
                    password: hashedPassword,
                })

                return {
                    token: sign({userId: user.id},APP_SECRET),
                    user,
                }
            }
        })
        t.field('loginOrSignUpFacebook',{
            type:'AuthPayload',
            nullable:true,
            args: {
                idToken: stringArg(),
                password: stringArg(),
            },
            resolve: async (parent,{
                idToken,
                password
            },ctx) => {
                let user = null
                const facebookUser = await getFacebookUser(idToken)
                user = await ctx.prisma.user({email: facebookUser.email})
                if(isNil(user)) {
                    user = await createUserFromFacebook(ctx,facebookUser,password)
                }
                return {
                    user,
                    token: sign({userId:user.id},APP_SECRET)
                }
            }

        })
        t.field('loginuser',{
            type:'AuthPayload',
            args: {
                email: stringArg(),
                password: stringArg()
            },
            resolve: async(parent,{email,password},ctx) => {
                const user = await ctx.prisma.user({email})
                if(!user) {
                    throw new Error(`No user with email: ${email}`)
                }
                const passwordValid = await compare(password,user.password)
                if(!passwordValid) {
                    throw new Error('Invalid Password')
                }
                return {
                    token: sign({userId: user.id},APP_SECRET),
                    user,
                }
            }
        })
        
        t.field('signupVendor',{
            type: 'AuthPayloadVendor',
            args: {
                email: stringArg(),
                password: stringArg(),
                firstName: stringArg(),
                lastName: stringArg(),
                phone: stringArg(),
                vendorType: arg({type:'VENDOR_TYPE',required:true}),
            },
            resolve:async(parent,{email,password,firstName,lastName,phone,vendorType},ctx) => {
                const hashedPassword = await hash(password,10)
                const vendor = await ctx.prisma.createVendor({
                    email,
                    firstName,
                    lastName,
                    phone,
                    vendorType,
                    password: hashedPassword,
            
                })
                return {
                    token: sign({userId: vendor.id},APP_SECRET),
                    vendor,
                }
            }
        })
        
        t.field('loginVendor',{
            type:'AuthPayloadVendor',
            args: {
                email: stringArg(),
                password: stringArg()
            },
            resolve: async(parent,{email,password},ctx) => {
                const vendor = await ctx.prisma.vendor({email})
                if(!vendor) {
                    throw new Error(`No vendor with email: ${email}`)
                }
                const passwordValid = await compare(password,vendor.password)
                if(!passwordValid) {
                    throw new Error('Invalid Password')
                }
                return {
                    token: sign({userId: vendor.id},APP_SECRET),
                    vendor,
                }
            }
        })
        
        t.field('createlisting',{
            type: 'Listing',
            args: {
                title:          stringArg(),
                description:    stringArg(),
                pricePerPlate:  intArg(),
                maxGuests:      intArg(),
                coverPhoto:     arg({type:"Upload",required:true}),
                vendorID:       idArg()
            },
            resolve: async(parent,{
                title,
                description,
                pricePerPlate,
                maxGuests,
                vendorID,
                coverPhoto,
            },ctx) => {
                
                const photo = await processUpload(coverPhoto)
                coverPhoto = photo.path
                const listing = await ctx.prisma.createListing({
                    title,
                    description,
                    pricePerPlate,
                    coverPhoto:`http://localhost:4000/images/${coverPhoto}`,
                    vendor:{connect:{id: vendorID}},
                    maxGuests
                })
                return listing
            }
        })
        t.list.field('uploadPhotos', {
            type: 'Picture',
            args: {
                photos: arg({type:'Upload',required:true,list:true}),
                listing: idArg()
            },
            resolve: async (parent,{photos,listing},ctx) => {
                const pictures = await Promise.all(photos.map(processUpload))
                let urls = []
                urls = pictures.map((photo:Photo) => {
                    return photo.path
                })
                const files = urls.map(async src => {
                    const results = await ctx.prisma.createPicture({
                        src:`http://localhost:4000/images/${src}`,
                        listing: {connect: {id: listing}}
                    })
                    return results
                })
                return files
                
            }
        })
        t.field('createReview', {
            type: 'Review',
            args: {
                title:      stringArg(),
                comment:    stringArg(),
                stars:      intArg(),
                listingId:  idArg(),  
            },
            resolve: (parent,{ title, comment, stars, listingId}, ctx) => {
                return ctx.prisma.createReview({
                    listing: {connect:{id: listingId}},
                    stars,
                    title,
                    comment,
                })
            }
        })
        t.field('book',{
            type:'Order',
            args:{
                listingId:      idArg({required:true}),
                occasionDate:   stringArg(),
                price:          floatArg(),
                totalPrice:     floatArg(),
                serviceFee:     floatArg(),
                type:           arg({type:'PAYMENT_PROVIDER',required:true})

            },
            resolve: async (parent,
                {
                listingId,
                occasionDate,
                price,
                totalPrice,
                serviceFee,
                type
                },ctx) => {
                const userId = getUserId(ctx)
                const booking = await ctx.prisma.createBooking({
                    occasionDate,
                    bookee: {connect:{id: userId}},
                    listing: {connect:{id:listingId}},
                })
                const paymentAccount = await ctx.prisma.createPaymentAccount({
                    user: {connect:{id:userId}},
                    type,
                })
                const payment = await ctx.prisma.createPayment({
                    price,
                    totalPrice,
                    booking: {connect:{id: booking.id}},
                    paymentMethod: {connect:{id: paymentAccount.id}},
                    serviceFee,
                })

                return {
                    booking,
                    paymentAccount,
                    payment
                }

            }
        })
        t.field('uploadProfilePhoto',{
            type: 'User',
            args: {
                photo: arg({type:"Upload",required:true}),
                userId: idArg()
            },
            resolve: async (parent,{photo,userId},ctx) => {
                const picture = await processUpload(photo)
                const photoUrl = picture.path

                return ctx.prisma.updateUser({
                    where: {
                        id: userId
                    },
                    data: {
                        photoUrl
                    }
                })
                
            }
        })
              

    }

})
            