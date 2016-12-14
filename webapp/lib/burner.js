const childProcess = require('child_process');
const EventEmitter = require('events').EventEmitter;
const Promise = require('bluebird');
const ddProgress = require('./dd-progress-stream');

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
  start(dd, infileSize) {
    const PROGRESS_EVERY = 5000;
    let alive = false;
    let requestProgress = () => {
      if (!alive) return;
      this.proc.kill('SIGUSR1');
      console.log('sent sigusr1');
    }
    return new Promise((resolve, reject) => {
      this.proc = dd.spawn();
      alive = true;
      this.proc.on('exit', (code) => {
        alive = false;
        if (code !== 0) {
          return reject(new Error('dd exited non-zero'));
        } else {
          return resolve();
        }
      });
      this.proc.stderr.pipe(ddProgress()).on('data', ({
        fullString,
        bytesCopied
      })=>{
        console.log('>>', fullString, bytesCopied);
        this.emit('progress', parseFloat(bytesCopied) / infileSize);
        setTimeout(requestProgress, PROGRESS_EVERY);
      });
      setTimeout(requestProgress, PROGRESS_EVERY);
    });
  }
  interrupt() {
    this.proc.kill('SIGINT');
  }
}

module.exports = Burner;
