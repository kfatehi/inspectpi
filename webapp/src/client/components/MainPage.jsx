import React from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../action-creators';

import { Disks } from './Disks';
import { Images } from './Images';
import { WifiClient } from './WifiClient';
import { Burner } from './Burner';
import { Operations } from './Operations';
import { BurnHistory } from './BurnHistory';
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
  imageOperationBurn,
  imageOperationExtract,
  imageOperationUnlink,
  imageOperationRename,
})=><div>
  <div>
    <h1>Diagram</h1>
    <pre>{require('../../../../diagram.txt')}</pre>
  </div>
  <Disks
    disks={disks}
    operations={(disk)=><Operations
      section={'disk'}
      status={burnStatus}
      setOutput={burnerSetOutput}
      makeImage={imageOperationDuplicate}
      target={disk}/>}
  />
  <PiBootConfigurator />
  <Burner status={burnStatus} start={burnerStart} interrupt={burnerInterrupt}/>
  <BurnHistory burns={burnStatus.history} />
  <Images
    images={images}
    operations={(img)=><Operations
      section={'image'}
      status={burnStatus}
      setInput={burnerSetInput}
      makeImage={imageOperationDuplicate}
      burnImage={imageOperationBurn}
      extract={imageOperationExtract}
      unlink={imageOperationUnlink}
      renameImage={imageOperationRename}
      target={img}/>}
  />
  <WifiClient
    status={wifiClient}
    closeScanner={wifiClientCloseScanner}
    performScan={wifiClientPerformScan}
    associate={wifiClientAssociate}
    scanStatus={wifiClientScanStatus}
    assocStatus={wifiClientAssocStatus}
  />
</div>);
