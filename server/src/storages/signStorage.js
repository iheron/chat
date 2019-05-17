import config from '../../config'
import statusCode from '../helpers/statusCode'
import { errorStatus } from '../helpers/statusCode'
import adminSchema from '../schemas/adminSchema'

import jwt from 'jsonwebtoken'
import redisStorage from './redisStorage'
import mongoose from 'mongoose'
import { signToken } from '../helpers/token'
import { ClientType } from '../helpers/const'

const _TOKEN_EXP_ = 604800         // 7天 (s)
const _VALID_EXP_ = 600            // 600秒
const _ACCESS_TOKEN_KEY_ = 'access_token:'
const _VALID_KEY_ = 'valid:'

export default class SignStorage{
  constructor () {
    this.adminModel = mongoose.connection.model('admins', adminSchema)
  }

  async verifyAccessToken (userId, token) {
    let val = await redisStorage.get(_ACCESS_TOKEN_KEY_ + userId)
    return val === token
  }

  async verifyMobileToken (mobile, token) {
    let val = await redisStorage.get(_MOBILE_TOKEN_KEY_ + mobile)
    return val === token
  }

  /**
   * 设置access token到redis，并且带上过期时间
   */
  async setAccessToken (key, token) {
    return await redisStorage.set(_ACCESS_TOKEN_KEY_ + key, token, 'EX', _TOKEN_EXP_)
  }

  async setValid (key, val) {
    return await redisStorage.set(_VALID_KEY_ + key, val, 'EX', _VALID_EXP_)
  }

  async delAccessToken (key) {
    return await redisStorage.del(_ACCESS_TOKEN_KEY_ + key)
  }

  async refreshToken (userId) {
    let token = jwt.sign({userId: userId}, config.secret, {expiresIn: '7d'})
    this.setAccessToken(userId, token)
    return token
  }

  async signIn (username, password) {
    let user = await this.adminModel.findOne({username: username})
    console.log(user)
    if (user) {
      if (user.password === password) {
        // let token = jwt.sign({userId: user._id}, config.secret, {expiresIn: '7d'})
        let token = signToken(user._id, ClientType.ADMIN,config.secret, {}, {expiresIn: '7d'})
        this.setAccessToken(user._id, token)
        return token
      } else {
        throw errorStatus(statusCode.PASSWORD_ERROR, 'password error')
      }
    } else {
      throw errorStatus(statusCode.USERNAME_ERROR, 'username error')
    }
  }

  async getUserById (userId) {
    let user = await this.adminModel.findOne({_id: userId}).lean()
    return user
  }
}
