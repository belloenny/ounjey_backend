import { prismaObjectType } from 'nexus-prisma'


export const Booking = prismaObjectType({
    name: 'Booking',
    definition(t) {
        t.prismaFields(['*'])
    }
}) 