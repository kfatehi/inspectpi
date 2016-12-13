import React from 'react';

const WifiAssociator = React.createClass({
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
        <input onChange={this.handleChangePsk} name="psk" placeholder="password" type="text"/>
        <input type="submit" value="Submit"/>
      </form> : startButton}
    </div>;
  }
})

export const WifiScanner = ({
  scan,
  scanStatus: {
    scanning,
    baseStations
  },
  associate,
  assocStatus
}) => <div>
  <button
    disabled={scanning}
    onClick={()=>scan()}>
    {scanning ? 'Scanning...' : 'Scan'}
  </button>
  { baseStations.length > 0 ?
      <div>
        <h2>Base Stations</h2>
        <ul>
          {baseStations.map(bss=><li key={bss.address}>
            <pre>{JSON.stringify(bss, null, 4)}</pre>
            <WifiAssociator
              bss={bss}
              associate={associate}
              status={assocStatus[bss.address] || { associating: false, error: null }}
            />
          </li>)}
        </ul>
      </div> : null
  }
</div>;

export const WifiClient = ({
  status: {
    ssid,
    unassociated,
    signal
  },
  scan,
  scanStatus,
  associate,
  assocStatus
}) => <div>
  <h1>Wifi Client (wlan1)</h1>
  <div>{ unassociated ? 'Not connected' : `Connected to ${ssid} (${signal})` }</div>
  <WifiScanner
    scan={scan}
    scanStatus={scanStatus}
    assocStatus={assocStatus}
    associate={associate}
  />
</div>;
