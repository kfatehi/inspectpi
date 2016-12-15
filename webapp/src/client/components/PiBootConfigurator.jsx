import React from 'react';

export const PiBootConfigurator = React.createClass({
  render: function() {
    const {
      status: { 
        mounted
      },
      disks,
      mountDisk,
      unmountDisk,
    } = this.props;

    const btnMount = () => <button onClick={()=>mountDisk()}>
      Mount
    </button>

    const btnUnmount = () => <button onClick={()=>unmountDisk()}>
      Unmount
    </button>

    const mountedView = () => <div>
      <span>SD card is mounted at /mnt/sdcard</span>
      {btnUnmount()}
    </div>;

    const unmountedView = () => <div>
      <pre>{JSON.stringify(disks, null, 4)}</pre>
      { disks ? btnMount() : "No SD card inserted" }
    </div>

    return <div>
      <h1>Pi Boot Configurator</h1>
      { mounted ? mountedView() : unmountedView() }
    </div>;
  }
});
