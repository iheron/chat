import mongoose from 'mongoose'

export default class MongodbStorage {
  constructor (mongoConfig) {
    // if (!this.connection) {
    //   this.connection = this.connectionMongodb(mongoConfig)
    // }
  }

  static connectionMongodb (mongoConfig) {
    let uri = `mongodb://${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.database}`
    let options = {
      useNewUrlParser: mongoConfig.useNewUrlParser,
      useCreateIndex: true,
      autoIndex: true,
      user         : mongoConfig.username,
      pass         : mongoConfig.password,
      poolSize     : mongoConfig.poolSize,
      keepAlive    : true,
      autoReconnect: true
    }
    mongoose.Promise = Promise
    return mongoose.connect(uri, options, (conn) => {})
  }
}