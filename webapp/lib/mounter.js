const Promise = require('bluebird');
const mkdirp = Promise.promisify(require('mkdirp'));
const simpleSpawn = require('./simple-spawn');

const unmountDisk = () => {
  return simpleSpawn('umount', ['--recursive', '/mnt/sdcard'], {ignoreFailure: true})
}

const mountDisk = () => {
  const pairs = [
    [ '/dev/sda2', '/mnt/sdcard' ],
    [ '/dev/sda1', '/mnt/sdcard/boot' ]
  ];
  return unmountDisk()
    .then(() => mkdirp('/mnt/sdcard/boot'))
    .then(() => Promise.mapSeries(pairs, ([dev, mnt]) => {
      return simpleSpawn('mount', [dev, mnt]);
    }));
}

const getStatus = () => simpleSpawn('mountpoint', ['/mnt/sdcard']).then(()=>({
  mounted: true,
}), ()=>({
  mounted: false,
}))

module.exports = {
  mountDisk,
  unmountDisk,
  getStatus,
}
