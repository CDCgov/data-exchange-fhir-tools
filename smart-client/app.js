const express = require('express')
const bodyParser = require('body-parser')
const packageJson = require('./package.json') 
const axios = require('axios')

const wellKnown = require('./well-known')
const jwks = require('./jwks')
const store = require('./store')
const c34 = require('./c34')

const config = require('./config')

const app = express()

// Middleware to parse JSON requests
app.use(bodyParser.json())

// version endpoint
app.get('/', (req, res) => {
  const packageInfo = {
    name: packageJson.name,
    version: packageJson.version,
    serverTime: new Date().toISOString() // Add the current server time
  }
  res.json(packageInfo)
}) 


app.get('/config', (req, res) => {

  const configObj = config.get()
  if (configObj instanceof Error) {
    return res.status(500).send({errorMessage:configObj.message})
  } // .if

  // avoid expose app config secret on this config route
  const keys = Object.keys(configObj).filter(key => key != config.CLIENT_SECRET_KN)
  const configObjReduced = keys.reduce( (obj, key) => {
      obj[key] = configObj[key]
      return obj
  }, {})

  res.json(configObjReduced)
}) // .config


app.get('/store', (req, res) => {

  const result = store.get()
  if (result instanceof Error) {
    return res.status(500).send({errorMessage:result.message})
  } // .if

  res.json(result)
})
app.post('/store', (req, res) => {

    const result = store.set(req.body)
    if (result instanceof Error) {
      return res.status(500).send({errorMessage:result.message})
    } // .if

    res.json(result)
})
app.delete('/store', (req, res) => {

  const result = store.remove()
  if (result instanceof Error) {
    return res.status(500).send({errorMessage:result.message})
  } // .if

  res.json(result)
}) // .store


// server endpoint to retrieve well-know from the set fhir server
app.get('/well-known-info', async (req, res) => {

  const result = await wellKnown.info()
  if (result instanceof Error) {
    return res.status(500).send({errorMessage:result.message})
  } // .if 

  res.json(result)
}) // .well-known-info


// jwks_url returns jwks keys
app.get('/jwks_url', async (req, res) => {

  const jwksKeys = await jwks.keys()
  if (jwksKeys instanceof Error) {
    return res.status(500).send({errorMessage: jwksKeys.message})
  }

  res.json(jwksKeys)
}) // .jws_url


// get jwt one time used for auth the client to the FHIR authorization server
app.get('/jwt1', async(req, res) => {

    const wellKnownInfo = await wellKnown.info()
    if (wellKnownInfo instanceof Error) {
      return res.status(500).send({errorMessage: wellKnownInfo.message})
    } // .if 
    const tokenUrl = wellKnownInfo['tokenUrl']

    // create a jwt
    const jwt1 = await jwks.createJwt(tokenUrl) 
    if ( jwt1 instanceof Error) {
      return res.status(500).send({errorMessage: jwt1.message})
    } // .if
    const jwt1Json = {jwt1: jwt1}
    store.setValues(jwt1Json)
    res.json(jwt1Json) 
}) // .jwt1


// get bearer token from fhir server
// symmetric client authentication
app.get('/bearer/shared-secret', async (req, res) => {

  const clientId = config.getValue(config.CLIENT_ID_KN)
  if ( clientId instanceof Error ) {
    res.status(500).send({errorMessage: clientId.message})
    return 
  } // .if 
  const clientSecret = config.getValue(config.CLIENT_SECRET_KN)
  if ( clientSecret instanceof Error ) {
    res.status(500).send({errorMessage: clientSecret.message})
    return 
  } // .if 
  const fhirServerAuthUrl = config.getValue(config.FHIR_SERVER_AUTH_URL_KN)
  if ( fhirServerAuthUrl instanceof Error ) {
    res.status(500).send({errorMessage: fhirServerAuthUrl.message})
    return 
  } // .if 
  
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
    store.setValues({accessToken: accessToken}) // bearer = token['access_token']

    res.send(accessToken)

  } catch (err) {
    console.error(err)
    res.status(500).send({errorMessage: err.message})
  } // try catch

}) // .bearer/shared-secret


// get bearer token from fhir server
// asymmetric client authentication
app.get('/bearer/public-key', async (req, res) => {

  const wellKnownInfo = await wellKnown.info()
  if (wellKnownInfo instanceof Error) {
    return wellKnownInfo
  } // .if 
  const tokenUrl = new URL (wellKnownInfo['tokenUrl'])

  // create a jwt
  const jwt1 = await jwks.createJwt(tokenUrl) 
  if ( jwt1 instanceof Error) {
    return res.status(500).send({errorMessage: jwt1.message})
  } // .if

  store.setValues({jwt1: jwt1})
  console.info('store value set with jwt1 one time authorization request token')

  const params = new URLSearchParams()
  params.append('scope', 'system/*.read')
  params.append('grant_type', 'client_credentials')
  params.append('client_assertion_type', 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer')
  params.append('client_assertion', jwt1)
  const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
  }

  try {
    console.log('sending access token request to ', tokenUrl.href)
    const authResp = await axios.post(tokenUrl, params, {
      // params: params,
      headers: headers
    })

    const accessToken = authResp.data 
    store.setValues({accessToken: accessToken})
    
    res.send(accessToken)

  } catch (err) {

    console.error(err)
    res.status(500).send({errorMessage: err.message})
  } // .try catch
}) // ./bearer/public-key


// get fhir searches
app.get('/fhir-search/*', async (req, res) => {

  const urlParts = req.url.split('/fhir-search/')
  const fhirSearch = urlParts.pop()


  if (!fhirSearch) {
    res.status(404).send({errorMessage: 'empty search'})
    return 
  } // .if 

  const fhirServerUrl = config.getValue(config.FHIR_SERVER_URL_KN)
  if ( fhirServerUrl instanceof Error ) {
    res.status(500).send({errorMessage: fhirServerUrl.message})
    return 
  } // .if 

  const accessToken = config.getValue('accessToken')
  if (accessToken instanceof Error) {
    console.error(accessToken)
    res.status(500).send({errorMessage: accessToken.message})
    return
  } // .if
  const bearerToken = accessToken['access_token']

  const headers = {
    'Authorization': `Bearer ${bearerToken}`
  }

  try {
    const fhirSearchUrl = `${fhirServerUrl}${fhirSearch}`
    console.log('sending get request to: ', fhirSearchUrl)
    const result = await axios.get(fhirSearchUrl, {headers:headers})
    console.log('received response status:', result.status)

    res.send(result.data)

  } catch (err) {

    console.error(err)
    res.status(500).send({errorMessage: err.message})
  } // .try catch
}) // .fhir-search/

// server endpoint to retrieve metadata from the set fhir server
app.get('/metadata', async (req, res) => {

  try {
    const fhirServerUrl = config.getValue(config.FHIR_SERVER_URL_KN)

    const fhirMetadataUrl = `${fhirServerUrl}metadata`
    console.log('sending get request to: ', fhirMetadataUrl)
    const result = await axios.get(fhirMetadataUrl)
    console.log('received response status:', result.status)

    res.send(result.data)

  } catch (err) {

    console.error(err)
    res.status(500).send({errorMessage: err.message})
  } // .try catch
}) // .metadata

const textParser = bodyParser.text({ type: 'text/plain' })
// server endpoint for connecthaton 34
app.post('/c34', textParser, async (req, res) => {

  const hl7 = req.body

  const identifier = c34.hl7GetIdentifier(hl7)
  if ( identifier instanceof Error ){
    console.error(identifier)
    res.status(500).send({errorMessage: identifier.message})
    return
  } // .if

  const medicationRequest = await c34.getMedicationRequest(identifier)
  if ( medicationRequest instanceof Error ) {
    res.status(500).send({errorMessage: medicationRequest.message})
    return 
  } // .if 

  const medicationAdministration = await c34.getMedicationAdministration(identifier)
  if ( medicationAdministration instanceof Error ) {
    res.status(500).send({errorMessage: medicationAdministration.message})
    return 
  } // .if 

    const combined = {
      "hl7": hl7,
      ...medicationRequest,
      ...medicationAdministration
    } // .combined

    res.send(combined)
}) // .c34


// Start the server
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.info(`Server is running on port ${port}`)
})
