// read/write JSON from/to path
// if read fails, return defaultObject
const Promise = require('bluebird')
const fs = require('fs');
const debounce = require('debounce');

const readFile = Promise.promisify(fs.readFile);
const writeFile = debounce(function(filePath, data) {
  fs.writeFile(filePath, data, function(err) {
    if (err) 
      console.error(err.stack);
    else
      console.log('synced state to disk');
  })
}, 5000);

module.exports = {
  loadState: (filePath, defaultObject) => {
    return readFile(filePath).then((data) => {
      console.log('loaded state from disk');
      return JSON.parse(data.toString());
    }).catch(() => {
      return Object.assign({}, defaultObject);
    })
  },
  syncState: (filePath, obj) => {
    const data = JSON.stringify(obj, null, 2)
    writeFile(filePath, data)
  }
}

