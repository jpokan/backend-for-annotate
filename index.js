const app = require('express')()
// Use dotenv in development only
if (app.get('env') === 'development') {
	require('dotenv').config()
} else {
	console.log('dotenv deactivated in production')
}

console.log('Starting server in: ' + app.get('env') + ' mode')

const session = require('express-session')
const session_config = require('./sessions/config')

// GLOBAL PRODUCTION SETTINGS
if (process.env.NODE_ENV === 'production') {
	// trust first proxy is required if server is behind a proxy server
	app.set('trust proxy', 1) // true in production
	// Cookies in production needs to be sent with these options
	session_config.cookie.sameSite = 'none' // Because cookies are sent to a different domains or site
	session_config.cookie.secure = true // Because cookies must be sent with HTTPS
}
app.use(session(session_config))

app.get('/', (req, res) => {
	res.sendFile(`${__dirname}/static/index.html`)
})

// Notion Auth routes
const notionAuth = require('./auth/notion/routes')
app.use('/auth/notion', notionAuth)

const port = process.env.PORT || 5000
app.listen(port, () => console.log('listenning to port: ' + port))
