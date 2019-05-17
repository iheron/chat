## 项目架构
* React + Next + Redux + Ant design


## 环境
* node v8.x
* yarn v1.7, 所有包管理使用yarn安装

## 常用命令
* yarn install           # 安装所有依赖
* yarn add [name] --save # 安装一个依赖
* yarn run dev           # 开启调试环境
* yarn run build         # 打包
* yarn run start         # 生产环境

## 参考资料
* next https://nextjs.org/docs
* redux https://redux.js.org/
* ant design https://ant.design/

## 文件结构
* /actions , redux的action文件
* /components , react的ui组件
* /containers , redux的容器组件
* /helper, 工具文件
* /intl , 多语言支持
* /layouts , 布局文件
* /pages , 路由页面
* /reducers , redux的reducer
* /server, 服务端
* /static, 静态文件,图片
* /store, redux的store
* /styles, 与页面相关的css, 使用sass模块
* /themes, 与ant design相关的css,使用less模块