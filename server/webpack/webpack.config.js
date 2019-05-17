const path = require('path')

module.exports = {
  SERVER_ENTRY : path.join(process.cwd(), 'src'),
  CONFIG_ENTRY : path.join(process.cwd(), 'config'),
  DIST: path.join(process.cwd(), 'dist')
}