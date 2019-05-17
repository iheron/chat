import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

export default new Schema({
    type              : String,      // 配置类型, 'system': 系统, 'android': android, 'ios': ios
    version           : String,      // 当前最新版本号
    version_deprecated: Array,       // 不支持的版本号
    server_api        : Array,
    base_path         : String,
    url_download      : String,
  },
  {
    collection: 'settings',
    timestamps:
      {createdAt: 'created_at', updatedAt: 'updated_at'}
  })
