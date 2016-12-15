const Combine = require('stream-combiner');
const es = require('event-stream');
const pattern = /^(\d+) blocks/
module.exports = () => Combine(
  es.split('\r'),
  es.map(function (line, cb) {
    const matches = line.match(pattern)
    if (matches) {
      cb(null, parseInt(matches[1]))
    } else {
      cb();
    }
  })
)
