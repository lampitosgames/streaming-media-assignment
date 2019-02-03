const http = require('http');
const htmlHandler = require('./htmlResponses');
const mediaHandler = require('./mediaResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (req, res) => {
  switch (req.url) {
    case '/':
      htmlHandler.getIndex(req, res);
      break;
    case '/page2':
      htmlHandler.getPage2(req, res);
      break;
    case '/page3':
      htmlHandler.getPage3(req, res);
      break;
    case '/party.mp4':
    case '/party':
      mediaHandler.getVideo(req, res, 'party.mp4');
      break;
    case '/bird.mp4':
    case '/bird':
      mediaHandler.getVideo(req, res, 'bird.mp4');
      break;
    case '/bling.mp3':
    case '/bling':
      mediaHandler.getAudio(req, res, 'bling.mp3');
      break;
    default:
      htmlHandler.getIndex(req, res);
      break;
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1:${port}`);
