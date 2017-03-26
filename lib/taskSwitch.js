const fetch = require('node-fetch')

const taskSwitch = (context) => {
	if (typeof context.pertence !== 'undefined') {
		sendMessage('pertence', context.pertence)
	}
}

const sendMessage = (type, value) => {
	switch (type) {
		case 'pertence':
			if (value === 'Celular')
				fetch(`https://memobox.mybluemix.net/find-phone`)
					.then((res) => res.json())
					.then((data) => console.log('response data', data))
			console.log('chamou!')
			break
	}
}

module.exports = taskSwitch