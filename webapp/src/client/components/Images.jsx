import React from 'react';

export const Images = ({
  images,
  burnerLoader,
}) => <div>
  <h1>Images</h1>
  <ul>
    {images.map(image=><li key={image.name}>
      {image.name} ({image.size})
      {burnerLoader(image)}
    </li>)}
  </ul>
</div>;
