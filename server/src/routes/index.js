import express from 'express'


const router = express.Router()



/**
 * @swagger
 * /:
 *   get:
 *     tags: [/]
 *     summary: "初始化配置"
 *     description: |
 *       type: 类型
 *       version: 当前最新的版本
 *       server_api: 服务器列表
 *       base_path: api路径
 *       url_download: 下载地址
 *       outdated: 是否过时, true为已过时的客户端, 需要更新
 *     produces:
 *     - "application/json"
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           $ref: '#/definitions/Settings'
 */
router.get('/',  async function (req, res, next) {
  try {

    return res.json('ok')
  } catch (e) {
    next(e)
  }
})

export default router
