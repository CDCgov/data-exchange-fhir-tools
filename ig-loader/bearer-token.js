const axios = require('axios')

async function getBearerToken(fhirServerAuthUrl, clientId, clientSecret) {

    const bodyParams = new URLSearchParams()
    bodyParams.append('grant_type', 'client_credentials')
    bodyParams.append('client_id', clientId)
    bodyParams.append('client_secret', clientSecret)
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  
    try {
      const authResp = await axios.post(fhirServerAuthUrl, bodyParams, {
        headers: headers
      })
      const accessToken = authResp.data
      return accessToken
  
    } catch (err) {
      console.error(err)
      return err 
    } // try catch


} // .getBearerToken

module.exports = { getBearerToken }