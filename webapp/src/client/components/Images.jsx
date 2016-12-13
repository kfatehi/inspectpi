import React from 'react';

export const Images = ({
  images
}) => <div>
  <h1>Images</h1>
  <ul>
    {images.map(({name,size})=><li key={name}>
      {name} ({size})
    </li>)}
  </ul>
</div>;
