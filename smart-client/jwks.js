const jose = require('node-jose')
const fs = require('fs')
const config = require('./config')
const crypto = require('crypto')


async function keys() {

    const fileName = config.getKeysFileName()
    if (fileName instanceof Error ) {
        return fileName   
    } // .if

    try {
        
        const ks = fs.readFileSync(fileName)
        const keyStore = await jose.JWK.asKeyStore(ks.toString())
        
        return keyStore.toJSON()

    } catch (err) {
        console.error(err)
        return err 
    } // .try catch

} // .keys


async function createJwt(tokenUrl) {

    const fileName = config.getKeysFileName()
    if (fileName instanceof Error ) {
        return fileName 
    } // .if

    const clientId = config.getValue(config.CLIENT_ID_KN)
    if ( clientId instanceof Error) {
        console.error(clientId)
        return clientId
    } // .if 

    const ks = fs.readFileSync(fileName)
    const keyStore = await jose.JWK.asKeyStore(ks.toString())
    const [key] = keyStore.all({ use: 'sig' })
  
    const dateNow = Math.floor(Date.now() / 1000)
    let expiryDate = Math.floor( new Date(new Date().setHours(new Date().getHours() + 1)) / 1000 )
    
    const opt = { compact: true, jwk: key, fields: { 
        typ: 'jwt', 
        jku: config.getJwksUrl(), 
        kid: config.getJwksKey(ks)} 
    } // .opt
    const payload = JSON.stringify({
      exp: expiryDate,
    //   iat: dateNow,
      sub: clientId,
      iss: clientId,
      aud: tokenUrl,
      jti: crypto.randomBytes(8).toString('hex')
    })
    const token = await jose.JWS.createSign(opt, key)
      .update(payload)
      .final()
    
    return token 
} // .create


// to generate a new key, currently not used in the app to create new keys
function create(fileName) {
    const alg = 'RS256'
    // alg : 'RS384', 'RS256'

    if (fs.existsSync(fileName)) {
        return new Error(`file ${fileName} already exists`)
    } // .if 

    const keyStore = jose.JWK.createKeyStore()
    keyStore.generate('RSA', 2048, {alg: alg, use: 'sig' })
    .then( _ => {
        fs.writeFileSync(
            fileName, 
            JSON.stringify(keyStore.toJSON(true), null, '  ')
        )
    })

} // .create


module.exports = { keys, createJwt }


