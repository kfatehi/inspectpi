import React from 'react';

export const burnKey = (img,disk) => `${img.name}->${disk.name}`;

export const Burner = React.createClass({
  startBurn: function(imgName, diskName) {
    console.log('want to burn', imgName, diskName);
  },
  interruptBurn: function() {
    console.log('want to intrerrupt');
  },
  render: function() {
    const {
      image,
      disk,
      status: {
        burning,
        pairKey,
        progress
      }
    } = this.props;

    let key = burnKey(image, disk);
    
    if (disk.size < image.size) {
      return null;
    } else if (burning) {
      if (key === pairKey) {
        return <div>
          <span>burn progress: {progress}</span>
          <button onClick={()=>this.interruptBurn()}>Interrupt</button>
        </div>
      } else {
        return null;
      }
    } else {
      return <button
        onClick={()=>this.startBurn(image.name, disk.name)}>
        Burn to {disk.name}
      </button>;
    }
  }
});
