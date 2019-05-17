import express from 'express'
import { sha256Hash } from '../helpers/crypto'
import SignStorage from '../storages/signStorage'
import statusCode from '../helpers/statusCode'

const router = express.Router()
const signStorage = new SignStorage()

router.post('/signin', async function (req, res, next) {
  let username = req.body.username
  let password = req.body.password

  if (!username) {
    return res.json({code: statusCode.MISS_PARAMS, message: 'username is required'})
  }
  if (!password) {
    return res.json({code: statusCode.MISS_PARAMS, message: 'password is required'})
  }
  try {
    let token = await signStorage.signIn(username, sha256Hash(password))
    let decode = jwt.decode(token)
    res.send({code: statusCode.SUCCESS, token: token, exp: decode.exp})
  } catch (e) {
    next(e)
  }
})

router.get('/signout',  async function (req, res, next) {
  let userId = req.token.sub
  try {
    let flag = await signStorage.delAccessToken(userId)
    res.json({code: statusCode.SUCCESS})
  } catch (e) {
    next(e)
  }
})

export default router
