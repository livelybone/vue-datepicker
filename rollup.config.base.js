const commonjs = require('rollup-plugin-commonjs')
const resolve = require('rollup-plugin-node-resolve')
const vuePlugin = require('rollup-plugin-vue')
const babel = require('rollup-plugin-babel')
const { DEFAULT_EXTENSIONS } = require('@babel/core')

const isWatch = process.env.BUILD_ENV === 'watch'

const vue = vuePlugin.default || vuePlugin

module.exports = {
  plugins: [
    ...(isWatch
      ? [
          {
            name: 'replace',
            transform(code) {
              return {
                code: code.replace(
                  /process\.env\.NODE_ENV/g,
                  JSON.stringify('production'),
                ),
              }
            },
          },
        ]
      : []),
    resolve({
      extensions: [...DEFAULT_EXTENSIONS, '.vue', '.ts', '.tsx'],
    }),
    commonjs(),
    vue({ css: true }),
    babel({
      babelrc: false,
      externalHelpers: false,
      runtimeHelpers: true,
      extensions: [...DEFAULT_EXTENSIONS, '.vue', '.ts', '.tsx'],
      presets: [
        '@babel/preset-typescript',
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
