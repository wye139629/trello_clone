const path = require('path')
const isDevMode = process.env.NODE_ENV === 'development'
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CONTENT_HASH = isDevMode ? '' : '-[contenthash]'

module.exports = {
  mode: process.env.NODE_ENV,
  entry:{
    app: ['./src/index.js']
  },
  output: {
    filename: `[name]${CONTENT_HASH}.js`,
    chunkFilename: `[name]-chunk${CONTENT_HASH}.js`,
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    modules: [
      path.resolve('src'),
      path.resolve('node_modules')
    ],
    alias: {
      '@': path.resolve('src') // 設定 import 的絕對路徑
    },
    extensions: ['.js', '.json', '.jsx']
  },
  module:{
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader'
        },
        include: [path.resolve('src')],
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          {
            loader: MiniCssExtractPlugin.loader,
          },
          // Translates CSS into CommonJS
          {
            loader: "css-loader",
            options: {
              sourceMap: true
            }
          },
          // Compiles Sass to CSS
          {
           loader: "sass-loader",
            options: {
              sourceMap: true,
            }
          }
        ],
        include: path.resolve('src/styles')
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: 2048, // 小於 2048k 自動轉成 base64 字串
              name: '[path][name].[ext]'
            }
          },
        ],
      },
      {
        test: /\.html$/i,
        use: {
          loader: 'html-loader',
        },
        include: path.resolve('public')
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: `style${CONTENT_HASH}.css`
    })
  ],
  optimization: {
    splitChunks:{
      chunks: 'all',
      cacheGroups: {
        verdors: {
          name: 'verdors', // 第三方套件都會被打包成 verdors 這個檔案
          chunks: 'all',
          test:/[\\/]node_modules[\\/]/, //從 node_modules 撈出來的套件都會被整合
          priority: 10, // 優先做這個設定
          enforce: true, // 強制套用這邊的設定
        }
      }
    }
  }
}
