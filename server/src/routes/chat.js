import express from 'express'
const router = express.Router()

import ChatStorage from '../storages/chatStorage'
import statusCode from '../helpers/statusCode'
const chatStorage = new ChatStorage()

/**
 * @api {post} /chat/join_room
 */
router.post('/join_room', async function (req, res, next) {
  try {
    let client = chatStorage.createClient(req.body.username)
    res.json({code: statusCode.SUCCESS, username: client.username, addr: client.addr})
  } catch (e) {
    next(e)
  }
})
//
//router.post('/', authToken, async function (req, res, next) {
//  let model = req.body
//  try {
//    delete model['_id']
//    let result = await productStorage.addProduct(model)
//    res.json({code: statusCode.SUCCESS, result: result})
//  } catch (e) {
//    next(e)
//  }
//})
//
//router.put('/', authToken, async function (req, res, next) {
//  let model = req.body
//  let id = model._id
//  delete model._id
//  try {
//    let result = await robotStorage.editRobot(id, model)
//    res.json({code: statusCode.SUCCESS, result: result})
//  } catch (e) {
//    next(e)
//  }
//})
//
//router.patch('/', authToken, async function (req, res, next) {
//  let model = req.body
//  let id = model._id
//  delete model._id
//  try {
//    let result = await robotStorage.editRobot(id, model)
//    res.json({code: statusCode.SUCCESS, result: result})
//  } catch (e) {
//    next(e)
//  }
//})
//
//router.get('/:id', authToken, async function (req, res, next) {
//  let id = req.params.id
//  try {
//    let results = await robotStorage.getRobotById(id)
//    res.json(results)
//  } catch (e) {
//    next(e)
//  }
//})
//router.delete('/:id', authToken, async function (req, res, next) {
//  let id = req.params.id
//  try {
//    let results = await robotStorage.delRobotById(id)
//    res.json({code: statusCode.SUCCESS})
//  } catch (e) {
//    next(e)
//  }
//})

export default router
