const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

module.exports = function(config) {
  config.set({
    browsers: ['Chrome'],
    frameworks: ['jasmine', 'jasmine-matchers', 'babel-polyfill'],
    reporters: ['spec', 'coverage-istanbul'],

    // logLevel: config.LOG_DEBUG,

    listenAddress: 'localhost',

    files: [
      'test/index.js'
    ],

    preprocessors: {
      'test/index.js': [ 'webpack', 'sourcemap' ]
    },

    webpack: {
      devtool: '#inline-source-map',
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
            test: /\.js$/,
            enforce: 'post',
            use: {
              loader: 'istanbul-instrumenter-loader',
              options: {
                esModules: true,
                produceSourceMap: true
              }
            },
            exclude: /node_modules|test|dist/
          },
          {
            test: /\.(scss|sass)$/,
            use: ['style-loader', 'css-loader', 'sass-loader']
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
          }
        ]
      },
      resolve: {
        alias: {
          Src: '../src/js',
          Components: './components'
        }
      }
    },

    coverageIstanbulReporter: {
      reports: [ 'text', 'lcovonly' ],
      dir: path.join(__dirname, 'coverage'),
      fixWebpackSourcePaths: true
    },

    webpackServer: {
      noInfo: true
    },

    webpackMiddleware: {
      stats: 'errors-only'
    }

  })
}
