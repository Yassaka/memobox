const watson = require('watson-developer-cloud');
const mic = require('mic');
const config = require('../config.js');

const micParams = {
  rate: 48000,
  channels: 1,
  debug: false,
  exitOnSilence: 6
}
const micInstance = mic(micParams)
const micInputStream = micInstance.getAudioStream()
micInstance.start()

console.log('Estou escutando, pode falar agora.')

const speechToText = watson.speech_to_text({
  username: config.STTUsername,
  password: config.STTPassword,
  version: 'v1'
})

const textStream = micInputStream.pipe(
  speechToText.createRecognizeStream({
    content_type: 'audio/l16; rate=48000; channels=1',
    model: 'pt-BR_BroadbandModel',
    continuous: true,
  })).setEncoding('utf8')

textStream.on('data', (spokenText) => {
  console.log('Bela escutou:', spokenText)
})