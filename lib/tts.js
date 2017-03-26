const watson = require('watson-developer-cloud') //to connect to Watson developer cloud
const config = require('../config.js') // to get our credentials and the attention word from the config.js files

const textToSpeech = watson.text_to_speech({
  username: config.TTSUsername,
  password: config.TTSPassword,
  version: 'v1'
})

module.exports = textToSpeech