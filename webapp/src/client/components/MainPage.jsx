import React from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../action-creators';

const C = React.createClass({
  render: function () {
    return <div>Hello</div>;
  }
})

function mapStateToProps(state) {
  return {
    loginError: state.sdcard
  }
}

export const MainPage = connect(mapStateToProps, actionCreators)(C);
