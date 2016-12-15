const childProcess = require('child_process');
const Combine = require('stream-combiner');
const es = require('event-stream');
const bin = 'dcfldd';

class Dcfldd {
  constructor(){
    this.map = {};
  }
  set(key, value) {
    this.map[key] = value;
  }
  getArgs(){
    return Object.keys(this.map).map(key=>{
      return `${key}=${this.map[key]}`
    })
  }
  spawn() {
    const args = this.getArgs();
    console.log(`spawn: ${bin} ${args.join(' ')}`);
    return childProcess.spawn(bin, args);
  }
  /**
   * Returns a through stream designed to parse the
   * stream of status reports given when the option
   * `statusinterval` is set to a number of blocks
   * 
   * The stream's `data` event reports an integer
   * each time: the number of blocks written
   */
  progressStreamParser() {
    const pattern = /^(\d+) blocks/;
    return Combine(
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
  }
  /**
   * A crappy-but-good-enough version of
   * https://github.com/adulau/dcfldd/blob/master/dcfldd.c#L431-L453
   *
   * Returns an integer representative of the number of bytes
   * which the blocksize has been set to, assuming it has been set.
   */
  getBlockSize() {
    let m = this.map['bs'].match(/^(\d+)(\w+?)/);
    let n = parseInt(m[1]);
    let sym = m[2];
    if (sym) {
      switch (m[2]) {
        case 'K':
          return n * 1024;
        case 'M':
          return n * 1024 * 1024;
        case 'G':
          return n * 1024 * 1024 * 1024;
        default: 
          throw new Error(`unimplemented blocksize multiplier '${sym}' in dcfldd wrapper`);
      }
    } else {
      return n
    }
  }
  /**
   * Returns a lambda capable of calculating
   * the percentage of data written.
   *
   * Use something like fs.stat for totalSize
   * and progressStreamParser for blocksWritten
   *
   * Returns a float from 0 to 1
   */
  progressPercentParser(totalSize) {
    let blockSize = this.getBlockSize();
    return (blocksWritten) => {
      let currentSize = blocksWritten * this.getBlockSize();
      return currentSize / totalSize;
    }
  }
}

module.exports = Dcfldd;
