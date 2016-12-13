export const wifiClientPerformScan = () => ({
  meta: { remote: true },
  type: 'WIFI_CLIENT_SCAN'
})

export const wifiClientAssociate = (address, ssid, psk) => ({
  meta: { remote: true },
  type: 'WIFI_CLIENT_ASSOC',
  address, ssid, psk
})

export const wifiClientCloseScanner = () => ({
  meta: { remote: true },
  type: 'WIFI_CLIENT_SCAN_END'
})

export const burnImageToDisk = (imageName, diskName) => ({
  meta: { remote: true },
  type: 'BURN_IMAGE_TO_DISK',
  imageName, diskName
})
