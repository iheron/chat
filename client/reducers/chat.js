import { JOIN_ROOM, CREATE_CLIENT, ENTER_USERNAME,GET_USERS } from '../actions/chat'
import { reducer } from '../helper/fetch'

const chat = {
  username  : undefined,
  client: undefined,
  users: {loading: false, data: []},
  joinRoom: false
}

const RobotsReducer = (state = chat, action) => {

  if(action.type === ENTER_USERNAME){
    return {...state, username: action.data}
  }


  if(action.type === CREATE_CLIENT ){
    return {...state, client: action.data}
  }

  if (action.type.includes(JOIN_ROOM)) {
    //let fetchState = reducer(action, JOIN_ROOM)
    return {...state, joinRoom: action.data}
  }

  if(action.type.includes(GET_USERS)){
    let fetchState = reducer(action, GET_USERS)
    return {...state, users: fetchState}
  }

  return state
}

export default RobotsReducer