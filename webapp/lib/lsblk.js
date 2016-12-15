const simpleSpawn = require('./simple-spawn');
const Promise = require('bluebird');

module.exports = function(fields) {
  let cmd = 'lsblk';
  let opts = ['-P', '-b', '-o', fields.join(',').toUpperCase()];
  let parse = (str) => str.trim().split('\n').map(line => {
    let patt = fields.reduce((acc, field) => {
      return [...acc,`${field.toUpperCase()}="(.+)?"`]
    }, []).join(' ');
    let matches = line.match(patt)
    let obj = fields.reduce((acc, field, i)=>{
      return Object.assign({}, acc, {[field]: matches[i+1]})
    },{})
    return obj
  });
  return simpleSpawn(cmd, opts).then(parse);
}
