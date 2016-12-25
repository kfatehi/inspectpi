const recipeClientRequire = require('../lib/recipe-client-require');
const recipeStates = recipeClientRequire('initial-state');

/**
 * Initial application state.
 *
 * This file represents the complete
 * application state. This object is
 * mirrored on both the server and client.
 *
 * Comments that appear in the object below
 * signify the yet-to-be values that are
 * dynamically created/altered/destroyed
 * during runtime. They are here for
 * documentation purposes so that this
 * file can truly represent the
 * full application schema.
 */
module.exports = {
  disks: [
    // { name, size:bytes, type:disk, path } 
  ],
  images: [
    // { name, size:bytes, type:image, path } 
  ],
  wifiClient: {
    ssid: null,
    unassociated: true,
    signal: 0
  },
  wifiClientScanStatus: {
    scanning: false,
    baseStations: [
      // {
      //   address: '00:0b:81:ab:14:22',
      //   ssid: 'BlueberryPi',
      //   mode: 'master',
      //   frequency: 2.437,
      //   channel: 6,
      //   security: 'wpa',
      //   quality: 48,
      //   signal: 87
      // }
    ]
  },
  wifiClientAssocStatus: {
    //[bssid]: { associating: true, error: null|"" }
  },
  burnStatus: {
    history: [
      //timestamp: Date,
      //infile: { ...(disk|image) },
      //outfile: { ...(disk|image) },
      //success: bool
      //reason: ""
    ],
    burning: false,
    //infile: { ...(disk|image) },
    //outfile: { ...(disk|image) },
    //progress: 0.5
  },
  mounterStatus: {
    mounted: false,
    // rootMountPath: string (/mnt/sdcard)
  },
  recipes: [
    // { name:string, disabled:bool, reason:string }
  ],
  recipeStates,
};
