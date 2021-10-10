const app = require('express')()

console.log('Starting server in: ' + app.get('env') + ' mode')

if (app.get('env') === 'development') {
	require('dotenv').config()
}

const session = require('express-session')
const session_config = require('./sessions/config')

app.use(session(session_config))

app.get('/', (req, res) => {
	res.sendFile(`${__dirname}/static/index.html`)
})

const notionAuth = require('./auth/notion/routes')
app.use('/auth/notion', notionAuth)

const port = process.env.PORT || 5000
app.listen(port, () => console.log('listenning to port: ' + port))
