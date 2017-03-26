const watson = require('watson-developer-cloud') 
const config = require('../config.js')

const tone_analyzer = watson.tone_analyzer({
  username: config.ToneUsername,
  password: config.TonePassword,
  version: 'v3',
  version_date: '2016-05-19'
})

let text = 'I love watson'
tone_analyzer.tone({
	text: text,
	model: 'pt-BR_BroadbandModel'
}, (err, tone) => {
  console.log(JSON.stringify(tone, null, 2))
})