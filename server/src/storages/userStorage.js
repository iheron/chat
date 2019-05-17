import find from 'lodash/find'
import index from '../../config/config'
import mongoose from 'mongoose'
import userSchema from '../schemas/userSchema'
import TokenStorage, { TOKEN_TYPE } from './tokenStorage'
import RobotStorage from './robotStorage'
import moment from 'moment'
import QRCode from 'qrcode'
import { base34Hash } from '../helpers/crypto'
import sequenceSchema from '../schemas/sequenceSchema'
import userWechatSchema from '../schemas/userWechatSchema'
import filter from 'lodash/filter'
import statusCode, { errorStatus } from '../helpers/statusCode'
import map from 'lodash/map'
import robotSchema from '../schemas/robotSchema'
import mobileWhiteList from '../helpers/mobileWhiteList'
import indexOf from 'lodash/indexOf'

const tokenStorage = new TokenStorage()
const codeSource = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ'
const robotStorage = new RobotStorage()

const pointEnum = {
  'register': 0,
  'bindWeChat': 888,  //绑定we Chat
  'invitation': 2000, //邀请用户积分
  'effective': 2000,//有效用户积分
  'shareNews': 80,  //分享积分
  'shareFocus': 80,  //分享脱壳关注
  'shareCoin': 80, //分享币体检
  'shareWeChat': 80,//微信  qq二维码 链接分享  分享统一的注册地址
  'shareToken': 80,//币种分享
  'shareMarket': 80, //交易对分享

}

const _TOKEN_EXP_ = 2592000         // 30天 (s)
const _WECHAT_ACCESS_TOKEN_KEY_ = 'wechat_access_token:' // wechat access token

export default class SignStorage {
  constructor () {
    // super(config.mongodb)
    this.userModel = mongoose.connection.model('users', userSchema)
    this.userWechatModel = mongoose.connection.model('user_wechat', userWechatSchema)
    this.sequenceModel = mongoose.connection.model('sequence', sequenceSchema)
    this.robotModel = mongoose.connection.model('robots', robotSchema)
  }

  // async setAccessToken (key, res) {
  //   return await redisStorage.set(_WECHAT_ACCESS_TOKEN_KEY_ + key, JSON.stringify(res), 'EX', _TOKEN_EXP_)
  // }
  getCryptMobile (mobile) {
    return mobile.replace(/(\d{2}).*(\d{2})/ig, '$1*******$2')
  }

  /**
   * 根据id修改用户信息
   * @param userId
   * @param updateCondition
   * @returns {Promise<void>}
   */
  async updateUserInfoById (userId, updateCondition) {
    await this.userModel.updateOne({_id: userId}, {$set: updateCondition})
  }

  /**
   * 修改或绑定手机号 todo
   * @param userId
   * @returns {Promise<*>}
   */
  async updateMobile (userId, mobile) {
    let findUser = await this.userModel.findOne({_id: userId})
    if (!!findUser.mobile) {

    } else {
      await this.userModel.updateOne({_id: userId}, {$set: {mobile: mobile}})
    }

  }

  /**
   * 邀请注册用户
   * @param userId 邀请方id
   * @param mobile 被邀请方手机号
   * @param valid 邀请方 邀请码
   * @returns {Promise<number>}
   */
  async register (userId, mobile) {
    let findUser = await this.userModel.findOne({mobile: mobile}, {
      '_id': 1,
      'invitation': 1,
      'invited_user_id': 1,
      'bind_wechat': 1,
    })

    let inviteUser = null
    try {
      inviteUser = await this.userModel.findOne({_id: userId}, {
        '_id': 1,
        'invitation': 1,
        'invited_user_id': 1
      })

    }
    catch (e) {
      return statusCode.OBJECT_ID_ERROR
    }
    //添加新用户
    if (!findUser) {
      let now = new Date()
      let statusExamine = {count: 1, time: now}
      let newUser = await this.userModel.create({
        mobile: mobile, invited_user_id: userId,
        examine_status: statusExamine,
        star_tokens: [
          {type: TOKEN_TYPE.TOKEN, code: 'Bitcoin'},
          {type: TOKEN_TYPE.TOKEN, code: 'Ethereum'},
          {type: TOKEN_TYPE.TOKEN, code: 'BitcoinCash'}]
      })
      if (newUser) {
        return statusCode.SUCCESS
      }
    }
    else {
      if (findUser && findUser.bind_wechat) {
        return statusCode.INVITE_USER_AUTH_ERROR
      }
      if (!inviteUser) {
        return statusCode.INVITE_ERROR
      }
      if (findUser.invited_user_id) {
        return statusCode.INVITE_HAS_CODE_ERROR
      }
      let checkUserId = findUser._id.toString()
      let checkInviteUserId = inviteUser._id.toString()
      if (checkUserId == checkInviteUserId) {
        return statusCode.INVITE_USER_CODE_ERROR
      }
      findUser.set({invited_user_id: userId})
      let updateResult = await findUser.save()
      if (updateResult) {
        return statusCode.SUCCESS
      }
    }
  }

  /**
   * 生成二维码
   * @param findUser
   * @param invitationCode
   * @returns {Promise<*>}
   */
  async generatorQrcode (findUser, invitationCode) {
    let userId = findUser._id
    let baseUrl = config.platform.apiBaseUrl
    console.log(baseUrl)
    let qrCode = await QRCode.toDataURL(`${baseUrl}m/register?id=${userId}&&invitation=${invitationCode}`)
    const bufferCode = Buffer.from(qrCode.replace(/.+,/, ''), 'base64')

    let updateResult = await this.userModel.updateOne({_id: userId}, {
      invitation: invitationCode,
      qr_code: bufferCode
    })

    if (updateResult) {
      let returnResult = await this.userModel.findOne({_id: userId}, {
        '_id': 1,
        'invitation': 1,
        'qr_code': 1,
        'created_at': 1
      }).lean()
      return returnResult
    }
  }

  /**
   * 获取二维码
   * @returns {Promise<void>}
   */
  async getQrcode (userId) {

    let findUser = await this.userModel.findOne({_id: userId}, {
      '_id': 1,
      'mobile': 1,
      'invitation': 1,
      'qr_code': 1,
      'created_at': 1
    }).lean()

    if (findUser && !findUser.invitation) {
      let seqResult = await this.sequenceModel.findOne({})

      let generatorNumber = 10000
      if (seqResult) {
        generatorNumber = seqResult.num
      }
      else {
        let newSeq = await this.sequenceModel.create({num: generatorNumber})
      }

      let invitationCode = base34Hash(generatorNumber)

      if (invitationCode) {
        seqResult.set({num: ++generatorNumber})
        let checkNewSeq = await seqResult.save()
        if (checkNewSeq) {
          let _id = findUser._id
          let baseUrl = config.platform.apiBaseUrl

          let qrCode = await QRCode.toDataURL(`${baseUrl}m/register?id=${_id}&&invitation=${invitationCode}`)
          const bufferCode = Buffer.from(qrCode.replace(/.+,/, ''), 'base64')

          let updateResult = await this.userModel.updateOne({_id: userId}, {
            invitation: invitationCode,
            qr_code: bufferCode
          })

          if (updateResult) {
            let returnResult = await this.userModel.findOne({_id: userId}, {
              '_id': 1,
              'invitation': 1,
              'qr_code': 1,
              'created_at': 1
            }).lean()
            return returnResult
          }
        }
      }
    }
    else {
      let checkMobile = indexOf(mobileWhiteList, findUser.mobile)
      if (checkMobile >= -1) {
        console.log('!!!!!!new code')
        return await this.generatorQrcode(findUser, findUser.invitation)
      }
      return findUser
    }

  }

  /**
   * 获取用户积分信息
   * @param userId
   * @returns {Promise<*>}
   */
  async getUserPointInfo (userId) {
    let baseUrl = config.platform.apiBaseUrl
    let findUser = await this.userModel.findOne({_id: userId}, {
      '_id': 1,
      'mobile': 1,
      'point': 1,
      'invitation': 1
    }).lean()

    let invitationUser = await this.userModel.find({invited_user_id: userId}, {
      '_id': 1,
      'bind_wechat': 1,
      'invited_user_id': 1,
    })

    let invitationList = filter(invitationUser, function (item) { return !item.bind_wechat })
    let effectiveList = filter(invitationUser, function (item) { return item.bind_wechat })
    findUser.invitationCoun = invitationList.length
    findUser.effectiveCoun = effectiveList.length
    findUser.invitationScore = findUser.invitationCoun * pointEnum.invitation
    findUser.effectctiveScore = findUser.effectiveCoun * pointEnum.effective
    if (findUser.hasOwnProperty('_id')) {
      let _id = findUser._id
      findUser.regiserURL = `${baseUrl}m/register?id=${_id}`
    }
    return findUser
  }

  /**
   * 获取币体检信息
   * @param userId
   * @returns {Promise<boolean>}
   */
  async getExamine (userId) {
    let findUser = await this.userModel.findOne({_id: userId}, {
      'examine_status': 1,
      'point': 1
    })
    if (!findUser.examine_status) {
      let now = new Date()
      let count = 1
      let statusExamine = {count: count, time: now}
      findUser.set({examine_status: statusExamine})
      let updateResult = await findUser.save()
    }
    else {
      let checkTime = moment(findUser.examine_status.time)
      let checkNow = moment()
      let isSameDay = checkTime.isSame(checkNow, 'day')
      if (!isSameDay) {
        let statusExamine = {count: 1, time: new Date()}
        findUser.set({examine_status: statusExamine})
        let updateResult = await findUser.save()
      }
    }
    return findUser
  }

  /**
   * 增加币体检次数  同一天自增  新一天从1开始
   * @param userId
   * @returns {Promise<*>}
   */
  async managerExamine (userId, type) {
    let findUser = await this.userModel.findOne({_id: userId}, {
      'examine_status': 1,
      'point': 1
    })
    let hasExamine = true
    if (!findUser.examine_status) {
      let now = new Date()
      let count = type === 'share' ? 2 : 0
      let statusExamine = {count: count, time: now}
      findUser.set({examine_status: statusExamine})
      let saveResult = await findUser.save()
    }
    else {
      let checkCount = findUser.examine_status.count
      let checkTime = moment(findUser.examine_status.time)
      let checkNow = moment()
      let isSameDay = checkTime.isSame(checkNow, 'day')
      if (!isSameDay) {
        let statusExamine = {count: 1, time: new Date()}
        findUser.set({examine_status: statusExamine})
        let updateResult = await findUser.save()
        checkCount = updateResult.examine_status.count
      }

      if (checkCount === 0 && type === 'examine') {
        hasExamine = false
      }
      else {
        let newCount = checkCount
        hasExamine = newCount > 0
        newCount = type === 'share' ? ++checkCount : (checkCount === 0 ? 0 : --checkCount)
        if (type === 'share') {
          hasExamine = true
        }
        let statusShared = {count: newCount, time: new Date()}
        findUser.set({examine_status: statusShared})
        let updateCountResult = await findUser.save()
      }
    }

    let returnUser = await this.userModel.findOne({_id: userId}, {
      'examine_status': 1,
      'point': 1
    }).lean()
    returnUser.checkType = type
    returnUser.hasExamine = hasExamine
    return returnUser
  }

  async bindWeChatAddPoint (userId) {
    let findUser = await this.userModel.findOne({_id: userId}, {
      'point': 1,
      'point_status_shared': 1,
      'invited_user_id': 1,
      'bind_wechat': 1,
      'isFirstBind': 1,
    })
    let bindSuccess = 1
    if (!findUser.isFirstBind) {
      let orgPoint = findUser.point ? findUser.point : 0
      let addPoint = orgPoint + pointEnum['bindWeChat']
      findUser.set({point: addPoint, isFirstBind: 1, bind_wechat: bindSuccess})
      let updateResult = await findUser.save()
      if (updateResult && findUser.invited_user_id) {
        let _invitationId = findUser.invited_user_id
        let invitationUser = await this.userModel.findOne({_id: _invitationId}, {
          'point': 1,
        })
        if (invitationUser) {
          let orgInvitationPoint = invitationUser.point ? invitationUser.point : 0
          let addInvitationPoint = orgInvitationPoint + pointEnum['effective']
          invitationUser.set({point: addInvitationPoint})
          let updateInvitationResult = await invitationUser.save()
          if (updateInvitationResult) {
            return updateResult
          }
        }
        else {
          return updateResult
        }
      }
    }else{
      findUser.bind_wechat = 1
      await findUser.save()
    }
    return findUser
  }

  /**
   * 添加用户积分
   * @param userId
   * @param type
   * @returns {Promise<void>}
   */
  async addPoint (userId, type) {
    let findUser = await this.userModel.findOne({_id: userId}, {
      'point': 1,
      'point_status_shared': 1,
      'invited_user_id': 1,
      'bind_wechat': 1,
      'isFirstBind': 1,
    })

    if (!findUser.point_status_shared) {
      let orgPoint = findUser.point ? findUser.point : 0
      let addPoint = orgPoint + pointEnum[type]
      let now = new Date()
      let statusShared = {count: 1, time: now}
      findUser.set({point_status_shared: statusShared, point: addPoint})
      let updateResult = await findUser.save()
      if (updateResult) {
        return updateResult
      }
    }
    else {
      let checkCount = findUser.point_status_shared.count
      let checkTime = moment(findUser.point_status_shared.time)
      let checkNow = moment()
      let isSameDay = checkTime.isSame(checkNow, 'day')
      if (isSameDay && checkCount >= 3) {
        return findUser
      }
      else {
        let orgPoint = findUser.point ? findUser.point : 0
        let addPoint = orgPoint + pointEnum[type]
        let now = new Date()
        let newCount = ++findUser.point_status_shared.count
        if (!isSameDay) {
          newCount = 1
        }
        let statusShared = {count: newCount, time: now}
        findUser.set({point_status_shared: statusShared, point: addPoint})
        let updateResult = await findUser.save()
        if (updateResult) {
          return updateResult
        }
      }
    }
  }

  /**
   * 获取用户的信息
   * @returns {Promise<void>}
   */
  async getMyUserInfo (userId) {
    let user = await this.userModel.findOne({_id: userId})
    let result
    if (user) {
      result = {
        avatar: user.avatar,
        mobile: this.getCryptMobile(user.mobile),
        point: user.point || 0,
        bind_wechat: user.bind_wechat || 0
      }
    }

    return result
  }

  async bindWechat (userId, unionid) {
    let userWechat = await this.userWechatModel.findOne({$or: [{user_id: userId}, {'wechat.unionid': unionid}]})

    let newUserWechat
    if (!userWechat) {
      newUserWechat = await this.userWechatModel.create({user_id: userId, 'wechat': {unionid: unionid}})
    } else {
      if (!userWechat.user_id) {
        userWechat.user_id = userId
        userWechat.wechat = {unionid: unionid}
        newUserWechat = await userWechat.save()
      }
    }

    let bindResult = await this.bindWeChatAddPoint(userId)
    return bindResult

  }

  async getUserById (userId) {
    let user = await this.userModel.findOne({_id: userId}).lean()
    return user
  }

  /**
   * 添加机器人
   * @param userId
   * @param robotId
   * @returns {Promise<void>}
   */
  async addRobotByUserId (userId, robotId) {
    let robot = await robotStorage.getRobotById(robotId)
    if (robot) {
      let user = await this.userModel.findOne({_id: userId})
      let findRobot = find(user.robots, {robot_id: robotId})
      if (findRobot) {
        throw errorStatus(statusCode.MY_ROBOT_IS_EXITS, 'robot is exist')
      } else {
        user.robots = user.robots || []
        user.robots.push({robot_id: robotId, is_valid: false})
        user.save()
      }
    }
  }

  async getAllRobots () {
    return await this.robotModel.find({status: 1, '$where': 'this.friend_count < this.friend_max_count'}, {
      _id: 1,
      'nikename': 1,
      'avatar': 1
    })
  }

  async getRobotsByUserId (userId) {
    let user = await this.userModel.findOne({_id: userId}).lean()
    let robotIds = map(user.robots, 'robot_id')
    let results = await this.robotModel.find({_id: {$in: robotIds}}, {_id: 1, 'nikename': 1, 'avatar': 1})

    return results
  }

  async getUserByInvitation (invitation) {
    let user = await this.userModel.findOne({invitation: invitation}, {'_id': 1, 'invitation': 1}).lean()
    if (!user) {
      throw errorStatus(statusCode.INVITE_CODE_ERROR, 'has no user use this invitation')
    } else {
      return user
    }
  }

  async bindUserAndRobot (userId, robotId) {
    let user = await this.userModel.findOne({_id: userId})
    if (user) {
      let findRobot = find(user.robots, {robot_id: robotId})
      findRobot.is_valid = true
      user.markModified('robots')
      await user.save()
    }
  }
}