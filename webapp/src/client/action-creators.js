export const wifiClientPerformScan = () => ({
  meta: { remote: true },
  type: 'WIFI_CLIENT_SCAN'
})

export const wifiClientAssociate = (ssid, psk) => ({
  meta: { remote: true },
  type: 'WIFI_CLIENT_ASSOC', ssid, psk
})
