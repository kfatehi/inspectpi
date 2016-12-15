const EventEmitter = require('events').EventEmitter;
const Promise = require('bluebird');
const Dcfldd = require('./dcfldd');

class Burner extends EventEmitter {
  static dd() {
    return new Dcfldd();
  }
  start(dd, infileSize) {
    const getPercent = dd.progressPercentParser(infileSize);
    return new Promise((resolve, reject) => {
      this.proc = dd.spawn();
      this.proc.stderr
        .pipe(dd.progressStreamParser())
        .on('data', blocksWritten => {
          this.emit('progress', getPercent(blocksWritten));
        })
      this.proc.on('exit', (code) => {
        if (code !== 0) {
          return reject(new Error('dd exited non-zero'));
        } else {
          return resolve();
        }
      });
    });
  }
  interrupt() {
    this.proc.kill('SIGINT');
  }
}

module.exports = Burner;
