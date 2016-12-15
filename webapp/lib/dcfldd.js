const childProcess = require('child_process');
const bin = 'dcfldd';

class Dcfldd {
  constructor(){
    this.map = {};
  }
  set(key, value) {
    this.map[key] = value;
  }
  getArgs(){
    return Object.keys(this.map).map(key=>{
      return `${key}=${this.map[key]}`
    })
  }
  spawn() {
    const args = this.getArgs();
    console.log(`spawn: ${bin} ${args.join(' ')}`);
    return childProcess.spawn(bin, args);
  }
}

module.exports = Dcfldd;
