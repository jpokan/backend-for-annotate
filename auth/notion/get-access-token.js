const axios = require('axios')
const qs = require('qs')
const colors = require('colors')

/**
 * A function to exchange a code grant for an access token from the Notion API
 *
 * To do this we send a POST request with axios to Notion's endpoint https://api.notion.com/v1/oauth/token using HTTP Basic Authentication.
 *
 * In this request we need to send the credentials (client_id and client_secret) that must be base64 encoded
 *
 * Header format reference: Authorization: Basic {client_id}:{client_secret}
 *
 * We then return the access token that is an object.
 *
 * @param {string} code Code grant that Notion Api returns in the http response querystring params
 * @return {object} Returns an Access Token object with the secret along with other information
 */

let credential
if (process.env.NODE_ENV === 'production') {
	credential = `${process.env.PROD_OAUTH_CLIENT_ID}:${process.env.PROD_OAUTH_CLIENT_SECRET}`
} else {
	credential = `${process.env.DEV_OAUTH_CLIENT_ID}:${process.env.DEV_OAUTH_CLIENT_SECRET}`
}

const encodedCredential = Buffer.from(credential).toString('base64')

const getAccessToken = (code) => {
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
	return axios(config)
		.then(function (response) {
			console.log(colors.green('[ getAccessToken ] ') + 'Access Token retrieved successfully.')
			return response.data
		})
		.catch(function (error) {
			console.log(colors.red('[ getAccessToken ] ') + 'Access Token exchange denied by Notion.')
			console.error(error.response.data)
			throw error.response.data
		})
}

module.exports = getAccessToken
