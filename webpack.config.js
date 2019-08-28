const path = require( 'path' );
const webpack = require( 'webpack' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );

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
    './dist/js/app' : './src/app.js',
    './dist/js/editor.blocks' : './src/editor.js',
  },
  output: {
    path: path.resolve( __dirname ),
    filename: '[name].js',
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
