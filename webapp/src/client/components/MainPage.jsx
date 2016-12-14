import React from 'react';

const Component = React.createClass({
  render: function () {
    return <div>Hello</div>;
  }
})

function mapStateToProps(state) {
  return {
    loginError: state.sdcard
  }
}

export const LoginPage = connect(mapStateToProps, actionCreators)(Component);
