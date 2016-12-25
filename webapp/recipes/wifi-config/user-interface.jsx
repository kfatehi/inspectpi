import React from 'react';
import { recipe } from '../../lib/connect-recipe';
import { WifiScanner } from './components/WifiScanner';

module.exports = recipe('wifi-config', ({local, remote})=>({
  close: ()=>remote("END"),
  scan: ()=>remote("SCAN"),
  assoc: (addy, ssid, psk)=>remote("ASSOC", { addy, ssid, psk })
}), ({
  close,
  scan,
  assoc,
  scanning,
  baseStations,
})=><div>
  <WifiScanner
    close={close}
    scan={scan}
    associate={assoc}
    scanning={scanning}
    baseStations={baseStations}
  />
</div>);
