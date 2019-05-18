## 项目架构
* node + express + mongoose


## 环境
* node v10.x
* yarn v1.16, 所有包管理使用yarn安装

## 常用命令
* yarn install           # 安装所有依赖
* yarn add [name] --save # 安装一个依赖
* yarn run dev           # 开启调试环境
* yarn run build         # 打包
* yarn run start         # 生产环境

## 参考资料
* express http://expressjs.com/en/4x/api.html
* mongoose https://mongoosejs.com/docs/guide.html

## 文件结构
* /config , config
* /src , 源代码根
* /src/helpers, 工具文件
* /src/routers , 路由
* /src/schemas , 数据模型
* /src/storages , 业务函数