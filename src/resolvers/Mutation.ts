import { stringArg, idArg, mutationType,arg,intArg, floatArg } from 'nexus'
import { hash,compare } from 'bcrypt'
import { isNil } from 'ramda'
import { sign } from 'jsonwebtoken'
import { APP_SECRET,getFacebookUser, getUserId } from '../utils'
import { createPrismaUserFromFacebook } from '../auth'
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
        t.field('signupWithFaceBook',{
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
                    user = await createPrismaUserFromFacebook(ctx,facebookUser,password)
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
        t.field('updateuser',{
            type: 'User',
            args: {
                firstName: stringArg(),
                lastName:  stringArg(),
                email:      stringArg(),
                phone:      intArg(),
                address:    stringArg(),
            },
            resolve: (parent, {firstname, lastname, email, address, phone, }, ctx) => {
                const userId = getUserId(ctx)
                return ctx.prisma.updateUser({
                    where: {
                        id: userId
                    },
                    data:{
                        firstname,
                        lastname,
                        email,
                        phone,
                        address,
                    }
                    
                })
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
                vendorType: stringArg(),
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
        t.field('updatevendor',{
            type: 'Vendor',
            args: {
                firstName: stringArg(),
                lastName:  stringArg(),
                email:      stringArg(),
                phone:      intArg(),
                vendorType: stringArg(),
            },
            resolve: (parent, {firstname, lastname, email, phone, vendorType}, ctx) => {
                const userId = getUserId(ctx)
                return ctx.prisma.updateVendor({
                    where: {
                        id: userId
                    },
                    data:{
                        firstname,
                        lastname,
                        email,
                        phone,
                        vendorType,
                    }
                    
                })
            }
        })
        t.field('deletevendor', {
            type: 'Vendor',
            args: {
                id: idArg(),
            },
            resolve: (parents, {id}, ctx) => {
                return ctx.prisma.deletevendor({
                    where: {
                        id
                    }
                })
            }
        })
        t.field('createlisting',{
            type: 'ListingPhotos',
            args: {
                title:          stringArg(),
                description:    stringArg(),
                pricePerPlate:  intArg(),
                maxGuests:      intArg(),
                photo:          arg({type:"Upload",required:true,list:true}),
            },
            resolve: async(parent,{
                title,
                description,
                pricePerPlate,
                maxGuests,
                photo,
            },ctx) => {
                const vendorID = getUserId(ctx)
                const photos = await Promise.all(photo.map(processUpload))
                const listing = await ctx.prisma.createListing({
                    title,
                    description,
                    pricePerPlate,
                    vendor:{connect:{id: vendorID}},
                    maxGuests
                })

                let urls = []
                urls = photos.map(photo => {
                    //@ts-ignore
                    return photo.path
                })
                const pictures =   urls.map(async url => {
                    const results = await ctx.prisma.createPicture({
                        url,
                        listing: {connect: {id: listing.id}}
                    })
                    return results
                })
                return {
                    pictures,
                    listing
                }
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
                type:           stringArg()

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
        t.field('deleteBooking', {
            type:'Booking',
            args: {
                id: idArg()
            },
            resolve: (parent,{id},ctx) => {
                // refund user

                return ctx.prisma.deleteBooking({
                    where: {
                        id
                    }
                })
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
        t.field('deleteReview', {
            type: 'Review',
            args: {
                id:  idArg(),  
            },
            resolve: (parent,{id}, ctx) => {
                return ctx.prisma.deleteReview({
                    where: {
                        id
                    }
                })
            }
        })        

    }

})
            