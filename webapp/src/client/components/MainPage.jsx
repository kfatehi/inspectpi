import React from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../action-creators';

import { Disks } from './Disks';
import { Images } from './Images';
import { WifiClient } from './WifiClient';
import { Burner, BurnerLoader, BurnHistory } from './Burner';
import { PiBootConfigurator } from './PiBootConfigurator';

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
  burnerSetInput,
  burnerSetOutput,
  burnerStart,
  burnerInterrupt,
  imageOperationDuplicate,
  imageOperationUnlink,
})=><div>
  <Disks disks={disks} burnerLoader={
    (disk)=><BurnerLoader
      status={burnStatus}
      setOutput={burnerSetOutput}
      makeImage={imageOperationDuplicate}
      target={disk}/>}
  />
  <Images
    images={images}
    unlink={imageOperationUnlink}
    burnerLoader={(img)=><BurnerLoader
      status={burnStatus}
      setInput={burnerSetInput}
      makeImage={imageOperationDuplicate}
      target={img}/>}
  />
  <PiBootConfigurator />
  <Burner status={burnStatus} start={burnerStart} interrupt={burnerInterrupt}/>
  <WifiClient
    status={wifiClient}
    closeScanner={wifiClientCloseScanner}
    performScan={wifiClientPerformScan}
    associate={wifiClientAssociate}
    scanStatus={wifiClientScanStatus}
    assocStatus={wifiClientAssocStatus}
  />
</div>);
