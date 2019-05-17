import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

export default new Schema({
    username: String,
    password: String,
    email: String,
    mobile: String,          // 手机号码
    avatar: String,          // 头像
    qr_code: Buffer             //二维码图片保存字段
  },
  {
    timestamps:
      {createdAt: 'created_at', updatedAt: 'updated_at'}
  })