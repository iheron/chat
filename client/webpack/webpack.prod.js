const path = require('path')
const fs = require('fs')
const CONFIG = require('./webpack.config')
const {DIST, SERVER_ENTRY, CONFIG_ENTRY} = CONFIG

const CleanWebpackPlugin = require('clean-webpack-plugin')

function getExternals () {
  const nodeModules = fs.readdirSync(path.join(process.cwd(), 'node_modules'))
  return nodeModules.reduce(function (ext, mod) {
    ext[mod] = 'commonjs ' + mod
    return ext
  }, {})
}

module.exports = {
  target   : 'node',
  //mode     : 'production',
  output   : {
    path    : DIST,
    filename: 'index.js'
  },
  entry    : [SERVER_ENTRY],
  externals: getExternals(),
  module   : {
    rules: [
      {
        test   : /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader : 'babel-loader',
          options: {
            presets: [ ["@babel/preset-env", {
              "targets": {
                "node": "current"
              }
            }]],
            plugins: []
          }
        }
      }
    ]
  },
  plugins  : [
    new CleanWebpackPlugin(['dist'])
  ]
}