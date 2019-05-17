import express from 'express'
import ProductStorage from '../storages/productStorage'
import statusCode from '../helpers/statusCode'
import { authToken } from '../helpers/sign'

const router = express.Router()
const productStorage = new ProductStorage()

/**
 * @api {get} /api/events
 */
router.get('/', authToken, async function (req, res, next) {
  try {
    let results = await productStorage.getProduct()
    res.json(results)
  } catch (e) {
    next(e)
  }
})

router.post('/', authToken, async function (req, res, next) {
  let model = req.body
  try {
    delete model['_id']
    let result = await productStorage.addProduct(model)
    res.json({code: statusCode.SUCCESS, result: result})
  } catch (e) {
    next(e)
  }
})

router.put('/', authToken, async function (req, res, next) {
  let model = req.body
  let id = model._id
  delete model._id
  try {
    let result = await robotStorage.editRobot(id, model)
    res.json({code: statusCode.SUCCESS, result: result})
  } catch (e) {
    next(e)
  }
})

router.patch('/', authToken, async function (req, res, next) {
  let model = req.body
  let id = model._id
  delete model._id
  try {
    let result = await robotStorage.editRobot(id, model)
    res.json({code: statusCode.SUCCESS, result: result})
  } catch (e) {
    next(e)
  }
})

router.get('/:id', authToken, async function (req, res, next) {
  let id = req.params.id
  try {
    let results = await robotStorage.getRobotById(id)
    res.json(results)
  } catch (e) {
    next(e)
  }
})
router.delete('/:id', authToken, async function (req, res, next) {
  let id = req.params.id
  try {
    let results = await robotStorage.delRobotById(id)
    res.json({code: statusCode.SUCCESS})
  } catch (e) {
    next(e)
  }
})

export default router
