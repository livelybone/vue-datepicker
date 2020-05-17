/* For test */
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const babelLoader = {
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
}

const config = {
  mode: 'production',
  entry: { index: './src/index.ts' },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  module: {
    rules: [
      { test: /\.vue$/, exclude: /node_modules/, loader: 'vue-loader' },
      {
        test: /\.tsx?$/,
        use: [
          babelLoader,
          {
            loader: 'ts-loader',
            options: { appendTsxSuffixTo: [/\.vue$/] },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        ...babelLoader,
      },
    ],
  },
  plugins: [new VueLoaderPlugin()],
}

module.exports = config
