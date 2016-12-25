const path = require('path');

module.exports = rootMountPath => ({
  template: path.join(__dirname, 'wpa_supplicant.conf.ejs'),
  targetFile: path.join(rootMountPath, '/etc/wpa_supplicant/wpa_supplicant.conf')
})
