const fs = require('fs')
const path = require('path')
const request = require('request')
const mkdirp = require('mkdirp')
const { exec } = require('child_process')

/**
 * Downloads the FFMPEG binary.
 * @return {Promise<string>} - Output of ffmpeg -version
 */
function updateBinary (name = 'ffmpeg') {
  return new Promise((resolve, reject) => {
    const dir = `bin/${process.platform}/${process.arch}`
    const bin = `${dir}/${name}${process.platform === 'win32' ? '.exe' : ''}`
    const dest = path.join(__dirname, bin)
    mkdirp.sync(dir)

    // Get the latest version
    request.get(`https://github.com/FocaBot/ffmpeg-downloader/raw/master/${bin}`)
    .on('error', e => reject(e)) // Handle errors
    .on('end', () => setTimeout(() => {
      // Try to get the version number
      exec(dest + ' -version', (error, stdout, stderr) => {
        if (error || stderr.length) return reject(error || stderr)
        resolve(stdout)
      })
    }, 1000))
    .pipe(fs.createWriteStream(dest, { mode: 0o755 }))
  })
}

if (require.main === module) {
  // CLI
  console.log(`Downloading ffmpeg ${process.platform} ${process.arch}...`)
  updateBinary().then(version => {
    console.log(version)
  }).then(() => {
    console.log(`Downloading ffprobe ${process.platform} ${process.arch}...`)
    return updateBinary('ffprobe')
  }).then(version => {
    console.log(version)
    process.exit()
  }).catch(e => {
    console.error(e)
    process.exit(1)
  })
} else {
  // Module
  module.exports = updateBinary
}
