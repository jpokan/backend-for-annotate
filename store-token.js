const { MongoClient } = require('mongodb')
// Connection URI
const uri = process.env.MONGODB_URI || process.env.MONGODB_DEV_URI

// Create a new MongoClient
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})

const storeToken = async (data) => {
	try {
		// Connect the client to the server
		await client.connect()

		const notion_tokens = client.db('app_annotate').collection('notion_tokens')
		const token = await notion_tokens.findOne({ _id: data.bot_id })

		// Check if integration exists
		if (token) {
			console.log(`Current token exists ${token._id}`)
		} else {
			// Save to database
			const doc = {
				_id: data.bot_id,
				...data
			}
			await notion_tokens.insertOne(doc)
		}
	} finally {
		// Ensures that the client will close when you finish/error
		await client.close()
	}
}

module.exports = storeToken
