const spawn = require('child_process').spawn;
const Promise = require('bluebird');
const concat = require('concat-stream');
const EventEmitter = require('events').EventEmitter;
const chokidar = require('chokidar');

class System extends EventEmitter {
  init() {
    this.state = {};

    let watchOpts = { ignoreInitial: true };
    this.sdWatcher = chokidar.watch('/dev/sda', watchOpts);
    this.sdWatcher
      .on('change', () => this.updateFacts(['disks']))

    //let imagesDir = __dirname+'/../storage';
    //this.imgWatcher = chokidar.watch(imagesDir, watchOpts);
    //this.imgWatcher
    //  .on('change', () => this.updateFacts(['disks']))

    return this.updateFacts(['disks']);
  }
  getState() {
    return this.state;
  }
  setFact(name, val) {
    return val => {
      console.log('set fact', name, val);
      this.state[name] = val;
      this.emit('stateChange', this.state);
    }
  }
  updateFacts(list) {
    return Promise.mapSeries(list, (factName) => {
      console.log('updating fact', factName);
      switch (factName) {
        case 'disks': return this.getDisks().then(this.setFact(factName))
      }
    });
  }
  getDisks() {
    let cmd = 'lsblk';
    let opts = ['-P', '-d', '-o', 'NAME,SIZE'];
    let parse = (str) => str.trim().split('\n').map(line => {
      let [_,name, size] = line.match(/NAME="(.+)" SIZE="(.+)"/)
      return {name, size}
    });
    return new Promise((resolve, reject) => {
      let o, e, proc = spawn('lsblk', opts);
      proc.stdout.pipe(concat(d=>o=d.toString()))
      proc.stderr.pipe(concat(d=>e=d.toString()))
      proc.on('exit', (code) => code === 0 ? resolve(o) : reject(e))
    }).then(parse)
  }
}

module.exports = System;
