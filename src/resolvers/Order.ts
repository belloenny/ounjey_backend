import { objectType } from 'nexus'

export const Order = objectType({
    name:'Order',
    definition (t) {
        t.field('booking',{type:'Booking'})
        t.field('payment',{type:'Payment'})
        t.field('paymentAccount',{type:'PaymentAccount'})
    }
})