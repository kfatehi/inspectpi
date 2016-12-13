const concat = require('concat-stream');
const spawn = require('child_process').spawn;
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
  return new Promise((resolve, reject) => {
    let o, e, proc = spawn(cmd, opts);
    proc.stdout.pipe(concat(d=>o=d.toString()))
    proc.stderr.pipe(concat(d=>e=d.toString()))
    proc.on('exit', (code) => code === 0 ? resolve(o) : reject(e))
  }).then(parse)
}
