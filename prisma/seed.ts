import { prisma } from '../src/generated/prisma-client'

async function main() {
    await prisma.createUser({
        email: 'belloenny@gmail.com',
        firstName: 'Bello',
        password: '$2b$10$dqyYw5XovLjpmkYNiRDEWuwKaRAvLaG45fnXE5b3KTccKZcRPka2m', // "secret42"
        lastName: "Eniola",
        phone: "+254796886427"
    })
    await prisma.createUser({
        email: 'keziefred@gmail.com',
        firstName: 'freddy',
        password: '$2b$10$dqyYw5XovLjpmkYNiRDEWuwKaRAvLaG45fnXE5b3KTccKZcRPka2m', // "secret42"
        lastName: "chikezie",
        phone: "+254707618090"
    })
    await prisma.createVendor({
        email:"Vendor@vendor.com",
        password:'$2b$10$dqyYw5XovLjpmkYNiRDEWuwKaRAvLaG45fnXE5b3KTccKZcRPka2m',
        lastName:"Vendor",
        firstName: "Jake",
        vendorType:"INDEPENDENT",
        phone:"+25479688427"
    })
    await prisma.createVendor({
        email:"Vendor2@vendor.com",
        password:'$2b$10$dqyYw5XovLjpmkYNiRDEWuwKaRAvLaG45fnXE5b3KTccKZcRPka2m',
        lastName:"Vendor",
        firstName: "Paul",
        vendorType:"BARS",
        phone:"+25479688427",
        
    })
}

main()
