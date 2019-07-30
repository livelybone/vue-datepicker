const commonjs = require('rollup-plugin-commonjs')
const resolve = require('rollup-plugin-node-resolve')
const vuePlugin = require('rollup-plugin-vue')
const babel = require('rollup-plugin-babel')
const { DEFAULT_EXTENSIONS } = require('@babel/core')

const vue = vuePlugin.default || vuePlugin

module.exports = {
  plugins: [
    resolve({
      extensions: [...DEFAULT_EXTENSIONS, '.vue'],
    }),
    commonjs(),
    vue({ css: true }),
    babel({
      babelrc: false,
      externalHelpers: false,
      runtimeHelpers: true,
      extensions: [...DEFAULT_EXTENSIONS, '.vue'],
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
    }),
  ],
}
