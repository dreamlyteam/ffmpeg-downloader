const dir = `bin/${process.platform}/${process.arch}`
const bin = `${dir}/ffmpeg${process.platform === 'win32' ? '.exe' : ''}`
const probeBin = `${dir}/ffprobe${process.platform === 'win32' ? '.exe' : ''}`
const path = require('path')

module.exports = {
  download: require('./downloader'),
  path: path.join(__dirname, bin),
  probePath: path.join(__dirname, probeBin)
}

