const fs = require('fs')

const KEYS_FILE_NAME_PREFIX = 'pub_keys.'
const KEYS_FILE_NAME_EXT = '.json'

module.exports = async function(context, req) {

  let alg = context.bindingData.alg
  alg = alg.substring(0, 5).toLowerCase()

  context.log(`JavaScript HTTP trigger function processed a request for jwks_url for alg ${alg}`)

  const keysFileName = `${KEYS_FILE_NAME_PREFIX}${alg}${KEYS_FILE_NAME_EXT}`

  if (!fs.existsSync(keysFileName)) {
    context.log(`jwks not available, algorithm public key not found ${keysFileName}`)
    context.res = {
      status: 500,
      body: {
        errorMessage: `jwks not available for alg ${alg}`
      }
    }
    return 
  } // .if

  try {
    const ks = fs.readFileSync(keysFileName)
    context.res = {
      status: 200,
      body: ks,
      headers: {
        'Content-Type': 'application/json'
      }
    } // .res
  
  } catch (err) {
    context.log('exception: ', err.message)
    context.res = {
      status: 500,
      body: {
        errorMessage: err.message
      }
    }
  } // try catch
} // .module.exports