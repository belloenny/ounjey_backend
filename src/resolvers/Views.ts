import { prismaObjectType } from 'nexus-prisma'


//@ts-ignore
export const Views = prismaObjectType({
    name: 'Views',
    definition(t) {
        t.prismaFields(['*'])
    }
})