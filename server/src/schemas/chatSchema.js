import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

export default new Schema({
    from_name: String,
    to_name  : String,
    message  : String,
    time     : Date
  },
  {
    collection: 'chat_logs',
    timestamps:
      {createdAt: 'created_at', updatedAt: 'updated_at'}
  })