const store = require('./store')

// Sessions Development Configuration
let session_config = {
	name: 'annotate.sid',
	secret: process.env.EXPRESS_SESSION_SECRET,
	store: store,
	cookie: {
		path: '/auth/notion',
		maxAge: 36 * 60 * 60 * 1000,
		//    hrs * min * sec * ms
		httpOnly: true,
		sameSite: '',
		secure: false
	},
	saveUninitialized: false,
	resave: true
}

module.exports = session_config
