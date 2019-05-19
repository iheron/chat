import { api } from '../helper/api'
import { fetch, constants } from '../helper/fetch'

import ChatHelper from '../helper/chat'
import { MessageType } from '../helper/const'

const chatHelper = new ChatHelper()

export const JOIN_ROOM = 'JOIN_ROOM'

export function joinRoom (username, addr) {
  return (dispatch) => {
    fetch({
      axios   : api.post(`/chat/join_room`, {username: username, addr: addr}),
      constant: JOIN_ROOM,
      dispatch: dispatch,
      success : (data) => {
        if (data.code === 0) {
          return {data:true}
        } else {
          return {data:false}
        }

      },
      error   : (error) => ({error})
    })
  }
}

export const CREATE_CLIENT = 'CREATE_CLIENT'

export function createClient (username) {
  return (dispatch) => {
    try {
      let client = chatHelper.createClient()
      dispatch(joinRoom(username, client.addr))
      dispatch({type: CREATE_CLIENT, data: client})
    } catch (e) {
      console.log(e)
    }

  }
}

export const ENTER_USERNAME = 'ENTER_USERNAME'

export function enterUsername (username) {
  return (dispatch) => {
    dispatch({type: ENTER_USERNAME, data: username})
  }
}

export const GET_USERS = 'GET_USERS'

export function getUsers () {
  return (dispatch) => {
    fetch({
      axios   : api.get(`/chat/users`),
      constant: GET_USERS,
      dispatch: dispatch,
      success : (data) => {
        return {data}
      },
      error   : (error) => ({error})
    })
  }
}

export const SEND_MESSAGE = 'SEND_MESSAGE'
export function send(fromUser, toUser, message, callback) {
  return (dispatch) => {
    fetch({
      axios   : api.put(`/chat/send`, {from:fromUser, to:toUser, message: message}),
      constant: SEND_MESSAGE,
      dispatch: dispatch,
      success : (data) => {
        callback(data)
        return {data}
      },
      error   : (error) => ({error})
    })
  }
}

export const GET_MESSAGE_LOG = 'GET_MESSAGE_LOG'
export function getLastMessage(user, n) {
  return (dispatch) => {
    fetch({
      axios   : api.get(`/chat/last_message?user=${user}&n=${n}`,),
      constant: GET_MESSAGE_LOG,
      dispatch: dispatch,
      success : (data) => {
        data.map((item) => {
          item.type = MessageType.MESSAGE
          item.from = item.from_name
          item.to = item.to_name
          if (item.from_name === user) {
            item.mine = true
          }
          return item
        })
        return {data}
      },
      error   : (error) => ({error})
    })
  }
}