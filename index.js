require('dotenv').config()
const app = require('express')()
const session = require('express-session')
const MongoStore = require('connect-mongo')
const port = process.env.PORT || 5000

const store = MongoStore.create({
	mongoUrl: 'mongodb://localhost:27017',
	dbName: 'app_annotate',
	collectionName: 'sessions',
	touchAfter: 24 * 3600 // Modify after this amount of time has passed
})

// Sessions Configuration
app.use(
	session({
		secret: process.env.EXPRESS_SESSION_SECRET,
		store: store,
		cookie: { maxAge: 60 * 1000 }, // 60 seconds
		saveUninitialized: true,
		resave: false
	})
)

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/static/index.html')
})

/**
 * Notion Private Integration endpoint
 */

const queryDatabase = require('./notion')

app.get('/api/queryDatabase', async (req, res) => {
	res.set('Access-Control-Allow-Origin', 'http://localhost:3000')
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
		const code = req.query.code
		const result = await getAccessToken(code)
		if (result) {
			storeToken(result).catch(console.dir)
		}
		res.redirect('http://localhost:3000/dashboard')
	} catch (err) {
		console.error(err)
		res.redirect('http://localhost:3000/')
	}
})

app.listen(port, () => console.log('listenning to port: ' + port))
