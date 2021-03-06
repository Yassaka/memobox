const prompt = require('prompt')
const fs = require('fs')
const probe = require('node-ffprobe')
const exec = require('child_process').exec
const mic = require('mic')
const TJBot = require('tjbot')
// Local imports
const config = require('./config.js')
const conversation = require('./lib/conversation')
const speechToText = require('./lib/stt')
const textToSpeech = require('./lib/tts')
const taskSwitch = require('./lib/taskSwitch')

const hardware = ['led', 'servo', 'microphone', 'speaker']
const micParams = {
	rate: 44100,
	channels: 2,
	debug: false,
	exitOnSilence: 6
}
const credentials = {}
const configuration = {
    verboseLogging: true,
    robot: {
        gender: 'female'
    },
    listen: {
        language: 'pt-BR'
    },
    speak: {
        language: 'pt-BR'
    },
    name: 'Memo Box'
}
const tj = new TJBot(hardware, configuration, credentials)
let pauseDuration = 1
const micInstance = mic(micParams)
const micInputStream = micInstance.getAudioStream()
micInputStream.on('pauseComplete', () => {
	console.log('Microphone paused for', pauseDuration, 'seconds.');
	setTimeout(() => {
			micInstance.resume();
			console.log('Microphone resumed.')
	}, Math.round(pauseDuration * 1000)) //Stop listening when speaker is talking
})
micInstance.start()


const textStream = micInputStream.pipe(
	speechToText.createRecognizeStream({
		content_type: 'audio/l16; rate=44100; channels=2',
		model: 'pt-BR_BroadbandModel'
	})
).setEncoding('utf8')

textStream.on('data', (spokenText) => {
	let context = {}
	let userSpeech = spokenText.toLowerCase()
	console.log('Você disse:', userSpeech) 

	conversation.message({
		workspace_id: config.ConWorkspace,
		input: { 'text': userSpeech },
		context: context
	}, (err, response) => {
		tj.shine('orange')
		context = response.context
		watsonResponse = response.output.text[0]
		
		if (typeof watsonResponse !== 'undefined') {
			taskSwitch(context)
			
			speak(watsonResponse)
		}
	})
})

const speak = (text) => {
	let params = {
		text: text,
		voice: config.voice,
		accept: 'audio/wav'
	}
	textToSpeech.synthesize(params)
	.pipe(fs.createWriteStream('output.wav'))
	.on('close', () => {
		console.log('Memo Box diz:', text)

		probe('output.wav', (err, probeData) => {
			if (!err && typeof probeData !== 'undefined') {
				tj.wave()
				tj.shine('green')
				pauseDuration = probeData.format.duration + .5
				micInstance.pause()
				exec('play output.wav', (error, stdout, stderr) => {
					if (error !== null) {
						console.log('exec error: ' + error)
					}
				})
			}

		})
	})
}