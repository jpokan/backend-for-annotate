const { Client } = require('@notionhq/client')

// Init Client
const notion = new Client({
	auth: process.env.NOTION_PUBLIC_INTEGRATION_ACCESS_TOKEN
})

const queryDatabase = async () => {
	const databaseId = process.env.NOTION_DATABASE_ID
	const res = await notion.databases.query({ database_id: databaseId })
	return res
}

const retrievePage = async () => {
	const pageId = process.env.NOTION_PAGE_ID
	const res = await notion.pages.retrieve({ page_id: pageId })
	return res
}

module.exports = queryDatabase
