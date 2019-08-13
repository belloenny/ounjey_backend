import { prismaObjectType } from 'nexus-prisma'

export const Vendor = prismaObjectType({
    name: 'Vendor',
    definition(t) {
        t.prismaFields([
            'id',
            'email',
            'firstName',
            'lastName',
            'vendorType',
            'phone',
            {
                name: 'listings',
                args: [],
            },
        ])
    }
})