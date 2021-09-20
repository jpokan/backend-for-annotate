const { getDatabase } = require('./notion')
const express = require('express')
const app = express()
const port = process.env.PORT || 8009

app.get('/getDatabase', async (req, res) => {
	res.set('Access-Control-Allow-Origin', 'http://localhost:3000')
	const response = await getDatabase()
	res.json(response)
})
app.listen(port, () => console.log('listenning to port: ' + port))

