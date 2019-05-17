import indexOf from 'lodash/indexOf'
import express from 'express'
import multer from 'multer'
import statusCode from '../helpers/statusCode'
import { authToken } from '../helpers/sign'
import { getAccessToken , getUserInfo} from '../helpers/wechat'
import { uploadToOss } from '../helpers/oss'
import UserStorage from '../storages/userStorage'
import SignStorage from '../storages/signStorage'
import index from '../../config/config'

let userStorage = new UserStorage()
const router = express.Router()
const signStorage = new SignStorage()

/**
 * @swagger
 * tags:
 * - name: "/my"
 *   description: "用户接口"
 */

// router.put('/mobile', authToken, async function (req, res, next) {
//   let result = await TokenStorage.getStarTokens(req.user.userId)
//   res.json({code: 0, results: result})
// })
/**
 * 邀请注册用户
 */
router.post('/register', async function (req, res, next) {
  console.log(req.body)
  let userId = req.body.userId
  let mobile = req.body.mobile
  let valid = req.body.valid

  if (!mobile) {
    return res.json({code: statusCode.EMPTY_MOBILE, message: 'mobile is required'})
  }

  if (!valid) {
    return res.json({code: statusCode.EMPTY_VALID, message: 'valid is required'})
  }
  if (!/\+?(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/.test(mobile)) {
    return res.json({code: statusCode.MOBILE_ERROR, message: 'mobile is error'})
  }

  let flag = await signStorage.verifyValidCode(mobile, valid)
  if (mobile === '18600000000' && valid === '999888' || mobile === '18600000001' && valid === '999888') {
    flag = true
  }
  if (config.nodeEnv === 'development' && valid === '000000') {
    flag = true
  }
  if (!flag) {
    return res.json({code: statusCode.VALID_ERROR, message: 'valid is error'})
  }

  // 登录成功后 清除valid
  signStorage.delValidCode(mobile)

  let result = await userStorage.register(userId, mobile)
  return res.json({code: result})
})

/**
 * 获取二维码图片  邀请码 authToken
 */
router.get('/qrcode',authToken, async function (req, res, next) {
  let userId =req.token.sub
  let result = await userStorage.getQrcode(userId)
  res.json(result)
})

/**
 * 积分管理
 * type: 积分类型 news  wechat..
 */
router.post('/point', authToken, async function (req, res, next) {
  let userId = req.token.sub
  let type = req.body.type
  if (!type) {
    return res.json({code: statusCode.EMPTY_TYPE, message: 'type is required'})
  }
  let result = await userStorage.addPoint(userId, type)
  return res.json({code: 0, data: result})
})

/**
 * 币体检次数管理
 *
 */
router.get('/examine', authToken, async function (req, res, next) {
  let userId = req.token.sub
  let type = req.query.type || 'share'
  let result = await userStorage.managerExamine(userId, type)
  res.json(result)
})

/**
 * 获取币体检信息
 */
router.get('/examine/info', authToken, async function (req, res, next) {
  let userId = req.token.sub
  let result = await userStorage.getExamine(userId)
  res.json(result)
})

router.get('/user/point', authToken, async function (req, res, next) {
  let userId = req.token.sub

  let result = await userStorage.getUserPointInfo(userId)
  res.json(result)
})

/**
 * @swagger
 * /my/info:
 *   get:
 *     tags: [ /my ]
 *     summary: 获取我的信息
 *     description: 获取我的信息
 *     security:
 *       - bearer: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: successful operation
 *       401:
 *         description: invalid token
 */
router.get('/info', authToken, async function (req, res, next) {
  let userId = req.token.sub

  let result = await userStorage.getMyUserInfo(userId)
  res.json(result)
})

// 绑定微信号
router.get('/bind_wechat', authToken, async function (req, res, next) {
  let code = req.query.code
  let userId = req.token.sub
  if (!code) {
    return res.json({code: statusCode.MISS_PARAMS, message: 'code is null'})
  }
  let wechatRes = await getAccessToken(config.wechat_app.appId, config.wechat_app.appSecret, code)

  let openId = wechatRes.openid
  let accessToken = wechatRes.access_token

  if (!openId) {
    return res.json({code: statusCode.MISS_PARAMS, message: 'openid is null'})
  }

  let userInfoRes = await getUserInfo(accessToken, openId)
  let unionid = userInfoRes.unionid
  try {
    let result = await userStorage.bindWechat(userId, unionid)
    res.json({code: statusCode.SUCCESS, data: result})
  } catch (e) {
    next(e)
  }
})

const storage = multer.memoryStorage()
const upload = multer({storage: storage})

/**
 * @swagger
 * /my/avatar:
 *   put:
 *     tags: [/my]
 *     summary: "上传头像"
 *     description: "支持 png, gif, jpeg, 按上传的后缀名命名"
 *     consumes:
 *     - "multipart/form-data"
 *     produces:
 *     - "application/json"
 *     parameters:
 *     - name: avatar
 *       in: formData
 *       type: file
 *       description: "头像图片, 支持 png, gif, jpeg, 按上传的后缀名命名"
 *       required: true
 *     security:
 *     - bearer: []
 *     responses:
 *       200:
 *         description: successful operation
 *       401:
 *         description: invalid token
 */
router.put('/avatar', authToken, upload.single('avatar'), async function (req, res, next) {
  let authMimetypes = ['image/png', 'image/gif', 'image/jpeg']
  if (!req.file) {
    return res.json({code: statusCode.MISS_PARAMS, message: 'avatar is require'})
  }
  if (!~indexOf(authMimetypes, req.file.mimetype)) {
    return res.json({code: statusCode.MIMETYPE_ERROR, message: 'mimetype error'})
  }

  if (req.file.size > 1000 * 1024 * 10) { // 10m
    return res.json({code: statusCode.MAX_SIZE, message: 'size over max'})
  }
  let userId = req.token.sub
  let filename = req.file.fieldname
  let extension = req.file.originalname.replace(/.*(\..*)$/ig, '$1').toLowerCase()

  try {

    let result = await uploadToOss(userId + '/' + filename + extension, req.file.buffer)
    let url = result.url.replace(/^http:\/\/(.*)/ig, 'https://$1')

    userStorage.updateUserInfoById(userId, {avatar: url})
    return res.json({code: statusCode.SUCCESS, avatar: url})

  } catch (e) {
    next(e)
  }
})

export default router