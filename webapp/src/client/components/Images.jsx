import React from 'react';
import prettyBytes from 'pretty-bytes';

export const Images = ({
  images,
  burnerLoader,
}) => <div>
  <h1>Images</h1>
  <ul>
    {images.map(image=><li key={image.name}>
      {image.name} ({prettyBytes(parseInt(image.size))})
      {burnerLoader(image)}
    </li>)}
  </ul>
</div>;
