const express = require('express')
const router = express.Router()
const getAccessToken = require('./get-access-token')
/**
 * Notion Public Integration Routes
 */
const frontendURL = process.env.FRONTEND_URL.toString()

router.get('', async (req, res) => {
	try {
		const code = req.query.code
		const result = await getAccessToken(code)
		if (result) {
			// Delete stored session if it exists
			// Save results to session
			req.session.token = result
		}
		res.redirect(frontendURL)
	} catch (error) {
		res.redirect(frontendURL)
	}
})

router.get('/session/status', async (req, res) => {
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

router.post('/session/disconnect', async (req, res) => {
	res.set('Access-Control-Allow-Origin', frontendURL)
	res.set('Access-Control-Allow-Credentials', true)
	res.set('Access-Control-Allow-Headers', 'Accept')

	req.session.cookie.maxAge = 1
	req.session.touch()
	const response = {
		id: req.sessionID,
		online: false
	}
	console.log('Session was terminated.')
	res.json(response)
})

module.exports = router
