const express = require('express')
import { GraphQLServer } from 'graphql-yoga'
import { prisma } from './generated/prisma-client'
import * as path from 'path'
import { makePrismaSchema } from 'nexus-prisma'
import { permissions } from './permissions'
import * as allTypes from './resolvers'
import datamodelInfo from './generated/nexus-prisma'

const schema = makePrismaSchema({
   types: allTypes,
   prisma: {
       datamodelInfo,
       client: prisma,
   },

   outputs: {
       schema: path.join(__dirname, './generated/schema.graphql'),
       typegen: path.join(__dirname, './generated/nexus.ts'),
   },

   nonNullDefaults: {
       input: false,
       output: false
   },
   typegenAutoConfig: {
       sources: [{
           source: path.join(__dirname, './types.ts'),
           alias: 'types'
       }],
       contextType: 'types.Context',
   },
})
const opts = {
    port: 4000,
    cors: {
      credentials: false,
      origin: ["http://localhost:3000"]
    }
  };
  
const server = new GraphQLServer({
    schema,
    middlewares: [permissions],
    context: request => {
        return {
            ...request,
            prisma,
        }
    }
})

server.express.use('/images',express.static('Images'))

server.start(opts,() => console.log(`🚀 Server ready at http://localhost:4000`))