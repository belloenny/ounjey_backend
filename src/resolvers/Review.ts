import { prismaObjectType } from 'nexus-prisma'


//@ts-ignore
export const Review = prismaObjectType({
    name: 'Review',
    definition(t) {
        t.prismaFields(['*'])
    }
})