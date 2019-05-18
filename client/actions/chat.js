import { api } from '../helper/api'
import { fetch } from '../helper/fetch'

export const JOIN_ROOM = 'JOIN_ROOM'

export function joinRoom (username) {
  return (dispatch) => {
    fetch({
      axios   : api.post(`/chat/join_room`, {username: username}),
      constant: JOIN_ROOM,
      dispatch: dispatch,
      success : (data) => {
        let {username, addr} = data
        return {data:{username, addr}}
      },
      error   : (error) => ({error})
    })
  }
}
