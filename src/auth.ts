import {hash} from 'bcrypt'

export const createPrismaUserFromFacebook = async (ctx, facebookUser,password) => {
  const hashedpassword = await hash(password,10)
    return ctx.prisma.createUser({
      firstName: facebookUser.first_name,
      lastName: facebookUser.last_name,
      password: hashedpassword,
      email: facebookUser.email,
      photoUrl: facebookUser.picture.data.url
    })
}