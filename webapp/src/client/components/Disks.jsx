import React from 'react';

export const Disks = ({
  disks
}) => <div>
  <h1>Disks</h1>
  <ul>
    {disks.map(({name,size})=><li key={name}>
      {name} ({size})
    </li>)}
  </ul>
</div>;
