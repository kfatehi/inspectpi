import React from 'react';

import { SimpleInput } from './SimpleInput';

export const WifiAssociator = React.createClass({
  getInitialState: function () {
    const { status: { associating } } = this.props;
    return { wantPsk: false }
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
    const { bss: { ssid, security }, status: { associating, error } } = this.props;
    const startButton = <button
      disabled={associating}
      onClick={()=>this.start(security)}>
      {associating ? 
          <span>Associating...</span> :
          <span>Associate to {ssid}</span> }
    </button>
      
    return <div>
      { error ? <p>{error}</p> : null }
      { wantPsk ? <SimpleInput
        name="psk"
        placeholder="password"
        handleSubmit={this.handleSubmitPsk}
      /> : startButton}
    </div>;
  }
})

