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

export const burnerSetInput = value => ({
  meta: { remote: true },
  type: `BURNER_SET_INPUT`, value
})

export const burnerSetOutput = value => ({
  meta: { remote: true },
  type: `BURNER_SET_OUTPUT`, value
})

export const burnerStart = () => ({
  meta: { remote: true },
  type: `BURNER_START`
})

export const burnerInterrupt = () => ({
  meta: { remote: true },
  type: `BURNER_INTERRUPT`
})

export const imageOperationDuplicate = (src) => ({
  meta: { remote: true },
  type: 'IMAGE_OPERATION_DUPLICATE', src
})

export const imageOperationUnlink = (img) => ({
  meta: { remote: true },
  type: 'IMAGE_OPERATION_UNLINK', img
})

export const imageOperationRename = (img, name) => ({
  meta: { remote: true },
  type: 'IMAGE_OPERATION_RENAME', img, name
})
