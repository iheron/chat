import config from '../../config'
import nkn from 'nkn-client'
import find from 'lodash/find'
import map from 'lodash/map'
import mongoose from 'mongoose'

const _TIME_OUT_ = 5      // seconds

export default class ChatStorage {

  constructor () {
    this.clients = []   // online clients
    //this.adminModel = mongoose.connection.model('admins', adminSchema)

  }

  createClient (username) {
    const client = nkn()
    let findClient = find(this.clients, {username: username})
    if (!!findClient) {
      findClient.addr = client.addr
    } else {
      this.clients.push({addr: client.addr, username: username})
    }
    return {username: username, addr: client.addr}
  }

  getClientList () {
    return map(this.clients, 'username')
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
        let token = signToken(user._id, ClientType.ADMIN, config.secret, {}, {expiresIn: '7d'})
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
