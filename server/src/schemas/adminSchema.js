import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

// 管理员
export default new Schema({
    username: String,
    password: String,
    groups  : Array,
    auths   : Array
  },
  {
    collection: 'admins',
    timestamps:
      {createdAt: 'created_at', updatedAt: 'updated_at'}
  })