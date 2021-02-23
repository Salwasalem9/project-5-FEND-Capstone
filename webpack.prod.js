const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
// cleaning dist folder after building
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/client/index.js',
  output: {
    libraryTarget: 'var',
    library: 'Client',
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: '/.js$/',
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/client/html/index.html',
      filename: './index.html',
    }),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
    }),
    new MiniCssExtractPlugin({ filename: '[name].css' }),
    new webpack.ProvidePlugin({
      moment: 'moment',
    }),
    new CopyPlugin({
      patterns: [{ from: 'src/client/media', to: 'media' }],
    }),
    new CleanWebpackPlugin({
      dry: true,
      cleanStaleWebpackAssets: false,
      cleanAfterEveryBuildPatterns: ['static*.*', '!static1.js'],
    }),

    // Optimizing moment bundle size
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
};