/* provide a root directory to search, a target directory name to take files from, a target file type, and a destination directory, 
and this will copy all the files of that type found in directories with that name to the destination directory.
*/


const cpf = require('cp-file')
const dir = require('node-dir') //for recursive directory contents
const fs = require('fs')
const ProgressBar = require('progress');

const root = 'H:\\Herbarium Specimen Images\\Wits Moss'
const targetDirName = 'JPEG' //must be lower case
const targetFileExt = '.jpg' //muse be lower case and include the period
const destinationDir = 'H:\\Herbarium Specimen Images\\Wits Moss\\allunaccessioned'
const overwriteDest = false; //whether or not to overwrite files with the same name in destinationDir


console.log('reading subdirectories')
dir.subdirs(root, async function(err, subdirs) {
  if (err) {
    console.log("error reading root directory: " + err.message)
    return;
  }

  console.log('completed reading subdirectories, finding file names')

  let targetDirs = subdirs.filter(subdir => path.basename(subdir).toLowerCase() == targetDirName.toLowerCase())

  let allTargetFiles = []
  targetDirs.forEach(targetDir => {
    let files = fs.readdirSync(targetDir)
    let targetFiles = files.filter(file => path.extname(file).toLowerCase() == targetFileExt)
    targetFiles = targetFiles.map(fileName => path.join(targetDir, fileName))
    allTargetFiles = [...allTargetFiles, ...targetFiles]
  })

  console.log('completed finding files to copy')

  let failed  = []
  let failedErrors = {}

  await copyAllFiles(allTargetFiles, failed, failedErrors)
  
  if(failed.length > 0) {
    console.log('The following files were no copied: ' + failed.join('; '))
    console.log("ERRORS")
    for (message in failedErrors){
      console.log(`${message}: ${failedErrors[message]}`)
    }
  }

  console.log('all done')
  
});

function copyFile(source, destination, options, failed, failedErrors){
  return new Promise(resolve => {
    cpf(source, destination, options).then(_ => {
      resolve()
    })
    .catch(err => {
      let fileName = path.basename(source)
      failed.push(fileName)

      if(failedErrors.hasOwnProperty(err.message)){
        failedErrors[err.message]++
      }
      else {
        failedErrors[err.message] = 1
      }

      resolve();

    })
  })
}

async function copyAllFiles(allTargetFiles, failed, failedErrors) {
  return new Promise(async resolve => {

    for (const targetFile of allTargetFiles){
      let source = targetFile
      let fileName = path.basename(targetFile)
      let dest = path.join(destinationDir, fileName)
      await copyFile(source, dest, { overwrite: overwriteDest }, failed, failedErrors)
    }

    resolve();

  })
}