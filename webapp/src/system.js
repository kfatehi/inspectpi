const spawn = require('child_process').spawn;
const Promise = require('bluebird');
const concat = require('concat-stream');
const EventEmitter = require('events').EventEmitter;
const chokidar = require('chokidar');
const readdir = Promise.promisify(require('fs').readdir);
const stat = Promise.promisify(require('fs').stat);
const path = require('path');
const { 
  sdCardDevicePath,
  imagesPath
} = require('../config.js');

class System extends EventEmitter {
  init() {
    this.state = require('./initial-state');

    let watchOpts = {ignoreInitial: true};
    this.sdWatcher = chokidar.watch(sdCardDevicePath, watchOpts);
    this.sdWatcher.on('change', () => this.updateFacts(['disks']))

    this.imgWatcher = chokidar.watch(imagesPath, watchOpts);
    this.imgWatcher
      .on('add', () => this.updateFacts(['images']))
      .on('change', () => this.updateFacts(['images']))
      .on('unlink', () => this.updateFacts(['images']))

    return this.updateFacts(['disks', 'images']);
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
        case 'images': return this.getImages().then(this.setFact(factName))
        default: console.error('dont know how to update fact', factName)
      }
    });
  }
  getDisks() {
    let cmd = 'lsblk';
    let opts = ['-P', '-b', '-d', '-o', 'NAME,SIZE'];
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
  getImages() {
    return readdir(imagesPath).map((name) =>
      stat(path.join(imagesPath, name)).then(({size}) => ({
        name, size
      }))
    )
  }
}

module.exports = System;
