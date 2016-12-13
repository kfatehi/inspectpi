import React from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../action-creators';

import { Disks } from './Disks';
import { Images } from './Images';
import { WifiClient } from './WifiClient';

export const MainPage = connect(state=>state, actionCreators)(({
  disks,
  images,
  wifiClient,
  wifiClientScanStatus,
  wifiClientPerformScan,
  wifiClientCloseScanner,
  wifiClientAssociate,
  wifiClientAssocStatus,
  burnStatus,
  burnImageToDisk,
})=><div>
  <Disks disks={disks}/>
  <Images disks={disks} images={images} burnStatus={burnStatus} />
  <WifiClient
    status={wifiClient}
    closeScanner={wifiClientCloseScanner}
    performScan={wifiClientPerformScan}
    associate={wifiClientAssociate}
    scanStatus={wifiClientScanStatus}
    assocStatus={wifiClientAssocStatus}
  />
</div>);
