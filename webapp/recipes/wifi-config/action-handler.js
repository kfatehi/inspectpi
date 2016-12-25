const wifi = require('../../lib/wifi');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

module.exports = ({
  setState,
  mounted,
  rootMountPath,
}) => (type, data) => {
  console.log('handling recpe action', type);
  if ( type === "SCAN" ) {
    setState({
      scanning: true,
      baseStations: []
    });
    wifi.scan('wlan1').then((baseStations) => {
      setState({
        scanning: false,
        baseStations
      });
    })
  } else if (type === "END") {
    setState({
      scanning: false,
      baseStations: []
    });
  } else if (type === "ASSOC") {
    if (mounted) {
      const tmpl = path.join(__dirname, 'wpa_supplicant.conf.ejs');
      ejs.renderFile(tmpl, data, {}, function(err, str){
        if ( err ) throw err;
        let targetFile = path.join(rootMountPath, '/etc/wpa_supplicant/wpa_supplicant.conf');
        fs.writeFile(targetFile, str, function(err) {
          if ( err ) throw err;
          console.log('done');
          setState({
            scanning: false,
            baseStations: []
          });
        });
      });
    }
  }
}
