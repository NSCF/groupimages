//module that does the file copying
//used in groupimages and grouptargetdirimages
const path = require('path')
const cpf = require('cp-file')

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

async function copyAllFiles(allTargetFiles, destDir, overwrite, failed, failedErrors) {
  return new Promise(async resolve => {

    for (const targetFile of allTargetFiles){
      let source = targetFile //just renaming for clarity
      let fileName = path.basename(source)
      let dest = path.join(destDir, fileName)
      await copyFile(source, dest, { overwrite: overwrite }, failed, failedErrors)
    }

    resolve();

  })
}

module.exports = copyAllFiles