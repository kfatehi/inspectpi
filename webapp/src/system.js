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
const mounter = require('../lib/mounter');
const fs = require('fs');
const unlink = Promise.promisify(fs.unlink);
const rename = Promise.promisify(fs.rename);
const progressStream = require('progress-stream');
const fileType = require('file-type');
const FileDetector = require('../lib/file-detector');
const extract = require('../lib/extract');
const recipeRequire = require('../lib/recipe-require');
const { 
  sdCardDevicePath,
  imagesPath,
  stateFile,
  recipes
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
      'disks', 'images', 'wifiClient', 'mounterStatus', 'recipes'
    ])
  }
  handleRecipeAction({meta: { recipe }, type, data}) {
    console.log('sys: handle recipe action', recipe);
    const {actionHandler, setState} = this.recipes[recipe];
    const handler = actionHandler(this.getState())(setState);
    Promise.resolve(handler(type, data)).catch((err)=> {
      let list = this.state['recipes'];
      let idx = list.findIndex(r=>r.name === recipe);
      this.state['recipes'][idx] = {
        disabled: true,
        reason:err.message
      }
      this.emit('change');
    })
  }
  getRecipes() {
    this.recipes = {};
    return Promise.mapSeries(recipes, (recipe)=>{
      const recipeInit = recipeRequire('index')[recipe];
      const recipeInitialState = recipeRequire('initial-state')[recipe];
      const setRecipeState = val => {
        console.log('set recipe state', recipe);
        this.state['recipeStates'][recipe] = val
        this.emit('change');
      }
      return Promise.resolve(recipeInit(this.getState())).then(recipeObject => {
        console.log(recipeObject);
        if ( recipeObject.disabled ) {
          return {
            name: recipe,
            disabled: recipeObject.disabled,
            reason: recipeObject.reason
          }
        } else {
          setRecipeState(recipeInitialState);
          this.recipes[recipe] = {
            actionHandler: recipeObject,
            setState: setRecipeState,
          }
          return { name: recipe } 
        }
      })
    })
  }
  recipesReloadRecipe(name) {
    this.updateFacts(['recipes'])
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
          case 'mounterStatus': return this.getMounterStatus();
          case 'recipes': return this.getRecipes();
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
    return readdir(imagesPath).mapSeries((name) => {
      const fullpath = path.join(imagesPath, name);
      return stat(fullpath).then(({size}) => {
        return FileDetector.examine(fullpath).then(({type, contents})=>({
          name, size, type, path: fullpath, contents
        }))
      })
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
    const dd = Burner.dd();
    const finish = (historyEntry) => {
      update(Object.assign({}, {
        burning: false, infile, outfile
      },{
        history: [
          Object.assign({}, {
            timestamp: new Date(),
            infile, outfile
          }, historyEntry),
          ...history,
        ]
      }));
    }
    update({ history, burning: true, progress: 0, infile, outfile });
    dd.set('if', infile.path);
    dd.set('of', outfile.path);
    dd.set('bs', options.blockSize || '1M');
    dd.set('statusinterval', 1);
    watcher.unwatch(outfile.path);
    this.burner = new Burner();
    this.burner.on('progress', (progress) => {
      update({ history, burning: true, progress, infile, outfile })
    })
    return this.burner.start(dd, infile.size).then(() => {
      finish({ success: true })
    }).catch((err) => {
      finish({ success: false, reason: err.stack });
    }).finally(()=> {
      watcher.add(outfile.path);
    });
  }
  burnerClear() {
    const update = (val) => this.setFact('burnStatus', val);
    const getState = () => this.state['burnStatus'];
    const { history } = getState();
    update({ burning: false, history })
  }
  burnerInterrupt() {
    this.burner.interrupt()
  }
  imageOperationDuplicate(src) {
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
  imageOperationBurn(img) {
    this.burnerSetInput(img);
    this.burnerSetOutput({
      size: img.size,
      name: 'sda',
      path: '/dev/sda',
      type: 'image'
    });
    return this.burnerStart().finally(()=>{
      this.updateFacts(['disks'])
    })
  }
  imageOperationExtract({path, type}) {
    return extract(path, type).then(()=>{
      this.updateFacts(['images'])
    })
  }
  mounterOperationMountDisk() {
    return mounter.mountDisk().then(()=>{
      return this.updateFacts(['mounterStatus', 'recipes'])
    });
  }
  mounterOperationUnmountDisk() {
    return mounter.unmountDisk().then(()=>{
      return this.updateFacts(['mounterStatus', 'recipes'])
    });
  }
  getMounterStatus() {
    return mounter.getStatus();
  }
}

module.exports = System;
