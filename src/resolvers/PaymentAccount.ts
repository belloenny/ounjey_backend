import { prismaObjectType } from 'nexus-prisma'

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