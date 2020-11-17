const path = require( 'path' );
const webpack = require( 'webpack' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const TerserPlugin = require('terser-webpack-plugin');

// Configuration for the ExtractTextPlugin.
const extractConfig = {
  use: [
    { loader: 'css-loader' },
    {
      loader: 'postcss-loader',
      options: {
        plugins: [ require( 'autoprefixer' ) ],
      },
    },
    {
      loader: 'sass-loader',
      query: {
        outputStyle:
          'production' === process.env.NODE_ENV ? 'compressed' : 'nested',
      },
    },
  ],
};


module.exports = {
  entry: {
    './dist/js/scripts' : './src/js/scripts.js',
    './dist/js/scripts.min' : './src/js/scripts.js',
    './dist/js/woocommerce' : './src/js/woocommerce.js',
    './dist/js/woocommerce.min' : './src/js/woocommerce.js',
    './dist/js/editor' : './src/js/editor.js',
    './dist/js/editor.min' : './src/js/editor.js',
    './dist/js/admin/customizer-nav-menus' : './src/js/admin/customizer-nav-menus.js',
    './dist/js/admin/customizer-nav-menus.min' : './src/js/admin/customizer-nav-menus.js',
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      include: /\.min\.js$/,
    })],
  },
  output: {
    path: path.resolve( __dirname ),
    filename: '[name].js'
  },
  externals: {
    jquery: 'jQuery'
  },
  watch: 'production' !== process.env.NODE_ENV,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /style\.s?css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          ...extractConfig.use,
        ]
      },
      {
        test: /editor\.s?css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          ...extractConfig.use,
        ]
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    } )
  ],
};
