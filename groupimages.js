const path = require('path')
const moveFile = require('move-file');
const fs = require('fs-extra') //for reading contents on a dir only (not recursive)

let wd = `D:\\NSCF backup 2020\\Restionaceace Euphorbiaceae and Orchidaceae\\20200122`

//read the folders
fs.readdir(wd).then(subfolders => {
  
  subfolders = subfolders.filter(item => !path.extname(item)) //only stuff that doesn't have extentions

  subfolders.forEach(async subfolder => {
    let filefolders = await fs.readdir(path.join(wd, subfolder))
    filefolders = filefolders.filter(item => !path.extname(item)) //only stuff that doesn't have extentions
    filefolders.forEach(async fileFolder => {
      let fullPath = path.join(wd, subfolder, fileFolder)
      let files = await fs.readdir(fullPath)
      files = files.filter(item => path.extname(item)) //only things with extensions
  
      if (files.length > 0) {
        var moveFilePromiseArray = []
        files.forEach(file => {
          let sourcePath = path.join(wd, subfolder, fileFolder, file)
          let destPath = path.join(wd, fileFolder, file)
          moveFilePromiseArray.push(moveFile(sourcePath, destPath))
        })
        
        try {
          await Promise.all(moveFilePromiseArray)
        }
        catch(err) {
          console.log('error moving files: ', err.message)
        }
      }
      else {
        console.log('no files in ', subfolder, '/', fileFolder)
      }
      
      
    })
  })

  return

}).then(_ => console.log('all done'))
.catch(err => console.log('error: ' + err.message))
