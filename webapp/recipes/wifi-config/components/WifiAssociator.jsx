import React from 'react';

import { SimpleInput } from './SimpleInput';

export const WifiAssociator = React.createClass({
  getInitialState: function () {
    return { wantPsk: false };
  },
  start: function (security) {
    if ( security === "open" ) {
      this.finish();
    } else {
      this.setState({ wantPsk: true })
    }
  },
  finish: function(psk) {
    const {
      bss: { address, ssid, security },
      associate
    } = this.props;
    this.setState({ wantPsk: false })
    associate(address, ssid, psk);
  },
  handleSubmitPsk: function(psk) {
    this.finish(psk)
  },
  render: function () {
    const { wantPsk } = this.state;
    const { bss: { ssid, security } } = this.props;
    const startButton = <button
      onClick={()=>this.start(security)}>
      <span>Associate to {ssid}</span>
    </button>;
      
    return <div>
      { wantPsk ? <SimpleInput
        placeholder="password"
        type="password"
        handleSubmit={this.handleSubmitPsk}
      /> : startButton}
    </div>;
  }
})

