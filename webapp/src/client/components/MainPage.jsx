import React from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../action-creators';

import { Disks } from './Disks';

export const MainPage = connect(state=>state, actionCreators)(({
  disks
})=><div>
  <Disks disks={disks}/>
</div>);
