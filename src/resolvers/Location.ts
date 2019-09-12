import { prismaObjectType } from 'nexus-prisma'


//@ts-ignore
export const Location = prismaObjectType({
    name: 'Location',
    definition(t) {
        t.prismaFields(['*'])
    }
})