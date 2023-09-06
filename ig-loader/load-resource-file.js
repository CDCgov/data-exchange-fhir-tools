const axios = require('axios')

//
//     Only this FHIR resource types will be loaded into the server 
//
const RESOURCE_TYPE_LIST = [
    'CodeSystem',
    'ValueSet',
    'ConceptMap',
    'SearchParameter',
    'OperationDefinition',
    'StructureDefinition',
    'CapabilityStatement',
    'ImplementationGuide'
] // .const


async function loadResourceFile(fileName, fileContent, targetUrl, bearerToken) {

    try {
        const fileJson = JSON.parse(fileContent)

        const resourceType = fileJson['resourceType']
        if (!resourceType) {
            const errMsg = `file does not have key resourceType ${fileName}`
            console.error(errMsg)
            return new Error(errMsg)
        } // .if
    
        if (RESOURCE_TYPE_LIST.includes(resourceType)) {
    
            // console.log('TODO...')
    
    
        } else {
            const errMsg = `file does not contain a needed resourceType ${fileName}`
            console.error(errMsg)
            return new Error(errMsg)
        } // .if else

    } catch(err) {
        console.error(`file ${fileName} read error ${err.message}`)
        return err 
    } // .try catch

} // .loadResourceFile

module.exports = { loadResourceFile }