import config from '../../config'
import moment from 'moment'
import { MessageType } from '../helpers/const'
import nkn from 'nkn-client'
import find from 'lodash/find'
import map from 'lodash/map'
import mongoose from 'mongoose'

const _TIME_OUT_ = 5      // seconds

export default class ChatStorage {

  constructor () {
    this.clients = []   // online clients
    this.service = nkn()
    //this.adminModel = mongoose.connection.model('admins', adminSchema)

  }

  /**
   * @param type MessageType
   * @param from 'system': client show a 'system' tag
   * @param message
   */
  broadcast (type, from, message) {
    message = {...message, type: type, from: from, time: moment()}
    this.clients.forEach((item) => {
      this.service.send(item.addr, JSON.stringify(message)).catch((e) => {throw e})
    })
  }

  /**
   * @param type MessageType
   * @param from 'all': boradcast to every one
   * @param to
   * @param message object
   */
  send (type, from, to, message) {
    if (to === MessageType.ALL) {
      this.broadcast(MessageType.MESSAGE, from, {message})
      return true
    } else {
      let findUser = find(this.clients, {username: to})
      this.service.send(findUser.addr, JSON.stringify({message:message, type: type, from: from, to: to, time: moment()}))
        .then(data => {return true})
        .catch((e) => {throw e})
      return true
    }
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

  joinRoom (username, addr) {
    let findClient = find(this.clients, {username: username})
    if (!!findClient) {
      findClient.addr = addr
    } else {
      this.clients.push({addr: addr, username: username})
    }
    this.broadcast(MessageType.SYSTEM, MessageType.SYSTEM, {
      message: `${username} has joined the room`,
    })
    return true
  }

  getClientList () {
    return this.clients
  }

}
