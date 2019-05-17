const config = {
  mongodb: {
    host           : '127.0.0.1',
    port           : '27017',
    database       : 'chat',
    auto_reconnect : true,
    poolsize       : 10,
    useNewUrlParser: true,
    useCreateIndex : true
  },
  redis  : {
    port    : 6379,        // Redis port
    host    : '127.0.0.1', // Redis host
    family  : 4,           // 4 (IPv4) or 6 (IPv6)
    password: '',
    db      : 4
  },
  secret         : new Buffer('aaa', 'base64')
}

export default config
