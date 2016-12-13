import React from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../action-creators';

import { Disks } from './Disks';

export const MainPage = connect(state=>state, actionCreators)(({
  disks,
  images
})=><div>
  <Disks disks={disks}/>
  <Images images={images}/>
</div>);
