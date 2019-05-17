import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

let schema = new Schema({
    product_no  : {type: String, index: true},
    product_name: {type: String, index: true},
    product_sid : {type: String, index: true},
    type        : {type: String, index: true},          // 型号
    position    : {type: String, index: true},          // 仓位
    stock       : {type: Number, index: true},          //库存
    cost        : {type: Number, index: true},          // 成本
  },
  {
    collection: 'products',
    timestamps:
      {createdAt: 'created_at', updatedAt: 'updated_at'},
  })

schema.index({created_at: -1})
schema.index({updated_at: -1})
export default schema