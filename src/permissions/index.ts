import { rule, shield } from 'graphql-shield'
import { getUserId } from '../utils'

const rules = {
    isAuthenticatedUser: rule()((parent,args,context) => {
        const userId = getUserId(context)
        console.log(userId)
        return Boolean(userId)
    }),
}

export const permissions = shield({
    Query: {
        user:    rules.isAuthenticatedUser,
    },
    
})