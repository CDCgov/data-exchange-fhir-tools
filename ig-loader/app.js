(async function main(){
    
    const dotenv = require('dotenv').config()

    //
    //     Folder with IG FHIR resource .json files 
    //
    const folderPath = 'ig-files-to-load'

    //
    //     Set up FHIR server URL
    //
    const fhirServerAuthUrl = process.env.FHIR_SERVER_AUTH_URL
    console.log('starting auth to fhirServerAuthUrl', fhirServerAuthUrl)

    //
    //      Receiving a bearer token from the FHIR server
    //
    const { getBearerToken } = require('./bearer-token')
    let bearerToken
    try {

        bearerToken = await getBearerToken(fhirServerAuthUrl, process.env.APP_CLIENT_ID, process.env.APP_SHARED_SECRET)
        if ( bearerToken instanceof Error ) {
            console.error('error authenticating, continue without token', bearerToken)
            bearerToken = ''
            // return 
        } // .if 

    } catch (err) {
        console.error('error getting bearer token', err)
        return 
    } // .try catch


    //
    //      Reading folder files and loading the files into the FHIR server
    //
    const {promises: fs} = require('fs')
    const path = require('path')
    const { loadResourceFile } = require('./load-resource-file')
    const fhirServerUrl = process.env.FHIR_SERVER_URL
    let countProcessed = 0
    let count = 0
    try {

        const files = await fs.readdir(folderPath)
    
        if (files.length === 0) {
            const errMsg = `empty folder ${folderPath}`
            console.error(errMsg)
            return new Error(errMsg)
        } // .if
    
        for(const file of files) {
            const filePath = path.join(folderPath, file)

            // Check if the file is a directory or a regular file
            const fileStats = await fs.stat(filePath)

            if (fileStats.isFile()) {
                // process the file here
                const time1 = new Date()
                console.log('start processing file:', file)

                const fileContent = await fs.readFile(filePath, {encoding: "utf-8"})
                count++
                const result = await loadResourceFile(file, fileContent, fhirServerUrl, bearerToken)
                if ( result instanceof Error ){
                    // console.error(`error processing file ${file}: ${result}`)
                    // continue to next file  
                } else {
                    countProcessed++
                }
                const time2 = new Date()
                console.log(`done processing in ${time2-time1} ms file:${file}`)


            } else if (fileStats.isDirectory()) {
                console.log('folder found not processing:', file)
            } // .if else

            // }) // .stat 

        } // .for 

    } catch (err) {
        console.error('error loading', err)
    } // .try catch

    console.log(`processed files ${countProcessed} of total ${count}`)
})()// .main


