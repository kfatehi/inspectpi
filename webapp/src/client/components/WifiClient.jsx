import React from 'react';
import { WifiScanner } from './WifiScanner';

export const WifiClient = ({
  status: {
    ssid,
    unassociated,
    signal
  },
  performScan,
  closeScanner,
  scanStatus,
  associate,
  assocStatus
}) => <div>
  <h1>Wifi Client (wlan1)</h1>
  <div>{ unassociated ? 'Not connected' : `Connected to ${ssid} (${signal})` }</div>
  <WifiScanner
    close={closeScanner}
    scan={performScan}
    scanStatus={scanStatus}
    assocStatus={assocStatus}
    associate={associate}
  />
</div>;
