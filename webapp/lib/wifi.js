const Promise = require('bluebird');
const iwconfig = require('wireless-tools/iwconfig');
const iwlist = require('wireless-tools/iwlist');
const wpa_cli = require('./wpa_cli');


module.exports.getStatus = function(iface) {
  return new Promise(function(resolve, reject) {
    iwconfig.status(iface, function(err, status) {
      if ( err ) return reject(err);
      resolve(status);
    });
  });
}

module.exports.scan = function(iface) {
  return new Promise(function(resolve, reject) {
    iwlist.scan({ iface, show_hidden: false }, function(err, networks) {
      if ( err ) return reject(err);
      resolve(networks);
    });
  });
}

module.exports.associate = function(iface, address, ssid, psk) {
  let cli = wpa_cli('wlan1');
  return cli('set_network', 0, 'ssid', `"${ssid}"`).then(() => {
    return cli('set_network', 0, 'psk', `"${psk}"`)
  }).then(()=>{
    return cli('set_network', 0, 'bssid', address)
  }).then(()=>{
    return cli("save");
  }).then(()=>{
    return cli("disconnect");
  }).then(()=>{
    return cli("reconnect");
  });
}
