const { getDatabase } = require('./notion')
const express = require('express')
const app = express()
const port = process.envPORT || 8009

app.get('/getDatabase', async (req, res) => {
	const response = await getDatabase()
	res.json(response)
})
app.listen(port, () => console.log('listenning to port: ' + port))

