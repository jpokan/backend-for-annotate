const axios = require('axios')
const qs = require('qs')
const colors = require('colors')

/**
 * Exchanging the grant for an access token
 *
 * Sends POST request to Notion's token URL https://api.notion.com/v1/oauth/token
 * using HTTP Basic Authentication
 * Credentials must be base64 encoded
 *
 * Header format reference: Authorization: Basic {client_id}:{client_secret}
 */

const getAccessToken = (code) => {
	let credential = `${process.env.DEV_OAUTH_CLIENT_ID}:${process.env.DEV_OAUTH_CLIENT_SECRET}`

	if (process.env.NODE_ENV === 'production') {
		credential = `${process.env.PROD_OAUTH_CLIENT_ID}:${process.env.PROD_OAUTH_CLIENT_SECRET}`
	}
	const encodedCredential = Buffer.from(credential).toString('base64')

	const data = qs.stringify({
		code: code,
		grant_type: 'authorization_code'
		// redirect_uri: 'https://notion-server-jpokan.herokuapp.com/auth/notion'
	})

	const config = {
		method: 'post',
		url: 'https://api.notion.com/v1/oauth/token',
		headers: {
			'Authorization': `Basic ${encodedCredential}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		data: data
	}

	// Send POST request with axios and return access token with some extra info
	let result = axios(config)
		.then(function (response) {
			// Retrieved Access Token Succesfully
			console.log(colors.green('[ getAccessToken ] ') + 'Access Token retrieved successfully.')
			return response.data
		})
		.catch(function (error) {
			console.log(colors.red('[ getAccessToken ] ') + 'Access Token exchange denied by Notion.')
			console.error(error.response.data)
			throw error.response.data
		})

	return result
}

module.exports = getAccessToken
