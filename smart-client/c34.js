const axios = require('axios')
const config = require('./config')

function hl7GetIdentifier(hl7) {

  const lines = hl7.split('\n')

  const lineStartingWithPID = lines.find(line => line.startsWith('PID'))

  if (!lineStartingWithPID) {
    const errMsg = 'no line starting with PID found'
    return new Error(errMsg)
  }// .if

  const elements = lineStartingWithPID.split('|')

  if (elements.length < 8) { // +1
    const errMsg = 'patient id not available in the PID segment'
    return new Error(errMsg)
  } // .if

  const identifier = elements[7]
  console.log('found identifier from PID segment:', identifier)
  
  return identifier
} // .hl7GetIdentifier

async function getMedicationRequest(identifier) {
    const fhirUrl = config.getValue(config.FHIR_SERVER_URL_KN)
    if (fhirUrl instanceof Error) {
        console.error(fhirUrl)
        return fhirUrl
    } // .if
  
    try {
        let fhirSearchUrl = `${fhirUrl}/MedicationRequest?patient=${identifier}`
        console.log('sending get request to: ', fhirSearchUrl)
        const result = await axios.get(fhirSearchUrl)
        console.log('received response status:', result.status)

        return {'MedicationRequest': result.data}
    
      } catch (err) {
    
        console.error(err)
        return err
      } // .try catch

} // .getMedicationRequest

async function getMedicationAdministration(identifier) {
    const fhirUrl = config.getValue(config.FHIR_SERVER_URL_KN)
    if (fhirUrl instanceof Error) {
        console.error(fhirUrl)
        return fhirUrl
    } // .if

    try {
        let fhirSearchUrl = `${fhirUrl}/MedicationAdministration?patient=${identifier}`
        console.log('sending get request to: ', fhirSearchUrl)
        const result = await axios.get(fhirSearchUrl)
        console.log('received response status:', result.status)

        return {'MedicationAdministration': result.data}
    
      } catch (err) {
    
        console.error(err)
        return err
      } // .try catch

} // .getMedicationAdministration

module.exports = {
    hl7GetIdentifier, getMedicationRequest, getMedicationAdministration
}