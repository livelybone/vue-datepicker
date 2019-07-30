/* For test */
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const config = {
  mode: 'production',
  entry: { index: './src/index.js' },
  module: {
    rules: [
      { test: /\.vue$/, exclude: /node_modules/, loader: 'vue-loader' },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                modules: false,
                targets: {
                  browsers: ['> 1%', 'last 2 versions', 'not ie <= 8'],
                },
              },
            ],
          ],
          plugins: ['@babel/plugin-transform-runtime', 'istanbul'],
        },
      },
    ],
  },
  plugins: [new VueLoaderPlugin()],
}

module.exports = config
