/**
 * This index.js file contains the main configurations
 * for development and production environments.
 */

require('dotenv').config()
const app = require('express')()
const session = require('express-session')
const port = process.env.PORT || 5000
const store = require('./sessions/store')

// Sessions Development Configuration
const sessionOptions = {
	name: 'annotate.sid',
	secret: process.env.EXPRESS_SESSION_SECRET,
	store: store,
	cookie: {
		path: '/',
		maxAge: 1 * 30 * 60 * 1000,
		//    hrs * min * sec * ms
		httpOnly: true,
		sameSite: '',
		secure: false
	},
	saveUninitialized: false,
	resave: true
}
app.use(session(sessionOptions))

console.log('Current environment is: ' + process.env.NODE_ENV)

// GLOBAL PRODUCTION SETTINGS
if (process.env.NODE_ENV === 'production') {
	// trust first proxy is required if server is behind a proxy server
	app.set('trust proxy', 1)
	// Cookies in production needs to be sent with these options
	sessionOptions.cookie.sameSite = 'none' // Because cookies are sent through different domains or sites
	sessionOptions.cookie.secure = true // Because cookies must be sent with HTTPS
}

app.get('/', (req, res) => {
	res.sendFile(`${__dirname}/static/index.html`)
})

const authNotion = require('./auth/notion/routes')
app.use('/auth/notion', authNotion)

app.listen(port, () => console.log('listenning to port: ' + port))
