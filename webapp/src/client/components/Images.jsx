import React from 'react';
import { Burner, burnKey } from './Burner';

export const Images = ({
  images,
  disks,
  burnStatus
}) => <div>
  <h1>Images</h1>
  <ul>
    {images.map(image=><li key={image.name}>
      {image.name} ({image.size})
      {disks.map(disk=><Burner key={burnKey(image,disk)} status={burnStatus} disk={disk} image={image} />)}
    </li>)}
  </ul>
</div>;
