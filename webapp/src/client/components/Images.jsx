import React from 'react';
import prettyBytes from 'pretty-bytes';
import Dropzone from 'react-dropzone';
import request from 'superagent';

export const Images = React.createClass({
  onDrop: function (acceptedFiles, rejectedFiles) {
    console.log('accp');
    const req = request.post('/images');
    acceptedFiles.forEach((file)=> {
      console.log('att', file);
      req.attach(file.name, file);
      console.log('att2');
    });
    req.on('progress', (e) => {
      console.log('Percentage done: ', e.percent);
    })
    req.end(function(err, res) {
      if (err) throw err;
      console.log(res);
    });
    console.log('end');
  },
  render: function() {
    const {
      images,
      unlink,
      operations,
    } = this.props;
    return <div>
      <h1>Images</h1>
      <Dropzone onDrop={this.onDrop} disablePreview={true}>
        <div>Try dropping some files here, or click to select files to upload.</div>
      </Dropzone>
      <ul>
        {images.map(image=><li key={image.name}>
          {image.name} ({prettyBytes(parseInt(image.size))})
          {operations(image)}
        </li>)}
      </ul>
    </div>;
  }
});
