const fs = require('fs')
const path = require('path')


const targetDir = 'H:\\Herbarium Specimen Images\\Wits Moss\\allunaccessioned'
const targetFileExt = '.jpg' //muse be lower case and include the period

let fileNames = fs.readdirSync(targetDir)
let targetFiles = fileNames.filter(file => path.extname(file).toLowerCase() == targetFileExt.toLowerCase())
let regex = new RegExp(`${targetFileExt}$`, 'gi')
let fileNamesExExt = targetFiles.map(fileName => fileName.replace(regex, ""))

/*
//check if we have filenames with a specific string, eg a space
const checkString = " "
let noSpaces = fileNamesExExt.filter(fileName => fileName.includes(checkString));
console.log(`${noSpaces.length} file names with a space`)
*/

//count images that are already accessioned
const accessionedBarcodes = require('./listToCheck').map(barcode => barcode.toUpperCase())
let filesAccessioned = fileNamesExExt.filter(fileName => accessionedBarcodes.includes(fileName.toUpperCase()))
console.log(`${filesAccessioned.length} file names already accessioned`)

//delete images already accessioned 
//NB THIS NEEDS TO BE REPEATED IN THE RDE FILES ALSO OTHERWISE THE NUMBERS WON'T MATCH UP FOR THE IMAGE CHECK THERE
let filesDeleted = 0
for (barcode of filesAccessioned) {
  let filePath = path.join(targetDir, `${barcode+targetFileExt}`)
  fs.unlinkSync(filePath)
  filesDeleted++
}
console.log(`${filesDeleted} files deleted`)

