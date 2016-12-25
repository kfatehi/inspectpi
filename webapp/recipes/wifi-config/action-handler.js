const wifi = require('../../lib/wifi');
const ejs = require('ejs');
const fs = require('fs');
const filePaths = require('./file-paths');
const Promise = require('bluebird')
const stat = Promise.promisify(fs.stat);
const renderFile = Promise.promisify(ejs.renderFile);
const writeFile = Promise.promisify(fs.writeFile);

// the action handler can return a promise and
// should do so when dealing with code that may
// produce errors. this way, the recipe can be
// disabled and the error will be displayed as
// the reason.
//
// ideally, you handle the error by updating your
// recipe's state and providing facilities on your
// recipe UI to resolve the issue
module.exports = ({
  mounterStatus: { mounted, rootMountPath }
}) => setState => (type, data) => {
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
    const { template, targetFile } = filePaths(rootMountPath);
    return stat(targetFile).then(()=>{
      return renderFile(template, data, {})
    }).then(str=>{
      return writeFile(targetFile, str)
    }).then(()=>{
      setState({
        scanning: false,
        baseStations: []
      });
    });
  }
}
