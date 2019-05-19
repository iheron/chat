import { JOIN_ROOM, CREATE_CLIENT, ENTER_USERNAME,GET_USERS,SEND_MESSAGE } from '../actions/chat'
import { reducer } from '../helper/fetch'

const chat = {
  username  : undefined,
  client: undefined,
  users: {loading: false, data: []},
  joinRoom: false,
  send:{loading: false, data: 1}
}

const RobotsReducer = (state = chat, action) => {

  if(action.type === ENTER_USERNAME){
    return {...state, username: action.data}
  }


  if(action.type === CREATE_CLIENT ){
    return {...state, client: action.data}
  }

  if (action.type.includes(JOIN_ROOM)) {
    return {...state, joinRoom: action.data}
  }

  if(action.type.includes(GET_USERS)){
    let fetchState = reducer(action, GET_USERS)
    return {...state, users: fetchState}
  }

  if(action.type.includes(SEND_MESSAGE)){
    let fetchState = reducer(action, GET_USERS)
    return {...state, send: fetchState}
  }

  return state
}

export default RobotsReducer