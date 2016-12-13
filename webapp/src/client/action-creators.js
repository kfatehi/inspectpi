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
