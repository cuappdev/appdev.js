var fs = require('fs');
var path = require('path');
var nodeExternals = require('webpack-node-externals');

const config = {
  target: 'node',
  context: __dirname,
  externals: [nodeExternals()],
  devtool: 'source-map',
  entry: [path.resolve(__dirname, 'src/index.js')],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    library: 'appdev',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
};

module.exports = config;
