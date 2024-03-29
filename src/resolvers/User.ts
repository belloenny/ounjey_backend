import { prismaObjectType } from 'nexus-prisma'


//@ts-ignore
export const User = prismaObjectType({
    name: 'User',
    definition(t) {
        t.prismaFields(['*'])
    }
})