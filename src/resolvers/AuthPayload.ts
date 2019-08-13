import { objectType } from 'nexus'


export const AuthPayload = objectType({
    name: 'AuthPayload',
    definition(t) {
        t.string('token')
        t.field('user',{ type:'User' })
    }
})
export const AuthPayloadVendor = objectType({
    name: 'AuthPayloadVendor',
    definition(t) {
        t.string('token')
        t.field('vendor',{ type:'Vendor' })
    }
})