import React from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../action-creators';

import { Disks } from './Disks';
import { Images } from './Images';
import { WifiClient } from './WifiClient';
import { Burner } from './Burner';
import { Operations } from './Operations';
import { BurnHistory } from './BurnHistory';
import { Mounter } from './Mounter';
import { Architecture } from './Architecture';
import { Recipes } from './Recipes';

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
  burnerClear,
  burnerInterrupt,
  imageOperationDuplicate,
  imageOperationBurn,
  imageOperationExtract,
  imageOperationUnlink,
  imageOperationRename,
  mounterStatus,
  mounterOperationMountDisk,
  mounterOperationUnmountDisk,
  recipes
})=><div>
  <div>
    <p>Welcome to InspectPi.</p>
  </div>
  <Architecture />
  <Disks
    disks={disks}
    operations={(disk)=><Operations
      section={'disk'}
      status={burnStatus}
      setOutput={burnerSetOutput}
      makeImage={imageOperationDuplicate}
      target={disk}/>}
  />
  <Mounter
    disks={disks}
    mounted={mounterStatus.mounted}
    mountDisk={mounterOperationMountDisk}
    unmountDisk={mounterOperationUnmountDisk}
  />
  <Recipes
    recipes={recipes}
  />
  <Burner
    mounted={mounterStatus.mounted}
    status={burnStatus}
    start={burnerStart}
    clear={burnerClear}
    interrupt={burnerInterrupt}
  />
  <BurnHistory burns={burnStatus.history} />
  <Images
    images={images}
    operations={(img)=><Operations
      section={'image'}
      status={burnStatus}
      setInput={burnerSetInput}
      makeImage={imageOperationDuplicate}
      burnImage={imageOperationBurn}
      extractImage={imageOperationExtract}
      unlinkImage={imageOperationUnlink}
      renameImage={imageOperationRename}
      mounted={mounterStatus.mounted}
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
