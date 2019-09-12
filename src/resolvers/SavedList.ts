import { prismaObjectType } from 'nexus-prisma'


//@ts-ignore
export const SavedList = prismaObjectType({
    name: 'savedList',
    definition(t) {
        t.prismaFields([
            'id',
            {
                name:'listings',
                args:[]
            }
        ])
    }
})