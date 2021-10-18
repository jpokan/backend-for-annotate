const { Client } = require('@notionhq/client')

const search = async (query, secret) => {
	console.log('Searching databases...')
	const notion = new Client({ auth: secret })

	const response = await notion.search({
		query: query,
		sort: {
			direction: 'descending',
			timestamp: 'last_edited_time'
		},
		filter: {
			value: 'database',
			property: 'object'
		}
	})

	return response
}

module.exports = search
