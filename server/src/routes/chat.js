import express from 'express'

const router = express.Router()

import ChatStorage from '../storages/chatStorage'
import statusCode from '../helpers/statusCode'

const chatStorage = new ChatStorage()

/**
 * @api {post} /chat/join_room
 */
router.post('/join_room', async function (req, res, next) {
  let username = req.body.username
  let addr = req.body.addr
  try {
    let flag = chatStorage.joinRoom(username, addr)
    res.json({code: !!flag ? statusCode.SUCCESS : statusCode.FAIL})
  } catch (e) {
    next(e)
  }
})

router.get('/users', async function (req, res, next) {
  try {
    let list = chatStorage.getClientList()
    res.json(list)
  } catch (e) {
    next(e)
  }
})

router.put('/send', async function (req, res, next) {
  try {
    let list = chatStorage.getClientList()
    res.json(list)
  } catch (e) {
    next(e)
  }
})

export default router
