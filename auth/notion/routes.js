const express = require('express')
const router = express.Router()
const getAccessToken = require('./get-access-token')
const store = require('../../sessions/store')
/**
 * Notion Public Integration Routes
 */
const frontendURL = process.env.FRONTEND_URL

router.get('/', async (req, res) => {
	try {
		const sid = req.query.state
		const code = req.query.code
		const result = await getAccessToken(code)

		if (result) {
			// Delete stored session if it exists
			store.destroy(sid)
			// Save results to session
			req.session.token = result
		}
		res.redirect(frontendURL)
	} catch (error) {
		res.redirect(frontendURL)
	}
})

router.get('/session', async (req, res) => {
	res.set('Access-Control-Allow-Origin', frontendURL)
	res.set('Access-Control-Allow-Credentials', true)
	res.set('Access-Control-Allow-Headers', 'Accept')
	// if session with access token exist
	// it is an authenticated user
	if (req.session.token) {
		// Use token to get data from Notion API
		const response = {
			id: req.sessionID,
			online: true
		}
		res.json(response)
		// else the session is not available and does not have any data
	} else {
		res.status(403).json({
			id: req.sessionID,
			online: false,
			error_message: 'No connection to Notion has been set'
		})
	}
})

module.exports = router
