const fs = require('fs')
const jose = require('node-jose')


const keyStore = jose.JWK.createKeyStore()
keyStore.generate('RSA', 2048, {alg: 'RS384', use: 'sig' })
.then(_ => {
  fs.writeFileSync(
    './jwks-create/keys.new.RS384.json', 
    JSON.stringify(keyStore.toJSON(true), null, '  ')
  )
})

