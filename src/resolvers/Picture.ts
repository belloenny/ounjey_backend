import { prismaObjectType } from 'nexus-prisma'



//@ts-ignore
export const Picture = prismaObjectType({
    name: 'Picture',
    definition(t) {
        t.prismaFields(['*'])
    }
})