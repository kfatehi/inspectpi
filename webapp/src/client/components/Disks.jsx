import React from 'react';
import prettyBytes from 'pretty-bytes';

export const Disks = ({
  disks,
  burnerLoader
}) => <div>
  <h1>Disks</h1>
  <ul>
    {disks.map((disk)=><li key={disk.name}>
      {disk.name} {disk.type} ({prettyBytes(parseInt(disk.size))})
      {burnerLoader(disk)}
    </li>)}
  </ul>
</div>;
