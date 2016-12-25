import React from 'react';
import prettyBytes from 'pretty-bytes';

export const Disks = ({
  disks,
  operations
}) => <div>
  <h1>SD Card</h1>
  <ul>
    {disks.map((disk)=><li key={disk.name}>
      {disk.name} {disk.type} ({prettyBytes(parseInt(disk.size))})
      {operations(disk)}
    </li>)}
  </ul>
</div>;
