var fs = require('fs');
var path = require('path');
var nodeExternals = require('webpack-node-externals');

var libraryName = 'Library';
var outputFile = libraryName + '.min.js';

var config = {
  target: 'node',
  context: __dirname,
  externals: [nodeExternals()],
  devtool: 'source-map',
  entry: ['babel-polyfill', path.join(__dirname, 'src/index.js')],
  output: {
    path: path.join(__dirname, '/lib'),
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/
      }
    ]
  }
};

module.exports = config;
