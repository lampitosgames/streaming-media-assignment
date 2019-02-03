const fs = require('fs');
const path = require('path');

const getBufferFile = (req, res, filename, contentType) => {
  const file = path.resolve(__dirname, `../client/${filename}`);
  fs.stat(file, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
      }
      return res.end(err);
    }
    let { range } = req.headers;
    if (!range) {
      range = 'bytes=0-';
    }
    const positions = range.replace('/bytes=/', '').split('-');
    let start = parseInt(positions[0], 10) || 0;
    const total = stats.size;
    const end = positions[1] ? parseInt(positions[1], 10) : total - 1;
    if (start > end) {
      start = end - 1;
    }
    const chunksize = (end - start) + 1;
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${total}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': contentType,
    });
    const stream = fs.createReadStream(file, { start, end });
    stream.on('open', () => {
      stream.pipe(res);
    });
    stream.on('error', (streamError) => {
      res.end(streamError);
    });
    return stream;
  });
};
const getVideo = (req, res, filename) => {
  getBufferFile(req, res, filename, 'video/mp4');
};
const getAudio = (req, res, filename) => {
  getBufferFile(req, res, filename, 'audio/mpeg');
};
module.exports.getVideo = getVideo;
module.exports.getAudio = getAudio;
