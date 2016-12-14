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
const { 
  sdCardDevicePath,
  imagesPath
} = require('../config.js');

class System extends EventEmitter {
  init() {
    this.state = INITIAL_STATE;
    this.watchDisks(()=>this.updateFacts(['disks']));
    this.watchImages(()=>this.updateFacts(['images']));
    this.watchWifiClient = new WirelessEvents();
    this.watchWifiClient.on('wlan1', () => {
      console.log('wlan1 change');
      this.updateFacts([ 'wifiClient' ])
    });
    this.watchWifiClient.start();
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
        name.match(/^sda\d?/) && type === "disk"
      )
    }).map(({name, size, type}) => ({
      name, size, type, path: '/dev/'+name
    }))
  }
  getImages() {
    return readdir(imagesPath).map((name) => {
      const fullpath = path.join(imagesPath, name);
      return stat(fullpath).then(({size}) => ({
        name, size, type: 'image', path: fullpath
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
    const outfile = getState().outfile;
    update({ burning: false, infile, outfile });
  }
  burnerSetOutput(outfile) {
    const update = (val) => this.setFact('burnStatus', val);
    const getState = () => this.state['burnStatus']
    const infile = getState().infile;
    update({ burning: false, infile, outfile });
  }
  burnerStart() {
    const update = (val) => this.setFact('burnStatus', val);
    const getState = () => this.state['burnStatus'];
    const { infile, outfile } = getState();
    update({ burning: true, progress: 0, infile, outfile });
    this.burner = new Burner();
    const dd = this.burner.dd();
    dd.setInfile(infile.path);
    dd.setOutfile(outfile.path);
    dd.setBlockSize('8M');
    this.burner.start(dd).then(() => {
      update(INITIAL_STATE.burnStatus);
    }).catch((err) => {
      update({ burning: false, infile, outfile, error: err.message })
      console.error('dd error', err);
    })
    this.burner.on('progress', (progress) => {
      console.log('burner progress');
      update({ burning: true, progress, infile, outfile })
    })
  }
  burnerInterrupt() {
    this.burner.interrupt()
  }
}

module.exports = System;
