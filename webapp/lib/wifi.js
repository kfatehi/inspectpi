const Promise = require('bluebird');
const iwconfig = require('wireless-tools/iwconfig');
const iwlist = require('wireless-tools/iwlist');


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
