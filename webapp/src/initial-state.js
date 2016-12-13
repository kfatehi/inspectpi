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
  disks: [],
  images: [],
  wifiClient: {
    ssid: null,
    unassociated: true,
    signal: 0
  },
  wifiClientScanStatus: {
    scanning: false,
    baseStations: []
  },
  wifiClientAssocStatus: {
    //[bssid]: { associating: true, error: null }
  },
  burnStatus: {
    burning: true,
    pairKey: '2016-11-25-raspbian-jessie-lite.img->sda',
    progress: 0.5
  }
};
