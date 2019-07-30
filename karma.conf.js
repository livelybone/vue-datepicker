const webpackConfig = require('./webpack.config.js')

module.exports = config => {
  config.set({
    // 浏览器环境
    browsers: ['Chrome'],
    // 测试框架
    frameworks: ['mocha', 'chai'],
    // 需要测试的文件，在 browsers 里面运行，使用 frameworks 测试js，通过 reporters 输出报告
    files: ['test/**/*.spec.js'],
    // 为入口文件制定预处理器，测试 js 之前用 webpack 和 sourcemap 处理一下
    preprocessors: {
      '**/*.spec.js': ['webpack', 'sourcemap'],
    },
    webpack: webpackConfig,
    // 输出报告
    reporters: ['spec', 'coverage'],
    // 覆盖报告的配置
    coverageReporter: {
      dir: './coverage',
      reporters: [{ type: 'lcov', subdir: '.' }, { type: 'text-summary' }],
    },
  })
}
