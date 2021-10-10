const store = require('./store')

// Sessions Development Configuration
let session_config = {
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

// GLOBAL PRODUCTION SETTINGS
if (process.env.NODE_ENV === 'production') {
	// Cookies in production needs to be sent with these options
	session_config.cookie.sameSite = 'none' // Because cookies are sent to a different domains or site
	session_config.cookie.secure = true // Because cookies must be sent with HTTPS
}

module.exports = session_config
