const { Client } = require('@notionhq/client')

const queryDatabase = async (databaseId, secret) => {
	console.log('Querying database... ' + databaseId)
	const notion = new Client({ auth: secret })

	const response = await notion.databases.query({
		database_id: databaseId
	})
	return response
}

module.exports = queryDatabase
