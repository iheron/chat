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
   *
   * @param from 'system': client show a 'system' tag
   * @param message
   */
  broadcast (from, message) {
    this.clients.forEach((item) => {
      this.service.send(item.addr, message)
    })
  }

  /**
   *
   * @param from 'all': boradcast to every one
   * @param to
   * @param message
   */
  send (from, to, message) {
    if (from === MessageType.ALL) {
      this.broadcast(from, message)
    } else {
      this.servce.send(to, {...message, to: to, time: moment()})
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
    this.broadcast(MessageType.SYSTEM, JSON.stringify({
      type   : MessageType.SYSTEM,
      message: `${username} has joined the room`,
      time   : moment()
    }))
    return true
  }

  getClientList () {
    return this.clients
  }

}
