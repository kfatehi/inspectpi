import React from 'react';

export const WifiScanner = ({
  scan,
  scanStatus: {
    scanning,
    baseStations
  }
}) => <div>
  <button
    disabled={scanning}
    onClick={()=>scan()}>
    {scanning ? 'Scanning...' : 'Scan'}
  </button>
  <h2>Base Stations</h2>
  <ul>
    {baseStations.map(({address,ssid})=><li key={address}>
      {ssid}
    </li>)}
  </ul>
</div>;

export const WifiClient = ({
  status: {
    ssid,
    unassociated,
    signal
  },
  scan,
  associate,
  scanStatus
}) => <div>
  <h1>Wifi Client (wlan1)</h1>
  <div>{ unassociated ? 'unassociated' : ssid }</div>
  { unassociated ?
      <WifiScanner scan={scan} scanStatus={scanStatus} /> : null }
</div>;
