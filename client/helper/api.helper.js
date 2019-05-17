import config from '../config'
import axios from 'axios/index'
import Cookies from 'js-cookie'

let token = Cookies.get('token')

let api = axios.create({
  baseURL     : config.apiBaseUrl,
  headers     : {'Authorization': 'Bearer ' + token},
  responseType: 'json',
  timeout     : 10000
})

export { api }