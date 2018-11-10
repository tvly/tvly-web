require('json5/lib/require');

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OfflinePlugin = require('offline-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const config = require('./config.json5');
const meta = require('./package');

module.exports = {
  entry: ['@babel/polyfill', 'whatwg-fetch', './src/main.js'],
  mode: process.env.NODE_ENV || 'production',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'build.js',
    publicPath: config.baseUrl,
  },
  module: {
    rules: [{
      test: /\.(vue|js)$/,
      enforce: 'pre',
      exclude: /node_modules/,
      loader: 'eslint-loader',
    }, {
      test: /modernizr-config.json5$/,
      enforce: 'post',
      loader: 'modernizr-loader',
    }, {
      test: /\.vue$/,
      loader: 'vue-loader',
    }, {
      test: /\.json5$/,
      loader: 'json5-loader',
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
    }, {
      test: /\.css$/,
      loader: 'css-loader',
    }, {
      test: /materialize.scss$/,
      use: [
        'css-loader',
        'resolve-url-loader',
        {
          loader: 'sass-loader',
          options: {
            data: `
            $primary-color: ${config.primaryColor};
            $secondary-color: ${config.secondaryColor};
            `,
          },
        },
      ],
    }, {
      test: /.scss$/,
      exclude: /materialize.scss$/,
      use: [
        'css-loader',
        'sass-loader',
      ],
    }, {
      enforce: 'post',
      test: /\.webmanifest$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
      },
    }, {
      test: /\.webmanifest$/,
      loader: 'webmanifest-loader',
      options: {
        data: {
          config,
        },
      },
    }, {
      enforce: 'post',
      test: /\.(css|scss)$/,
      loader: 'style-loader',
    }, {
      test: /\.(png|jpg|gif|svg|woff2|ttf|woff|eot|swf)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]?[hash]',
      },
    }],
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js',
      'modernizr$': path.resolve(__dirname, './modernizr-config.json5'),
    },
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      WEBPACK_APP_VERSION: JSON.stringify(meta.version),
      WEBPACK_TIMESTAMP: JSON.stringify(Date.now()),
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
    new webpack.ProvidePlugin({
      // activate hlsjs-lite plugin of flowplayer
      // https://flowplayer.com/help/developers/flowplayer-7/setup#hlsjs-lite
      'window.Hls': 'hls.js',
    }),
  ],
};

if (process.env.NODE_ENV === 'production') {
  const externals = [
    config.sponsorLogoUrl,
    ...config.channelsUrlList,
    ...(config.epgUrlList || []),
  ]

  module.exports.plugins = (module.exports.plugins || []).concat([
    // OfflinePlugin show be always the last plugin
    new OfflinePlugin({
      externals,
      autoUpdate: true,
      responseStrategy: 'network-first',
      ServiceWorker: {
        prefetchRequest: {
          credentials: 'include',
          mode: 'cors',
        },
        cacheName: config.cacheName,
        // https://github.com/NekR/offline-plugin/issues/351
        minify: false,
      },
      AppCache: false,
    }),
  ]);
}
