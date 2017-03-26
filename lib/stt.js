const watson = require('watson-developer-cloud')
const config = require('../config.js')

console.log('Estou escutando, pode falar agora.')

const speechToText = watson.speech_to_text({
  username: config.STTUsername,
  password: config.STTPassword,
  version: 'v1'
})

module.exports = speechToText