import { getUserId } from '../utils'
import { queryType, idArg } from 'nexus'


export const Query = queryType({
    definition(t){
        t.field('user',{
            type: 'User',
            resolve: (parent, args, ctx) => {
                const userId = getUserId(ctx)
                return ctx.prisma.user({id:userId})
            },
        })
        
        t.list.field('users',{
            type: 'User',
            resolve: (parent, args, ctx) => {
                return ctx.prisma.users()
            },
        })
        t.field('vendor', {
            type: 'Vendor',
            resolve: (parent,args, ctx) => {
                const userId = getUserId(ctx)
                return ctx.prisma.vendor({id:userId})
            },
        })

        t.list.field('vendors',{
            type: 'Vendor',
            resolve: (parent, args, ctx) => {
                return ctx.prisma.vendors()
            },
        })

        t.field('listing',{
            type: 'Listing',
            nullable: true,
            args: { id:idArg() },
            resolve: (parent,{id}, ctx) => {
                return ctx.prisma.listing({ id }) 
            }
        })
        t.list.field('listings',{
            type: 'Listing',
            resolve: (parent,args, ctx) => {
                return ctx.prisma.listings()
            } 
        })
        
    }
})