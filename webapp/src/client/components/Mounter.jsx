import React from 'react';

export const Mounter = React.createClass({
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
      { disks.length > 0 ? <div>
        <pre>{JSON.stringify(disks, null, 4)}</pre>
        btnMount()
      </div>: "No SD card inserted" }
    </div>

    return <div>
      <h1>Mounter</h1>
      { mounted ? mountedView() : unmountedView() }
    </div>;
  }
});
