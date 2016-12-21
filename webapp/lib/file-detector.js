class FileDetector {
  static parseOutput(line) {
    const keys = ['name', 'type']
    const pattern = /^([^:]+): (.+)$/;
    const matches = line.match(pattern);
    const desc = FileDetector.parseDescription(matches[2]);
    return {
      name: matches[1],
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
    } else if (typeString.match(/^ASCII text$/)){
      return 'text';
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
      })
  }
}

module.exports = FileDetector;
