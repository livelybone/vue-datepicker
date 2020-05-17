/* eslint-disable import/no-extraneous-dependencies, no-console */
const chokidar = require('chokidar')
const spawn = require('cross-spawn')
const chalk = require('chalk')
const { singletonObj } = require('@livelybone/singleton')
const express = require('express')
const path = require('path')

const port = process.env.PORT || 3000

const watcher = chokidar.watch('src')

const debounceTimer = {
  js: null,
  css: null,
  serve: null,
}

function serve() {
  return singletonObj(
    'serve',
    () =>
      new Promise(res => {
        const app = express()
        app.use('/examples', express.static(path.resolve('./examples')))
        app.use('/lib', express.static(path.resolve('./lib')))
        app.listen(port, e => {
          if (e) {
            console.log(chalk.red(e))
            process.exit(1)
          }
          res()
        })
      }),
  ).then(() => {
    debounceTimer.serve = setTimeout(() => {
      console.log(
        `\r\nThe example of your component is listening on ${port}...\r\n`,
      )
      console.log(
        chalk.cyan(
          ` Open http://127.0.0.1:${port}/examples/test.html in your browser`,
        ),
        '\r\n',
      )
    }, 200)
  })
}

function spawnConsole(resource, ls) {
  ls.stdout.on('data', data => {
    if (debounceTimer.serve) clearTimeout(debounceTimer.serve)
    console.log(`${data}`.replace(/[\r\n]/g, ''))
  })
  ls.stderr.on('data', data => {
    if (debounceTimer.serve) clearTimeout(debounceTimer.serve)
    console.log(`${data}`.replace(/[\r\n]/g, ''))
  })
  ls.on('close', code => {
    if (+code === 0) {
      console.log('\r')
      console.log(chalk.cyan(`>>> ${resource} building successful`), '\r\n')
      serve()
    }
  })
}

function build(cmd = 'build:js') {
  const resource = cmd.replace('build:', '')
  if (debounceTimer[resource]) clearTimeout(debounceTimer[resource])
  debounceTimer[resource] = setTimeout(() => {
    console.log(chalk.cyan(`>>> Building for ${resource}...`), '\r\n')
    spawnConsole(resource, spawn('npm', ['run', cmd]))
  }, 1000)
}

watcher.on('all', (event, filename) => {
  const isCss = /.s?css$/
  if (isCss.test(filename)) build('build:css')
  else build()
})
