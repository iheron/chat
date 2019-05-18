import config from '../config'
import axios from 'axios/index'

let api = axios.create({
  baseURL     : config.apiBaseUrl,
  responseType: 'json',
  timeout     : 10000
})

export { api }