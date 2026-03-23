const path = require( 'path' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const TerserPlugin = require('terser-webpack-plugin');

// Configuration for the ExtractTextPlugin.
const extractConfig = {
  use: [
    { loader: 'css-loader' },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [ require( 'autoprefixer' ) ],
        },
      },
    },
    {
      loader: 'sass-loader',
      options: {
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
    './dist/js/page-transitions' : './src/js/page-transitions.js',
    './dist/js/page-transitions.min' : './src/js/page-transitions.js',
    './dist/js/admin/customizer-nav-menus' : './src/js/admin/customizer-nav-menus.js',
    './dist/js/admin/customizer-nav-menus.min' : './src/js/admin/customizer-nav-menus.js',
    './dist/js/admin/customizer-motion-controls' : './src/js/admin/customizer-motion-controls.js',
    './dist/js/admin/customizer-motion-controls.min' : './src/js/admin/customizer-motion-controls.js',
    './dist/js/admin/project-color' : './src/js/admin/project-color.js',
    './dist/js/admin/project-color.min' : './src/js/admin/project-color.js',
    './dist/js/admin/site-editor-style-manager' : './src/js/admin/site-editor-style-manager.js',
    './dist/js/admin/site-editor-style-manager.min' : './src/js/admin/site-editor-style-manager.js',
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
    react: 'React',
    jquery: 'jQuery',
    gsap: 'gsap',
  },
  watch: 'production' !== process.env.NODE_ENV,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ["@wordpress/babel-preset-default"]
          }
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
