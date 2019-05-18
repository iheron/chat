import { JOIN_ROOM } from '../actions/chat'
import { reducer } from '../helper/fetch'

const chat = {
  user: undefined

}

const RobotsReducer = (state=chat, action) => {
  if (action.type.includes(JOIN_ROOM)) {
    let fetchState = reducer(action, JOIN_ROOM)
    return {...state, user: fetchState.data}
  }

  return state
}

export default RobotsReducer