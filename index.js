const platform = process.platform == 'android' ? 'linux' : process.platform // Termux fix

const dir = `bin/${platform}/${process.arch}`
const bin = `${dir}/ffmpeg${platform === 'win32' ? '.exe' : ''}`
const probeBin = `${dir}/ffprobe${platform === 'win32' ? '.exe' : ''}`
const path = require('path')

module.exports = {
  download: require('./downloader'),
  path: platform === 'freebsd' ? '/usr/local/bin/ffmpeg' : path.join(__dirname, bin),
  probePath: platform === 'freebsd' ? '/usr/local/bin/ffprobe' : path.join(__dirname, probeBin)
}
