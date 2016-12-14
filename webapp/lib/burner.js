const childProcess = require('child_process');
const EventEmitter = require('events').EventEmitter;
const Promise = require('bluebird');
const es = require('event-stream');

class DD {
  setInfile(infile) {
    this.infile = infile;
  }
  setOutfile(outfile) {
    this.outfile = outfile;
  }
  setBlockSize(blockSize) {
    this.blockSize = blockSize;
  }
  spawn() {
    return childProcess.spawn('dd', [
      `if=${this.infile}`,
      `of=${this.outfile}`,
      `bs=${this.blockSize}`
    ]);
  }
}

class Burner extends EventEmitter {
  dd() {
    return new DD();
  }
  start(dd) {
    return new Promise((resolve, reject) => {
      this.proc = dd.spawn();
      this.proc.on('exit', (code) => {
        clearInterval(this.ivl);
        if (code !== 0) {
          return reject(new Error('dd exited non-zero'));
        } else {
          return resolve();
        }
      });
      this.proc.stdout.on('data', function(data) {
        console.log('stdout', data.toString())
        this.emit('progress', 0.5);
      });
      this.proc.stderr.on('data', function(data) {
        console.log('stderr', data.toString())
      });
      this.ivl = setInterval(() => {
        this.proc.kill('SIGUSR1');
      }, 1000)
    });
  }
  interrupt() {
    this.proc.kill('SIGINT');
  }
  parse() {
    const zipUp = ([
      fullString, bytesCopied, bytesCopiedHumanized, secondsPassed, speed
    ]) => ({
      fullString, bytesCopied, bytesCopiedHumanized, secondsPassed, speed
    })
      .pipe(es.split())
      .pipe(es.map(function (line, cb) {
        var patt = /^(\d+) bytes \((\d+ \w+)\) copied, (.+) \w, (.+ \w+\/s)$/
        var matches = line.match(patt)
        return matches ? cb(null, zipUp(matches)) : cb();
      }))
      .on('data', function (line) {
        console.log('>>', line);
      })
  }
}

module.exports = Burner;
