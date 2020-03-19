const path = require('path')
const moveFile = require('move-file');
const fs = require('fs-extra') //for reading contents on a dir only (not recursive)

let JPEGDir = 'D:\\NSCF backup 2020\\Restionaceace Euphorbiaceae and Orchidaceae\\test\\JPEG'
let RAWDir = 'D:\\NSCF backup 2020\\Restionaceace Euphorbiaceae and Orchidaceae\\test\\RAW'
let moveDir = 'D:\\NSCF backup 2020\\Restionaceace Euphorbiaceae and Orchidaceae\\test\\unprocessed'


getMissingFiles(JPEGDir, RAWDir)
.then(imagesToMove => {
  let movePromises = []

  imagesToMove.forEach(fileName => {
    movePromises.push(moveFile(path.join(RAWDir, fileName), path.join(moveDir, fileName)))
  })
  
  Promise.all(movePromises)
  .then(_ => console.log('all done'))
  .catch(err => console.log('error moving files: ', err.message))

})
.catch(err => console.log('error getting files to move: ', err.message))


async function getFileNames(dir, ext) {
  let files = await fs.readdir(dir)
  files = files.filter(name => path.extname(name).toLowerCase() == ext.toLowerCase())
  return files
}

async function getMissingFiles(JPEGDir, RAWDir) {
  
  let jpegs = await getFileNames(JPEGDir, '.jpg')
  let raws = await getFileNames(RAWDir, '.cr2')
  
  jpegs = jpegs.map(jpeg => path.basename(jpeg.toLowerCase(), '.jpg'))
  raws = raws.map(raw => path.basename(raw.toLowerCase(), '.cr2'))
  let unprocessed = raws.filter(raw => !jpegs.includes(raw))
  unprocessed = unprocessed.map(filename => filename + '.cr2')
  return unprocessed
}