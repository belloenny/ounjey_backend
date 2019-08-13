import { prismaObjectType } from 'nexus-prisma'

export const Views = prismaObjectType({
    name: 'Views',
    definition(t) {
        t.prismaFields(['*'])
    }
})