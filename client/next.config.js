const webpack = require('webpack')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const cssLoaderConfig = require('@zeit/next-css/css-loader-config')

const withSass = require('@zeit/next-sass')

const nextConfig = {
  cssModules          : true,
  cssLoaderOptions    : {
    importLoaders : 1,
    localIdentName: '[local]___[hash:base64:5]'
  },

  lessLoaderOptions   : {
    javascriptEnabled: true
  },
  sassLoaderOptions   : {},
  plugins             : {
    'postcss-css-variables': {}
  },
  postcssLoaderOptions: {
    parser: true,
    config: {
      ctx: {
        theme: JSON.stringify(process.env.REACT_APP_THEME)
      }
    }
  }
}

module.exports = withSass({
  ...nextConfig,
  webpack: (config, options) => {
    const {dev, isServer} = options

    /*************** less ***************/
    const cssConfig = {
      extensions: ['less'],
      cssModules      : true,
      cssLoaderOptions: {
        importLoaders : 1,
        localIdentName: '[local]'
      }
    }
    options.defaultLoaders.less = cssLoaderConfig(config, {
      ...cssConfig,
      dev,
      isServer,
      loaders: [
        {
          loader : 'less-loader',
          options: {javascriptEnabled: true}
        }
      ]
    })
    config.module.rules.push({
      test: /\.less$/,
      use: options.defaultLoaders.less
    })

    /*************** less ***************/
    let env = '"development"'
    if (process.env.ENV === 'production') {
      env = '"production"'
    }
    else if (process.env.ENV === 'localhost') {
      env = '"localhost"'
    }
    else {
      env = '"development"'
    }
    config.plugins.push(new webpack.DefinePlugin({
      'process.env.ENV': env
    }))


    return config
  }
})