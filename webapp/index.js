const shell = require('./shell');
const express = require('express');
const app = express();

app.use(express.static('public'));

shell.init().then(function() {
  app.listen(3000);
  console.log('listening on 3000');
});
