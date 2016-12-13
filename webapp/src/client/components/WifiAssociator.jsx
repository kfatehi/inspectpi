import React from 'react';

export const WifiAssociator = React.createClass({
  getInitialState: function () {
    const { status: { associating } } = this.props;
    return { wantPsk: false, psk:null }
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
  handleChangePsk: function(event) {
    this.setState({ psk: event.target.value });
  },
  handleSubmitPsk: function(event) {
    this.finish(this.state.psk)
    event.preventDefault();
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
      { wantPsk ? <form onSubmit={this.handleSubmitPsk}>
        <input autoFocus onChange={this.handleChangePsk} name="psk" placeholder="password" type="text"/>
        <input type="submit" value="Submit"/>
      </form> : startButton}
    </div>;
  }
})

