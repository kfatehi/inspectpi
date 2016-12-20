const fs = require('fs');
const path = require('path');
const es = require('event-stream');
const Promise = require('bluebird');

const api = {
  createReadStream: filePath => {
    return fs.createReadStream(path.join(__dirname, filePath));
  },
  createLineStream: filePath => {
    return api
      .createReadStream(filePath)
      .pipe(es.split())
  },
  getLine: number => ({ of: filePath => new Promise((resolve, reject) => {
    let count = 0;
    let stream = api.createLineStream(filePath);
    stream.on('data', (line, i) => {
        if ( ++count === number ) {
          resolve(line);
          stream.destroy();
        }
      }).on('end', () => reject('end of stream, didnt find the line'))
  })})
}

module.exports = api;
