const dotenv = require('dotenv').config()
const { Client } = require('@notionhq/client')

// Init Client
const notion = new Client({
	auth: process.env.NOTION_ACCESS_TOKEN
})

const getDatabase = async () => {
	const databaseId = process.env.NOTION_DATABASE_ID
	const res = await notion.databases.query({ database_id: databaseId })
	return { 
		statusCode: 200,
		body: JSON.stringify(res)
	}
}

// getDatabase()

const getPage = async () => {
	const pageId = process.env.NOTION_PAGE_ID
	const res = await notion.pages.retrieve({ page_id: pageId })
	console.log(res);
}

// getPage()
module.exports = { getDatabase }