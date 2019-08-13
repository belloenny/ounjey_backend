import { Query } from './Query'
import { Mutation } from './Mutation'
import { Listing,Upload } from './Listing'
import { Location } from './Location'
import { Payment } from './Payment'
import { Booking } from './Booking'
import { Picture } from './Picture'
import { Review } from './Review'
import { Vendor } from './Vendor'
import { Views } from './Views'
import { PaymentAccount } from './PaymentAccount'
import { SavedList } from './SavedList'
import { AuthPayload,AuthPayloadVendor } from './AuthPayload'
import { ListingPhotos } from './ListingPhotos'
import { Order } from './Order'

export const resolvers = {
    Mutation,
    Listing,
    Location,
    Vendor,
    Review,
    Payment,
    PaymentAccount,
    SavedList,
    AuthPayload,
    AuthPayloadVendor,
    Views,
    Picture,
    Upload,
    Booking,
    ListingPhotos,
    Order,
    Query
}