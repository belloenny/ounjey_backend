import { prismaObjectType } from 'nexus-prisma'


//@ts-ignore
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