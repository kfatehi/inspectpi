import React from 'react';

export const Disks = ({
  disks,
  burnerLoader
}) => <div>
  <h1>Disks</h1>
  <ul>
    {disks.map((disk)=><li key={disk.name}>
      {disk.name} ({disk.size})
      {burnerLoader(disk)}
    </li>)}
  </ul>
</div>;
