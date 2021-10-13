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
	} catch (error) {
		res.redirect(frontendURL)
	}
})

router.get('/session/status', async (req, res) => {
	// if session with access token exist, connection status online is true
	if (req.session.token) {
		const response = {
			id: req.sessionID,
			online: true
		}
		res.json(response)
	} else {
		res.status(403).json({
			id: req.sessionID,
			online: false,
			error_message: 'Not connected'
		})
	}
})

router.post('/session/disconnect', async (req, res) => {
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
