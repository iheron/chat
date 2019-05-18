import { JOIN_ROOM } from '../actions/chat'
import { reducer } from '../helper/fetch'

const chat = {
  user:{}

}

const RobotsReducer = (state=chat, action) => {
  if (action.type.includes(JOIN_ROOM)) {
    let fetchState = reducer(action, JOIN_ROOM)
    console.log('-----------')
    console.log(fetchState)
    return {...state, user: fetchState.data}
  }

  return state
}

export default RobotsReducer