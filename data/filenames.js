const fs = require('fs')
const path = require('path')

// Specify the directory you want to read
const directoryPath = './paths/json/'

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err)
    return
  }

  // Filter out directories
  const filesOnly = files.filter((file) => {
    const filePath = path.join(directoryPath, file)
    return fs.statSync(filePath).isFile()
  })

  // Print the names of files
  console.log('Files in the directory:')
  filesOnly.forEach((file) => {
    console.log(file)
  })
})
