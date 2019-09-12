import { prismaObjectType } from 'nexus-prisma'
import { GraphQLUpload } from "graphql-upload";
import { asNexusMethod } from 'nexus'

export const Upload = asNexusMethod(GraphQLUpload, "upload");


//@ts-ignore
export const Listing = prismaObjectType({
    name: 'Listing',
    definition(t) {
        t.prismaFields([
            'id',
            'title',
            'description',
            'createdAt',
            'updatedAt',
            'maxGuests',
            'vendor',
            'pricePerPlate',
            'views',
            {
                name: 'reviews',
                args: []
            },
            {
                name: 'bookings',
                args: []
            },
            {
                name: 'photos',
                args: []
            }
        ])
    }
})