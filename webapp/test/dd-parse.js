const fs = require('fs');
const es = require('event-stream');
const ddProgressStream = require('../lib/dd-progress-stream');

fs.createReadStream(__dirname+'/dd-output.txt')
  .pipe(ddProgressStream())
  .on('data', function (line) {
    console.log('>>', line);
  })
