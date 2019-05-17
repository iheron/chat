const webpack = require('webpack')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const cssLoaderConfig = require('@zeit/next-css/css-loader-config')
//const commonsChunkConfig = require('@zeit/next-css/commons-chunk-config')
//const withCss = require('@zeit/next-css')
const withSass = require('@zeit/next-sass')
const withLess = require('@zeit/next-less')
const fileExtensions = new Set()
let extractCssInitialized = false
const nextConfig = {
  // distDir: 'build',
  cssModules          : true,
  cssLoaderOptions    : {
    importLoaders : 1,
    localIdentName: '[local]___[hash:base64:5]'
  },
  // extractCSSPlugin    : extractSASS,
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

// fix: prevents error when .css files are required by node
// if (typeof require !== 'undefined') {
//   require.extensions['.css'] = (file) => {}
// }

module.exports = withSass({
  ...nextConfig,
  webpack: (config, options) => {
    const {dev, isServer} = options
    /*************** css ***************/
    // const cssConfig = {
    //   // cssModules      : true,
    //   // cssLoaderOptions: {
    //   //   importLoaders : 1,
    //   //   localIdentName: '[local]'
    //   // },
    //   extractCSSPlugin: extractCSS
    // }
    // options.defaultLoaders.css = cssLoaderConfig(config, extractCSS, {
    //   ...cssConfig,
    //   dev,
    //   isServer,
    // })
    //
    // config.module.rules.push({
    //   test: /\.css/,
    //   use : options.defaultLoaders.css
    // })
    //
    // config.plugins.push(extractCSS)
    /*************** css ***************/

    /*************** sass ***************/
    // const cssConfig = {
    //   cssModules          : true,
    //   cssLoaderOptions    : {
    //     importLoaders : 1,
    //     localIdentName: '[local]___[hash:base64:5]'
    //   },
    //   extractCSSPlugin    : extractSASS,
    //   // sassLoaderOptions   : {},
    //   // plugins             : {
    //   //   'postcss-css-variables': {}
    //   // },
    //   // postcssLoaderOptions: {
    //   //   parser: true,
    //   //   config: {
    //   //     ctx: {
    //   //       theme: JSON.stringify(process.env.REACT_APP_THEME)
    //   //     }
    //   //   }
    //   // }
    // }
    // options.defaultLoaders.sass = cssLoaderConfig(config, extractSASS, {
    //   ...cssConfig,
    //   dev,
    //   isServer,
    //   loaders: [
    //     {
    //       loader : 'sass-loader',
    //       options: {}
    //     }
    //   ]
    // })
    //
    // config.module.rules.push({
    //     test: /\.scss$/,
    //     use : options.defaultLoaders.sass
    //   },
    //   {
    //     test: /\.sass$/,
    //     use : options.defaultLoaders.sass
    //   })
    // config.plugins.push(extractSASS)
    // if (!isServer) {
    //   config = commonsChunkConfig(config, /\.sass/)
    // }
    /*************** sass ***************/

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

    //if (!isServer) {
    //  config.optimization.splitChunks.cacheGroups.styles = {
    //    name: 'themes',
    //    test: new RegExp(`\\.+(${[...fileExtensions].join('|')})$`),
    //    chunks: 'all',
    //    enforce: true
    //  }
    //}
    //if (!isServer && !extractCssInitialized) {
    //  config.plugins.push(
    //    new MiniCssExtractPlugin({
    //      // Options similar to the same options in webpackOptions.output
    //      // both options are optional
    //      filename: dev
    //        ? 'static/css/[name].css'
    //        : 'static/css/[name].[contenthash:8].css',
    //      chunkFilename: dev
    //        ? 'static/css/[name].chunk.css'
    //        : 'static/css/[name].[contenthash:8].chunk.css'
    //    })
    //  )
    //  extractCssInitialized = true
    //}
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
    // config.plugins.push(new webpack.DefinePlugin({
    //   'process.env.ENV': process.env.ENV === 'production' ? '"production"': '"development"',
    // }))

    return config
  }
})