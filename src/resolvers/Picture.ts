import { prismaObjectType } from 'nexus-prisma'

export const Picture = prismaObjectType({
    name: 'Picture',
    definition(t) {
        t.prismaFields(['*'])
    }
})