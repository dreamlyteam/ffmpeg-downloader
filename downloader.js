const fs = require('fs')
const path = require('path')
const request = require('request')
const ProgressBar = require('progress')
const decompress = require('decompress')
const platform = process.platform == 'android' ? 'linux' : process.platform // Termux fix
const { exec } = require('child_process')

/**
 * Downloads the FFMPEG binary.
 * @return {Promise<string>} - Output of ffmpeg -version
 */
function updateBinary (name = 'ffmpeg') {
  return new Promise((resolve, reject) => {
    const dir = `bin/${platform}/${process.arch}`
    const bin = `${dir}/${name}${platform === 'win32' ? '.exe' : ''}`
    const dest = path.join(__dirname, bin)
    const fname = `${platform}-${process.arch}.tar.bz2`
    const tmp = path.join(__dirname, 'bin', fname)
    try { fs.mkdirSync(path.join(__dirname, 'bin')) } catch(e) {}
    let bar

    // Get the latest version
    const req = request.get(`https://github.com/FocaBot/ffmpeg-downloader/raw/master/bin/${platform}-${process.arch}.tar.bz2`)
    req.on('error', e => reject(e)) // Handle errors
    .on('data', c => {
      bar = bar || new ProgressBar(`${fname} [:bar] :percent (ETA: :etas)`, {
        complete: '=',
        incomplete: ' ',
        width: 25,
        total: parseInt(req.response.headers['content-length'])
      })

      bar.tick(c.length)
    })
    .on('end', () => setTimeout(() => {
      bar.tick(bar.total - bar.curr)
      console.log('Decompressing...')
      decompress(tmp, path.join(__dirname, 'bin')).then(f => {
        fs.unlinkSync(tmp)
        // Try to get the version number
        execFile(dest, ['-version'], (error, stdout, stderr) => {
          if (error || stderr.length) return reject(error || stderr)
          resolve(stdout)
        })
      })
    }, 1000))
    .pipe(fs.createWriteStream(tmp, { mode: 0o755 }))
  })
}

if (require.main === module) {
  // CLI
  console.log(`Downloading ffmpeg ${process.platform} ${process.arch}...`)
  updateBinary().then(version => {
    console.log(version)
  }).catch(e => {
    console.error(e)
    process.exit(1)
  })
} else {
  // Module
  module.exports = updateBinary
}
