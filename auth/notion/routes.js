const express = require('express')
const router = express.Router()
const getAccessToken = require('./get-access-token')
const frontendURL = process.env.FRONTEND_URL

const corsHeaders = (req, res, next) => {
	res.set('Access-Control-Allow-Origin', frontendURL)
	res.set('Access-Control-Allow-Credentials', true)
	res.set('Access-Control-Allow-Headers', 'Accept')
	next()
}
router.use(corsHeaders)

/**
 * Notion Public Integration Routes
 */

router.get('/', async (req, res) => {
	try {
		const code = req.query.code
		const result = await getAccessToken(code)
		if (result) {
			// Save results to session
			req.session.token = result
		}
		res.redirect(frontendURL)
	} catch {
		res.redirect(frontendURL)
	}
})

router.get('/session/status', async (req, res) => {
	// if session with access token exist, connection status online is true
	if (req.session.token) {
		console.log('Connection OK')
		res.json({ online: true })
	} else {
		res.status(403).json({
			online: false,
			error_message: 'Not connected'
		})
	}
})

router.post('/session/disconnect', async (req, res) => {
	req.session.destroy()
	console.log('Session was terminated.')
	res.json({ online: false })
})

const search = require('./search')
const queryDatabase = require('./query-database')
router.get('/search', async (req, res) => {
	try {
		const secret = req.session.token.access_token
		const databases = await search('[review]', secret)
		const data = await Promise.all(
			databases.results.map(async (database) => {
				return { table: database, ...(await queryDatabase(database.id, secret)) }
			})
		)
		res.json({ data: data })
	} catch {
		res.status(403).json({
			error_message: 'Query failed.'
		})
	}
})

module.exports = router
