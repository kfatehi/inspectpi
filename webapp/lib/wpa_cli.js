const spawn = require('child_process').spawn;
const concat = require('concat-stream');

const cli = (iface, cmd, args) => new Promise((resolve, reject) => {
  let finalArgs = ['-i', iface, cmd, ...args];
  let o,e,proc = spawn('wpa_cli', finalArgs);
  proc.stdout.pipe(concat(d=>o=d.toString().trim()));
  proc.stderr.pipe(concat(d=>e=d.toString().trim()));
  proc.on('exit', ()=> {
    if (e.match(/FAIL/)) reject(new Error(e));
    else resolve(o);
  })
});

module.exports = (iface) => {
  return (cmd, ...args) => cli(iface, cmd, args)
}
