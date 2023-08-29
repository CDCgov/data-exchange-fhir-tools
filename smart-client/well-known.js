const axios = require('axios')
const config = require('./config')

async function info() {
    const fhirUrl = config.getValue(config.FHIR_SERVER_URL_KN)
    if (fhirUrl instanceof Error) {
        console.error(fhirUrl)
        return fhirUrl
    } // .if

    const fhirWellKnownUrl = `${fhirUrl}/.well-known/smart-configuration`

    try {
        response = await axios.get(fhirWellKnownUrl)

        const wellKnown = response.data

        const {
            authorization_endpoint,
            token_endpoint,
            registration_endpoint,
        } = wellKnown
    
        return {
            authorizeUrl: authorization_endpoint && new URL(authorization_endpoint),
            tokenUrl: token_endpoint && new URL(token_endpoint),
            registerUrl: registration_endpoint && new URL(registration_endpoint),
        }

    } catch (err) {
        console.error(err)
        return err 
    }

} // .info

module.exports = {
    info,
}