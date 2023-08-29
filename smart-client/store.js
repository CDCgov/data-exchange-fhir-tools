const fs = require('fs')

const fileName = 'store.json'


function set(jsonObj) {

    try {

        fs.writeFileSync(fileName, JSON.stringify(jsonObj, null, 2), 'utf8')
        return { message: 'store set success' }

    } catch (err) {

        console.error(err)
        return err 
    } // .try

} // .set 


function get() {

    try {
        
        if (fs.existsSync(fileName)) { 

            const fileContent = fs.readFileSync(fileName, 'utf8')
            return JSON.parse(fileContent)
    
        } else {

            return new Error(`${fileName} not available`)
        } // .if else 

    } catch (err) {
        console.error('store access error: ', err.message)
        console.error(err)
        return err 
    } // .try

} // .get 


function remove() {

    try {
        
        if (fs.existsSync(fileName)) { 
            
            fs.unlinkSync(fileName)

            return { message: 'store removed' }
    
        } else {
            // store not available already
            return { message: 'store not found' }
        } // .if else 

    } catch (err) {

        console.error(err)
        return err 
    } // .try

} // .remove 


function setValues(jsonObj) {

    try {

        if (fs.existsSync(fileName)) { 

            const fileContent = fs.readFileSync(fileName, 'utf8')
            let fileData = JSON.parse(fileContent)

            for (const [key, value] of Object.entries(jsonObj)) {
                fileData[key] = value
            } // .for 
    
            fs.writeFileSync(fileName, JSON.stringify(fileData, null, 2), 'utf8')
    
        } else {
            let fileData = {}
            for (const [key, value] of Object.entries(jsonObj)) {
                fileData[key] = value
            } // .for
            fs.writeFileSync(fileName, JSON.stringify(fileData, null, 2), 'utf8')
            
        } // .if else 

        return { message: 'save value success' }

    } catch (err) {

        console.log(err)
        return err 
    } // .try

} // .setValues 

/*
function deleteEntry(key) {

    try {
        
        if (fs.existsSync(fileName)) { 

            const fileContent = fs.readFileSync(fileName, 'utf8')
            let fileData = JSON.parse(fileContent)
            delete fileData[key]
    
            fs.writeFileSync(fileName, JSON.stringify(fileData, null, 2), 'utf8')

            return { message: 'entry deleted ok' }
    
        } else {
            // entry not available already
            return { message: `entry for key ${key} not found` }
        } // .if else 

    } catch (err) {

        console.log(err)
        return err 
    } // .try

} // .deleteEntry 


function getValue(key) {

    try {
        
        if (fs.existsSync(fileName)) { 

            const fileContent = fs.readFileSync(fileName, 'utf8')
            let fileData = JSON.parse(fileContent)
            const value = fileData[key]

            if (fileData.hasOwnProperty(key)) {
                return fileData[key]
            } else {
                return new Error(`entry for key ${key} not found`)
            }
    
        } else {

            return new Error(`file ${fileName} not found`)
        } // .if else 

    } catch (err) {

        console.log(err)
        return err 
    } // .try

} // .getValue 
*/

module.exports = { get, remove, set, setValues }