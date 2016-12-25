const Promise = require('bluebird');
const simpleSpawn = require('./simple-spawn');

module.exports = (filePath, archiveType) => new Promise((resolve, reject) => {
  switch (archiveType) {
    case 'gzip': return resolve(gunzip(filePath));
    case 'zip': return resolve(unzip(filePath));
    default: return reject(new Error('unknown archive type '+archiveType));
  }
});

const gunzip = (filePath)=> simpleSpawn('gunzip', [
  filePath
]);

const unzip = (filePath)=> simpleSpawn('unzip', [
  '-o', filePath
]);
