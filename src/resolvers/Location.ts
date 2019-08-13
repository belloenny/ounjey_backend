import { prismaObjectType } from 'nexus-prisma'

export const Location = prismaObjectType({
    name: 'Location',
    definition(t) {
        t.prismaFields(['*'])
    }
})