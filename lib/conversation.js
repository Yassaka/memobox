const watson = require('watson-developer-cloud') //to connect to Watson developer cloud
const config = require('../config.js') // to get our credentials and the attention word from the config.js files

const conversation = watson.conversation({
  username: config.ConUsername,
  password: config.ConPassword,
  version: 'v1',
  version_date: '2016-07-11'
})

module.exports = conversation