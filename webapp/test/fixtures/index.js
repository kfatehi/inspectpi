const fs = require('fs');
const path = require('path');

module.exports = {
  createReadStream: filePath => {
    return fs.createReadStream(path.join(__dirname, filePath));
  }
}
