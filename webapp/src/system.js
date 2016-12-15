const spawn = require('child_process').spawn;
const Promise = require('bluebird');
const EventEmitter = require('events').EventEmitter;
const chokidar = require('chokidar');
const readdir = Promise.promisify(require('fs').readdir);
const stat = Promise.promisify(require('fs').stat);
const path = require('path');
const lsblk = require('../lib/lsblk');
const INITIAL_STATE = require('./initial-state');
const watchOpts = {ignoreInitial: true};
const WirelessEvents = require('../lib/wireless-events');
const Burner = require('../lib/burner');
const wifi = require('../lib/wifi');
const fs = require('fs');
const unlink = Promise.promisify(fs.unlink);
const rename = Promise.promisify(fs.rename);
const progressStream = require('progress-stream');
const fileType = require('file-type');
const { 
  sdCardDevicePath,
  imagesPath,
  stateFile
} = require('../config.js');

class System extends EventEmitter {
  init() {
    this.watchDisks(()=>this.updateFacts(['disks']));
    this.watchImages(()=>this.updateFacts(['images']));
    this.watchWifiClient = new WirelessEvents();
    this.watchWifiClient.on('wlan1', () => {
      console.log('wlan1 change');
      this.updateFacts([ 'wifiClient' ])
    });
    this.watchWifiClient.start();
    this.state = Object.assign({}, INITIAL_STATE);
    return this.updateFacts([
      'disks', 'images', 'wifiClient'
    ]);
  }
  watchDisks(reaction) {
    this.sdWatcher = chokidar.watch(sdCardDevicePath, watchOpts);
    this.sdWatcher.on('change', reaction)
  }
  watchImages(reaction) {
    this.imgWatcher = chokidar.watch(imagesPath, watchOpts);
    const events = ['add', 'change', 'unlink']
    events.forEach(evt => this.imgWatcher.on(evt, reaction))
  }
  getState() {
    return this.state;
  }
  setFact(name, val) {
    console.log('set fact', name);
    this.state[name] = val;
    this.emit('change');
  }
  updateFacts(list) {
    return Promise.mapSeries(list, (factName) => {
      const getFactValue = () => {
        switch (factName) {
          case 'disks': return this.getDisks();
          case 'images': return this.getImages();
          case 'wifiClient': return this.getWifiClientStatus();
          default: throw new Error('dont know how to update fact '+factName);
        }
      }
      return getFactValue().then((value)=>this.setFact(factName, value));
    })
  }
  getDisks() {
    return lsblk(['name', 'size', 'type', 'mountpoint']).then((disks) => {
      // we are only interested in /dev/sda
      return disks.filter(({name, type})=>
        name.match(/^sda\d?/)
      )
    }).map(({name, size, type}) => ({
      name, size, type, path: '/dev/'+name
    }))
  }
  getImages() {
    return readdir(imagesPath).map((name) => {
      const fullpath = path.join(imagesPath, name);
      //return getFileType(fullpath).then(type
      return stat(fullpath).then(({size}) => ({
        name, size, type: 'image' , path: fullpath,
        //        compressed: 
      }))
    })
  }
  getWifiClientStatus() {
    return wifi.getStatus('wlan1');
  }
  wifiClientScan() {
    this.setFact('wifiClientAssocStatus', {});
    const update = (val) => this.setFact('wifiClientScanStatus', val);
    update({ scanning: true, baseStations: [] });
    return wifi.scan('wlan1').then((baseStations) => {
      return update({ scanning: false, baseStations })
    })
  }
  wifiClientAssoc({ address, ssid, psk}) {
    const update = (val) => this.setFact('wifiClientAssocStatus', {[address]: val});
    update({ associating: true })
    return wifi.associate('wlan1', address, ssid, psk).then(()=> {
      update({ associating: false, error: null });
      this.setFact('wifiClientScanStatus', { scanning: false, baseStations: [] });
    }).catch((err) =>
      update({ associating: false, error: err.message })
    )
  }
  wifiClientScanEnd() {
    const update = (val) => this.setFact('wifiClientScanStatus', val);
    update({ scanning: false, baseStations: [] });
  }
  burnerSetInput(infile) {
    const update = (val) => this.setFact('burnStatus', val);
    const getState = () => this.state['burnStatus']
    const { history, outfile } = getState();
    update({ history, burning: false, infile, outfile });
  }
  burnerSetOutput(outfile) {
    const update = (val) => this.setFact('burnStatus', val);
    const getState = () => this.state['burnStatus']
    const { history, infile } = getState();
    update({ history, burning: false, infile, outfile });
  }
  /**
   * options:
   * - watcher
   * - blockSize
   */
  burnerStart(options={}) {
    const watcher = options.outputWatcher || this.sdWatcher;
    const update = (val) => this.setFact('burnStatus', val);
    const getState = () => this.state['burnStatus'];
    const { history, infile, outfile } = getState();
    console.log('HISTORY', history);
    update({ history, burning: true, progress: 0, infile, outfile });
    const dd = Burner.dd();
    dd.set('if', infile.path);
    dd.set('of', outfile.path);
    dd.set('bs', options.blockSize || '1M');
    dd.set('statusinterval', 10);
    console.log('removing device from watchlist prior to burn');
    watcher.unwatch(outfile.path);
    this.burner = new Burner();
    this.burner.on('progress', (progress) => {
      console.log('burner progress');
      update({ history, burning: true, progress, infile, outfile })
    })
    return this.burner.start(dd, infile.size).then(() => {
      console.log('!!0', 'dd finished!');
      update(Object.assign({}, {
        burning: false, infile, outfile
      },{
        history: [
          {
            timestamp: new Date(),
            infile, outfile,
            success: true
          },
          ...history,
        ]
      }));
    }).catch((err) => {
      console.error('!!1', 'dd error', err);
      update(Object.assign({}, {
        burning: false, infile, outfile
      }, {
        history: [
          {
            timestamp: new Date(),
            infile, outfile,
            reason: err.stack,
            success: false
          },
          ...history,
        ]
      }));
    }).finally(()=> {
      console.log('burning is over, add device back to watchlist');
      watcher.add(outfile.path);
    });
  }
  burnerInterrupt() {
    this.burner.interrupt()
  }
  imageOperationDuplicate(src) {
    //const path = require('path');
    //const src = { name: 'sda1', path:'/dev/sda1'}
    const now = new Date().getTime();
    const ext = path.extname(src.path)
    const tailPattern = RegExp(`${ext}$`);
    const dupeTail = `-${now}.img`;
    const destName = src.name.replace(tailPattern, dupeTail);
    const destPath = path.join(imagesPath, destName);
    this.burnerSetInput(src);
    this.burnerSetOutput({
      size: src.size,
      name: destName,
      path: destPath,
      type: 'image'
    });
    return this.burnerStart({
      outputWatcher: this.imgWatcher,
      blockSize: '4M'
    }).finally(()=>{
      this.updateFacts(['images'])
    })
  }
  imageOperationUnlink(img) {
    return unlink(img.path);
  }
  imageOperationRename(img, newName) {
    const newPath = path.join(imagesPath, newName);
    return rename(img.path, newPath);
  }
  imageUpload(file, length, name) {
    const saveTo = path.join(imagesPath, path.basename(name));
    const output = fs.createWriteStream(saveTo);
    console.log('gonna upload this thing, unwatching path');
    this.imgWatcher.unwatch(saveTo);
    const progress = progressStream({ length, time: 100 });
    progress.on('progress', p => console.log(p.percentage));
    file.pipe(progress).pipe(output).on('finish', () => {
      console.log('file done, adding to watch');
      this.imgWatcher.add(saveTo);
      this.updateFacts(['images'])
    })
  }
}

module.exports = System;
