import {verifyToken,signToken} from '../helpers/token'
import productSchema from '../schemas/productSchema'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { ClientType } from '../helpers/const'

export default class ProductStorage {
  constructor () {
    this.productModel = mongoose.connection.model('products', productSchema)
    // this.productModel.createIndex({update_at:-1})
  }

  /**
   * 添加机器人
   * @param model
   * @returns {Promise<void>}
   */
  async addProduct (model) {
    try {
      let product = await this.productModel.create(model)
      return product
    } catch (e) {
      throw  e
    }

  }

  /**
   *
   * @param id
   * @param model
   * @returns {Promise<void>}
   */
  async editProduct (id, model) {
    try {
      let product = await this.productModel.updateOne({_id: id}, {$set: model})
      return product
    } catch (e) {
      throw e
    }
  }

  async getProduct () {
    try {
      return await this.productModel.find().sort({updated_at: -1})
    } catch (e) {
      throw e
    }
  }

  async getProductById (id) {
    try {
      return await this.productModel.findOne({_id: id})
    } catch (e) {
      throw e
    }
  }

  async delProductById(id){
    try {
      return await this.productModel.remove({_id: id})
    } catch (e) {
      throw e
    }
  }


}
