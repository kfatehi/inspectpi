const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: {
    vendor: [
      'redux',
      'react',
      'react-dom',
      'react-redux',
      "react-router",
      "socket.io-client",
      "pretty-bytes",
      "bluebird"
    ],
    main: `${__dirname}/src/client/index.jsx`,
  },
  output: {
    path: `${__dirname}/public`,
    filename: '[name].bundle.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel' },
      { test: /\.css$/, exclude: /\.useable\.css$/, loader: "style!css" },
      { test: /\.useable\.css$/, loader: "style/useable!css" },
      { test: /\.json/, loader: "json" },
      { test: /\.less$/, loader: 'style!css!less' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" },
      { test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
      { test: /\.md$/, loader: "raw" },
      { test: /\.jpe?g$/, loader: "file" },
      { test: /\.gif$/, loader: "file" },
      { test: /\.csv$/, loader: "raw" },
      { test: /\.txt$/, loader: "raw" },
    ],
    plugins: [
      new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js")
    ]
  }
}

