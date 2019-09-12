import { prismaObjectType } from 'nexus-prisma'

//@ts-ignore
export const PaymentAccount = prismaObjectType({
    name: 'PaymentAccount',
    definition(t) {
        t.prismaFields([
            'id',
            'createdAt',
            'type',
            'user',
            {
                name: 'payments',
                args: []
            }
        ])
    }
})