const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: ['jquery', './src/main.js'],
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'build.js',
  },
  module: {
    rules: [{
      test: /\.(vue|js)$/,
      enforce: 'pre',
      exclude: /node_modules/,
      loader: 'eslint-loader',
    }, {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        loaders: {
        },
        // other vue-loader options go here
      },
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
    }, {
      test: /\.css$/,
      loader: 'css-loader',
    }, {
      enforce: 'post',
      test: /\.css$/,
      loader: 'style-loader',
    }, {
      test: /\.(png|jpg|gif|svg|woff2|ttf|woff|eot)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]?[hash]',
      },
    }],
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js',
    },
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
  },
  performance: {
    hints: false,
  },
  devtool: '#eval-source-map',
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false,
      },
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    })
  ])
}
