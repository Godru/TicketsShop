'use strict'

var webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
var extractCSS = new ExtractTextPlugin("[name].css");
var extractLESS = new ExtractTextPlugin("[name].css");


if (typeof process.env.NODE_ENV == "undefined") process.env.NODE_ENV = "development";

var config = {
  cache: true,
  resolve: {
    modules: ['node_modules', './src'],
    extensions: ['.js', '.jsx']
  },

  entry: {
    'login': './src/login',
    'admin': './src/admin',
    'user-panel': './src/user',
    'tickets-shop': './src/tickets',
    'sessions-ticket-shop': './src/sessionTickets'
  },
  output: {
    path: __dirname + '/./assets',
    filename: "[name].js",
  },

  devtool: process.env.NODE_ENV == "development" ? "cheap-inline-module-source-map" : false,

  plugins: [
    new webpack.DefinePlugin({
      'process.env': Object.keys(process.env).reduce(function(o, k) {
        o[k] = JSON.stringify(process.env[k]);
        return o;
      }, {})
    }),
    // new webpack.ProvidePlugin({
    //   $: 'jquery',
    //   jQuery: 'jquery',
    //   'window.jQuery': 'jquery'
    // }),
    // new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.[hash:6].js'),
    // new webpack.optimize.UglifyJsPlugin(),
    // new webpack.NODE_ENVoErrorsPlugin(),
    // new webpack.optimize.OccurenceOrderPlugin(),
    extractCSS, extractLESS,
    new webpack.optimize.CommonsChunkPlugin({
        //names: ['webshop.core', 'bootstrap.bundle'],
        name: 'baloon-core',
        minChunks: Infinity
    }),
  ],

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: __dirname,
        query: {
            presets: ['react', 'es2015', 'stage-0'],
            plugins: ['react-html-attrs', 'transform-decorators-legacy', 'transform-class-properties'],
        }
      },
      // { test: /\.scss$/,                       loaders: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader") },
      { test: /\.less$/,
        loaders: extractLESS.extract({
          fallback: "style-loader",
          use: [
            {loader: "css-loader"},
            {loader: "resolve-url-loader"},
            {loader: "less-loader"}
          ],
        })
      },
      { test: /\.css$/,                        loaders: extractCSS.extract("style-loader", "resolve-url-loader", 'css-loader') },
      // { test: /effi-protocol\.js/,             loader: 'imports?jQuery=jquery' },
      // { test: /bootstrap\/js\//,               loader: 'imports?jQuery=jquery' },
      { test: /\.(woff|woff2)$/,               loader: "url-loader?limit=20000&mimetype=application/font-woff" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,    loader: "url-loader?limit=10000&minetype=application/octet-stream" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,    loader: "file" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,    loader: "url-loader?limit=10000&minetype=image/svg+xml" },
       { test: /vendor\/.+\.(jsx?)$/,           loader: 'imports?jQuery=jquery,$=jquery,this=>window'},
      { test: /\.(gif|png)$/,                  loader: "url-loader?limit=10000"},
      { test: /\.(jpe?g)$/,                    loader: "file-loader"},
      { test: /\.html$/,                       loader: "html-loader"}
    ]
  }
};


if (process.env.NODE_ENV == "production") {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true,
        // unsafe: true // js-cookie fails to work in unsafe mode
      }
    })
  );
}

module.exports = config;
