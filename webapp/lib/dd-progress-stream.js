const Combine = require('stream-combiner');
const es = require('event-stream');

const keys = [
  'fullString', 'bytesCopied', 'bytesCopiedHumanized', 'secondsPassed', 'speed'
]
const pattern = /^(\d+) bytes \((\d+ \w+)\) copied, (.+) \w, (.+ \w+\/s)$/

const zip = (values)=>{
  return values.reduce((acc, val, i)=>{
    return Object.assign({}, acc, {[keys[i]]:val})
  }, {})
}

module.exports = () => Combine(
  es.split(),
  es.map(function (line, cb) {
    const matches = line.match(pattern)
    return matches ? cb(null, zip(matches)) : cb();
  })
)
