import { verify } from 'jsonwebtoken'
import { Context } from './types'
import axios from "axios"
import { User, Picture } from './generated/prisma-client';

export const APP_SECRET="ounjey_typescript"

interface Token {
    userId: string
}

export function getUserId(context:Context) {
    const Authorization = context.request.get('Authorization')

    if(Authorization) {
        const token = Authorization.replace('Bearer ', '')
     
        const verifiedToken = verify(token, APP_SECRET) as Token

        return verifiedToken && verifiedToken.userId
    }
}


interface ProfilePicture {
  data: Picture
}

export interface FacebookUser {
  id: string
  email: string | null
  first_name: string
  last_name: string
  picture:   ProfilePicture
}

export interface Photo {
  id:       string
  filename: string
  path:     string
}


const ENDPOINT = "https://graph.facebook.com"
const API_VERSION = "v4.0"
const fields = `first_name,last_name,birthday,locale,education,work,email,gender,picture`

export const getFacebookUser = async (
  facebookToken: string,
): Promise<FacebookUser> => {
  const endpoint = `${ENDPOINT}/${API_VERSION}/me?fields=${fields}&access_token=${facebookToken}`

  try {
    const { data } = await axios.get(endpoint)
    return data
  } catch (error) {
    throw new Error(error)
  }
}