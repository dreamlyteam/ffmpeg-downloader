const dir = `bin/${process.platform}/${process.arch}`
const bin = `${dir}/ffmpeg${process.platform === 'win32' ? '.exe' : ''}`

module.exports = {
  download: require('./downloader'),
  path: bin
}
