if (process.env.ENV === 'production') {
  module.exports = require('./production')
} else if (process.env.ENV === 'localhost') {
  module.exports = require('./localhost')
} else {
  module.exports = require('./development')
}