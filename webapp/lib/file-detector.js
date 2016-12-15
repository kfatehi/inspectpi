const Promise = require('bluebird');
const simpleSpawn = require('./simple-spawn');
const path = require('path');

class FileDetector {
  static examine(filePath) {
    const bin = 'file';
    const args = ['-z', '-s', filePath]
    return simpleSpawn(bin, args).then(FileDetector.parseOutput);
  }
  static parseOutput(line) {
    if ( !line ) return { name: 'unknown', type: 'unknown', contents: [] }
    const keys = ['name', 'type']
    const pattern = /^([^:]+): (.+)$/;
    const matches = line.trim().match(pattern);
    const desc = FileDetector.parseDescription(matches[2]);
    return {
      name: path.basename(matches[1]),
      type: desc.type,
      contents: desc.contents
    };
  }
  static parseDescription(desc) {
    return {
      contents: FileDetector.parseContents(desc),
      type: FileDetector.parseType(desc)
    }
  }
  static parseType(typeString) {
    if (typeString.match(/Zip archive/)) {
      return 'zip';
    } else if (typeString.match(/gzip compressed data/)) {
      return 'gzip';
    } else if (typeString.match(/, FAT \(16 bit\)$/)){
      return 'fat16';
    } else if (typeString.match(/^Linux rev 1.0 ext4 filesystem data, /)){
      return 'ext4';
    } else if (typeString.match(/^ASCII text$/)){
      return 'text';
    } else if (typeString.match(/partition \d/g) && typeString.match(/boot sector/)){
      return 'bootable disk image';
    } else {
      return 'unknown';
    }
  }
  static parseContents(contentString) {
    return contentString
      .split(';')
      .map(part => {
        let tmp;
        let obj = {};
        part.trim().split(', ').forEach(sub => {
          // console.log('???', sub);
          if (sub.match(/DOS\/MBR boot sector/)) {
            obj.boot = "mbr"
          } else if (sub.match(/partition/)) {
            obj.type = 'partition'
          } else if (tmp = sub.match(/startsector (\d+)/)) {
            obj.startsector = parseInt(tmp[1])
          } else if (tmp = sub.match(/(\d+) sectors/)) {
            obj.sectors = parseInt(tmp[1])
          }
        })
        return obj;
      }).filter(o=>Object.keys(o).length>0)
  }
}

module.exports = FileDetector;
