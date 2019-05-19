import config from '../config/index'
import http from 'http'
import express from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'

import chatRouter from './routes/chat'

import MongodbStorage from './storages/mongodbStorage'

let app = express()

MongodbStorage.connectionMongodb(config.mongodb)

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))


app.use(function (req, res, next) {
  console.log('request ------------------------->')
  console.log('path: ' + req.path)
  console.log('query: ' + JSON.stringify(req.query))
  console.log('params: ' + JSON.stringify(req.params))
  console.log('body: ' + JSON.stringify(req.body))
  next()
})

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization')
  next()
})


app.use('/chat', chatRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  //res.locals.message = err.message
  //res.locals.error = process.env.NODE_ENV === 'development' ? err : {}
  console.error(err)
  res.status(err.status || 500)
  if (!!err.code) {
    return res.json({code: err.code, message: err.message})
  }

  if (process.env.NODE_ENV === 'development') {
    res.json(err.stack)
  } else {
    res.json(err.message)
  }

})

function normalizePort (val) {
  let port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  let bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening () {
  let addr = server.address()
  let bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  console.log('Listening on ' + bind)
}

let port = normalizePort(process.env.PORT || '3001')

let server = http.createServer(app)

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)
