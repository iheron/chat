import defaultConfig from './default'
import developmentConfig from './development'
import productionConfig from './production'

let env = process.env.NODE_ENV

let index = defaultConfig
if (env === 'development') {
  index = developmentConfig
} else if (env === 'production') {
  index = productionConfig
}

export default index