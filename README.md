# ffmpeg-downloader

Dynamically downloads the FFMPEG 3.3.2 static binaries.

Unlike other packages, this one detects the OS + architecture and
downloads only the required files.

## Supported Operating Systems

 - Windows
   - win32 ia32
   - win32 x64
 - Linux
   - linux ia32 (i386)
   - linux x64 (x86_64)
   - linux arm (armel)
 - macOS
   - darwin x64

## Usage

ffmpeg-downloader downloads ffmpeg during `npm install`

```javascript
const ffmpegPath = require('ffmpeg-downloader').path
```
