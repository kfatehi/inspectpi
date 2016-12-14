const spawn = require('child_process').spawn;
const Promise = require('bluebird');
const concatStream = require('concat-stream');

class System {
  constructor() {
  }
  updateFacts(list) {
    return Promise.mapSeries(list, (factName) => {
      switch (factName) {
        case 'disks': return this.getDisks()
      }
    });
  }
  getDisks() {
    return new Promise(function(resolve, reject) {
      const proc = spawn('lsblk');
      let stdout, stderr;
      proc.stdout.pipe(concatStream).on('end', (data) => {
        stdout = data.toString();
      });
      proc.stderr.pipe(concatStream).on('end', (data) => {
        stderr = data.toString();
      });
      proc.on('exit', (code) => {
        code === 0 ? resolve(stdout) : reject(stderr)
      })
    });
  }
}

module.exports = System;
