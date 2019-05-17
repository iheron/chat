import IoRedis from 'ioredis'
import config from '../../config'
//const sub = new IoRedis(redisConfig)
//const pub = new IoRedis(redisConfig)

let redisConfig = config.redis
const client = new IoRedis({
  ...redisConfig,
  reconnectOnError: function (err) {
    let targetError = 'READONLY'
    if (err.message.slice(0, targetError.length) === targetError) {
      // Only reconnect when the error starts with "READONLY"
      return true // or `return 1;`
    }
  }
})
export default client
//export { sub, pub }
