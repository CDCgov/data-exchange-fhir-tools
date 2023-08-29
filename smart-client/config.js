const args = process.argv

const dotenv = require('dotenv').config( { path: process.argv[2] })
const fs = require('fs')
const store = require('./store')

const CLIENT_ID_KN = 'appClientId'
const CLIENT_SECRET_KN = 'appClientSecret'
const JWKS_URL_BASE_KN = 'appJwksUrlBase'
const APP_KEYS_ALG_KN = 'appKeysAlg'
const FHIR_SERVER_URL_KN = 'fhirServerUrl'
const FHIR_SERVER_AUTH_URL_KN = 'fhirServerAuthUrl'


function getValue(key) {
    const configObj = get()
    if (configObj instanceof Error || !configObj[key]) {
        const errorMessage = `error: configuration not available for key ${key}`
        console.log(errorMessage)
        return Error(errorMessage)
    } // .if
    return configObj[key] 
} // .getValue


function getKeysFileName() {
    const alg = getValue(APP_KEYS_ALG_KN)
    if ( alg instanceof Error) {
        console.error(alg)
        return alg 
    } // .if 

    const fileName = `keys.${alg}.json`

    if (!fs.existsSync(fileName)) {
        return new Error(`keys not available, not found ${fileName}`)
    } // .if
    return fileName
} // .getKeysFileName


function getJwksUrl() {

    const baseUrl = getValue(JWKS_URL_BASE_KN)
    if ( baseUrl instanceof Error ){
        console.error(baseUrl)
        return baseUrl
    } // .if
    const alg = getValue(APP_KEYS_ALG_KN)
    if( alg instanceof Error ) {
        console.error(alg)
        return alg 
    } // .if

    return `${baseUrl}${alg}`
} // .getJwksUrl


function getJwksKey(ks) {

    // currently running only one key
    return JSON.parse(ks)['keys'][0]['kid']
} // .getJwksKey


function get() {

    try {

        const dotenvConfig = JSON.parse(process.env.APP_CONFIG_JSON)
        const storeConfig = store.get() 

        if (storeConfig instanceof Error) {
            // dynamic store not set, return from config
            return dotenvConfig 
        } // .if

        // return everything from the store plus additional, of what's not store set, from config
        const configObj =  Object.keys(dotenvConfig).reduce(( acc, key ) => {
            if ( !(key in acc) ) {
                acc[key] = dotenvConfig[key]
            }
            return acc 
        }, storeConfig)

        return configObj  
    } catch (err) {
        console.error('config error: ', err.message)
        console.error(err)
        return err 
    } // try catch 
} // .get


function set(jsonObj) {

    return store.set(jsonObj)
} // .set 


function remove() {

    return store.remove()
} // .remove 


module.exports = { get, set, remove, getValue,
    getKeysFileName, getJwksUrl, getJwksKey,
    APP_KEYS_ALG_KN, 
    FHIR_SERVER_URL_KN,
    FHIR_SERVER_AUTH_URL_KN,
    CLIENT_ID_KN,
    CLIENT_SECRET_KN,
    JWKS_URL_BASE_KN
}