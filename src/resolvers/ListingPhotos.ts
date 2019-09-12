import { objectType } from 'nexus'



export const ListingPhotos = objectType({
    name: 'ListingPhotos',
    definition(t) {
        t.field('listing',{type:'Listing'}),
        t.list.field('photos',{type:'Picture'})
    }
})