import { prismaObjectType } from 'nexus-prisma'


export const Payment = prismaObjectType({
    name: 'Payment', 
    definition(t) {
        t.prismaFields(['*'])
    }
})