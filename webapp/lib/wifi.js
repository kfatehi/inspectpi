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
  let cli = wpa_cli(iface);
  return Promise.mapSeries([
    ['set_network', 0, 'ssid', `"${ssid}"`],
    ['set_network', 0, 'psk', `"${psk}"`],
    ['set_network', 0, 'bssid', address],
    ['save'],
    ['disconnect'],
    ['reconnect'],
  ], (args) => cli(...args));
}
