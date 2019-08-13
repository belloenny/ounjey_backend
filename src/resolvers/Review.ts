import { prismaObjectType } from 'nexus-prisma'

export const Review = prismaObjectType({
    name: 'Review',
    definition(t) {
        t.prismaFields(['*'])
    }
})