import express from 'express'
import nknClient from 'nkn-client'
import ChatStorage from '../storages/chatStorage'
const router = express.Router()

const chatStorage = new ChatStorage()

router.get('/', async function (req, res, next) {
  try {
    return res.json('ok')
  } catch (e) {
    next(e)
  }
})

export default router
