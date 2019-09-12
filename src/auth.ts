import {hash} from 'bcrypt'
import { FacebookUser } from './utils'

export const createUserFromFacebook = async (ctx:any, facebookUser:FacebookUser,password:string) => {
  const hashedpassword = await hash(password,10)
    return ctx.prisma.createUser({
      firstName: facebookUser.first_name,
      lastName: facebookUser.last_name,
      password: hashedpassword,
      email: facebookUser.email,
      photoUrl: facebookUser.picture.data.url
    })
}