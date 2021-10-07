require('dotenv').config()
const app = require('express')()
const session = require('express-session')
const MongoStore = require('connect-mongo')

const port = process.env.PORT || 5000

// Initiate MongoDB connection with connect-mongo
const store = MongoStore.create({
	mongoUrl: process.env.MONGODB_URI || process.env.MONGODB_DEV_URI,
	dbName: 'app_annotate',
	collectionName: 'sessions',
	touchAfter: 24 * 3600 // Modify after this amount of time has passed
})

let appURL = 'http://localhost:3000'
// let appDomain
// if (app.get('env') === 'production') {
//   app.set('trust proxy', 1) // trust first proxy
//   sess.cookie.secure = true // serve secure cookies
// }\
console.log(app.get('env'))

if (process.env.MONGODB_URI) {
	appURL = 'https://n-annotate.netlify.app'
	appDomain = 'n-annotate.neltify.app'
}
// Sessions Configuration
app.use(
	session({
		name: 'annotate.sid',
		secret: process.env.EXPRESS_SESSION_SECRET,
		store: store,
		path: '/',
		// domain: appDomain,
		cookie: {
			maxAge: 24 * 60 * 60 * 1000, // 24 hours
			sameSite: 'none',
			httpOnly: true
			// secure: true // Set to true for production
		},
		saveUninitialized: false,
		resave: false
	})
)

app.get('/', (req, res) => {
	res.sendFile(`${__dirname}/static/index.html`)
})

/**
 * Notion Private Integration endpoint
 */

const queryDatabase = require('./notion')

app.get('/api/queryDatabase', async (req, res) => {
	res.set('Access-Control-Allow-Origin', appURL)
	res.set('Access-Control-Allow-Credentials', true)
	try {
		const response = await queryDatabase()
		res.json(response)
	} catch (error) {
		res.send(error)
	}
})

/**
 * Notion Public Integration endpoint
 */

const getAccessToken = require('./get-access-token')
const storeToken = require('./store-token')

app.get('/auth/notion', async (req, res) => {
	try {
		const sid = req.query.state
		const code = req.query.code
		const result = await getAccessToken(code)
		if (result) {
			// Delete stored session if it exists
			store.destroy(sid)
			// Creates new session
			req.session.token = result.access_token
			storeToken(result).catch(console.dir)
		}
		res.redirect(appURL)
	} catch (err) {
		console.error(err)
		res.redirect(appURL)
	}
})

app.get('/api/public/queryDatabase', async (req, res) => {
	res.set('Access-Control-Allow-Origin', appURL)
	res.set('Access-Control-Allow-Credentials', true)
	if (req.session.token) {
		// Use token to get data from Notion API
		const response = {
			id: req.sessionID
		}

		res.json(response)
	} else {
		res.status(403).json({})
	}
})

app.listen(port, () => console.log('listenning to port: ' + port))
