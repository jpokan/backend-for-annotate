const app = require('express')()

console.log('Starting server in: ' + app.get('env') + ' mode')

if (app.get('env') === 'development') {
	require('dotenv').config()
} else {
	// trust first proxy is required if server is behind a proxy server
	app.set('trust proxy', 1) // true in production
}

const session = require('express-session')
const session_config = require('./sessions/config')

// GLOBAL PRODUCTION SETTINGS
if (process.env.NODE_ENV === 'production') {
	// Cookies in production needs to be sent with these options
	session_config.cookie.sameSite = 'none' // Because cookies are sent to a different domains or site
	session_config.cookie.secure = true // Because cookies must be sent with HTTPS
}
app.use(session(session_config))

app.get('/', (req, res) => {
	res.sendFile(`${__dirname}/static/index.html`)
})

const getAccessToken = require('./auth/notion/get-access-token')
const frontendURL = process.env.FRONTEND_URL

/**
 * Notion Public Integration Routes
 */

app.get('/auth/notion', async (req, res) => {
	try {
		const code = req.query.code
		const result = await getAccessToken(code)
		if (result) {
			// Delete stored session if it exists
			// Save results to session
			req.session.token = result
		}
		res.redirect(frontendURL)
	} catch (error) {
		res.redirect(frontendURL)
	}
})

app.get('/auth/notion/session/status', async (req, res) => {
	res.set('Access-Control-Allow-Origin', frontendURL)
	res.set('Access-Control-Allow-Credentials', true)
	res.set('Access-Control-Allow-Headers', 'Accept')

	// if session with access token exist
	// it is an authenticated user
	if (req.session.token) {
		// Use token to get data from Notion API
		const response = {
			id: req.sessionID,
			online: true
		}
		res.json(response)
		// else the session is not available and does not have any data
	} else {
		res.status(403).json({
			id: req.sessionID,
			online: false,
			error_message: 'No connection to Notion has been set'
		})
	}
})

app.post('/auth/notion/session/disconnect', async (req, res) => {
	res.set('Access-Control-Allow-Origin', frontendURL)
	res.set('Access-Control-Allow-Credentials', true)
	res.set('Access-Control-Allow-Headers', 'Accept')

	req.session.cookie.maxAge = 1
	req.session.touch()
	const response = {
		id: req.sessionID,
		online: false
	}
	console.log('Session was terminated.')
	res.json(response)
})

const port = process.env.PORT || 5000
app.listen(port, () => console.log('listenning to port: ' + port))
