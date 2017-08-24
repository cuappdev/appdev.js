const fs = require('fs');
const path = require('path');

let libraryName = 'Library';
let outputFile = libraryName + '.min.js';

const nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function (x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function (mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

const config = {
  entry: ['babel-polyfill', path.join(__dirname, '/src/index.js')],
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, '/lib'),
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: nodeModules,
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
        query: {
          presets: ['es2015', 'stage-2'],
          plugins: [
            require('babel-plugin-add-module-exports'),
            require('babel-plugin-transform-async-to-generator'),
            require('babel-plugin-transform-class-properties'),
            require('babel-plugin-transform-es2015-classes')
          ]
        }
      }
    ]
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: ['.json', '.js']
  }
};

module.exports = config;
