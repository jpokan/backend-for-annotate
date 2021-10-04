const axios = require('axios')
const qs = require('qs')

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
	const credential = `${process.env.OAUTH_CLIENT_ID}:${process.env.OAUTH_CLIENT_SECRET}`
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
			return response.data
		})
		.catch(function (error) {
			// Couldn't get Access Token
			console.log("Couldn't get Access Token")
			throw {
				...error.response.data,
				error_message: error.message,
				status: error.response.status
			}
		})

	return result
}

module.exports = getAccessToken
