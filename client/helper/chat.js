import nkn from 'nkn-client'
import find from 'lodash/find'
import map from 'lodash/map'


export default class ChatHelper {
  constructor () {
  }


  createClient () {
    const client = nkn()
    return client
  }


}
