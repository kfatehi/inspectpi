const Promise = require('bluebird');
const concat = require('concat-stream');
const spawn = require('child_process').spawn;

module.exports = (cmd, args, opts={}) => new Promise((resolve, reject) => {
  let o, e, proc = spawn(cmd, args);
  proc.stdout.pipe(concat(d=>o=d.toString()))
  proc.stderr.pipe(concat(d=>e=d.toString()))
  proc.on('exit', (code) =>
    opts.ignoreFailure ?
    resolve(o) :
    (code === 0 ? resolve(o) : reject(e))
  )
})
