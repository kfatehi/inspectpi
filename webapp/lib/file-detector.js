// 2016-11-25-raspbian-jessie-lite.zip:
//   DOS/MBR boot sector;
//   partition 1 :
//     ID=0xc,
//     start-CHS (0x0,130,3),
//     end-CHS (0x8,138,2),
//     startsector 8192,
//     129024 sectors;
//   partition 2 :
//     ID=0x83,
//     start-CHS (0x8,138,3),
//     end-CHS (0xa9,10,33),
//     startsector 137216,
//     2578432 sectors
//   (Zip archive data, at least v2.0 to extract)

const zip = (keys, values)=>{
  return values.reduce((acc, val, i)=>{
    return Object.assign({}, acc, {[keys[i]]:val})
  }, {})
}

const quickParse = (keys, pattern, line, post) => {
  const matches = line.match(pattern);
  if ( matches ) {
    let [_, ...values] = matches;
    let obj = zip(keys, values)
    return post ? post(obj) : obj;
  }
}

class FileDetector {
  static parseOutput(line) {
    const keys = ['name', 'type']
    const pattern = /^([^:]+): (.+)$/;
    return quickParse(keys, pattern, line, parsed => {
      const desc = FileDetector.parseDescription(parsed.type);
      if (desc) {
        return {
          name: parsed.name,
          type: desc.type,
          contents: desc.contents
        };
      } else {
        return parsed;
      }
    });
  }
  static parseDescription(desc) {
    const keys = ['contents', 'type']
    const pattern = /^(.+) (\(.+\))$/;
    return quickParse(keys, pattern, desc, parsed => {
      parsed.type = FileDetector.parseType(parsed.type);
      parsed.contents = FileDetector.parseContents(parsed.contents);
      return parsed;
    });
  }
  static parseType(typeString) {
    if (typeString.match(/Zip archive/)) {
      return 'zip';
    } else if (typeString.match(/gzip compressed data/)) {
      return 'gzip';
    } else {
      return typeString;
    }
  }
  static parseContents(contentString) {
    return contentString
      .split(';')
      .map(part => {
        let tmp;
        let obj = {};
        part.trim().split(', ').forEach(sub => {
          //console.log('???', sub);
          if (sub.match(/boot/)) {
            obj.type = sub
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
