import { prismaObjectType } from 'nexus-prisma'
import { GraphQLUpload } from "graphql-upload";
import { asNexusMethod } from 'nexus'

export const Upload = asNexusMethod(GraphQLUpload, "upload");

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
            {
                name: 'reviews',
                args: []
            },
            'vendor',
            'pricePerPlate',
            'views',
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