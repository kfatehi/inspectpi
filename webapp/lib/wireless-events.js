const spawn = require('child_process').spawn;
const Promise = require('bluebird');
const EventEmitter = require('events').EventEmitter;
const debounce = require('debounce');

const patt = /^(\d+:\d+:\d+.\d+)\s+(\w+)\s+(.+)/;

class WirelessEvents extends EventEmitter {
  start() {
    let dTrigger = debounce((iface) => this.emit(iface), 200);
    let cmd = 'iwevent';
    this.proc = spawn(cmd);
    this.proc.stdout.on('data', (data) => {
      try {
        let matches = data.toString().match(patt);
        dTrigger(matches[2]);
      } catch (e) {
        console.error(e);
      }
    });
    this.proc.on('exit', () => process.exit(1))
  }

}

module.exports = WirelessEvents;

if (!module.parent) {
  const wevents = new WirelessEvents();
  wevents.on('wlan1', function() {
    console.log('got events');
  });
  wevents.start();
}
