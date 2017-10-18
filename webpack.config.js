const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: {
    index: './js/app.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './dist'),
    library: 'solitare',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['jshint-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              ['transform-builtin-extend', {
                  globals: ['Error', 'Array']
              }]
            ],
            presets: ['env']
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.(scss|sass)$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'sass-loader'],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader'],
          fallback: 'style-loader'
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: './[name]-style.css',
      allChunks: true
    })
  ],
  resolve: {
    alias: {
      Styles: '../scss',
      Components: './components'
    }
  },
  devServer: {
    contentBase: path.resolve(__dirname, './dist')
  },
  devtool: '#inline-source-map' // inline since this is just a dev project, not intended for prod
};
