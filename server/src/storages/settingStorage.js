import mongoose from 'mongoose'
import settingSchema from '../schemas/settingSchema'

export default class SettingStorage {
  constructor () {
    this.settingModel = mongoose.connection.model('settings', settingSchema)
  }

  async getSettings (type) {
    return await this.settingModel.findOne({type: new RegExp(type, 'ig')}).lean()
  }
}