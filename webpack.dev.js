const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  entry: './src/client/index.js',
  output: {
    libraryTarget: 'var',
    library: 'Client',
  },
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: '/.js$/',
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
        loader: 'url-loader',
        options: { limit: 100000 },
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/client/html/index.html',
      filename: './index.html',
      inject: 'body',
    }),
    new CopyPlugin({
      patterns: [{ from: 'src/client/media', to: 'media' }],
    }),
    new CleanWebpackPlugin({
      // Simulate the removal of files
      dry: true,
      // Write Logs to Console
      verbose: true,
      // Automatically remove all unused webpack assets on rebuild
      cleanStaleWebpackAssets: true,
      protectWebpackAssets: false,
    }),
    new WorkboxPlugin.GenerateSW(),
    new webpack.ProvidePlugin({
      moment: 'moment',
    }),
  ],
};