//moved files from a set of subfolders (only one level down) to the root folder

const path = require('path')
const moveFile = require('move-file');
const fs = require('fs-extra') //for reading contents on a dir only (not recursive)

let wd = `H:\\Herbarium Specimen Images\\Wits Moss\\test`

//read the folders
fs.readdir(wd).then(async diritems => {
  
  let subfolders = diritems.filter(item => !path.extname(item)) //only stuff that doesn't have extentions

  let moveFilePromiseArray = []
  subfolders.forEach(async subfolder => {
    let subfolderitems = await fs.readdir(path.join(wd, subfolder))
    let subfolderfiles = subfolderitems.filter(item => path.extname(item)) //only things with extensions
    if(subfolderfiles.length > 0){
      subfolderfiles.forEach(fileName =>{
        let sourcePath = path.join(wd, subfolder, fileName)
        let destPath = path.join(wd, fileName)
        moveFilePromiseArray.push(moveFile(sourcePath, destPath))
      })
    }
  })
  try {
    await Promise.all(moveFilePromiseArray)
  }
  catch(err) {
    console.log("error moving files: ", err.message)
  }
}).catch(err => console.log('error reading directory'))