//检查node和npm版本是否满足要求，满足继续，否则退出node
require('./check-versions')()

var config = require('../config')
//The process.env property returns an object containing the user environment.
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}
//opn:A better node-open. Opens stuff like websites, files, executables. Cross-platform.
//这里用来在默认浏览器中打开localhost
var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
//https://www.npmjs.com/package/http-proxy-middleware
//Node.js proxying made simple. Configure proxy middleware with ease for connect, express, browser-sync and many more.
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests 转发请求至后台服务器
//proxyTable:{"/api/foo/bar":"http://localhost:4000"} 将/api/foo/bar 上的请求转发至后台
// http://localhost:3000/api/foo/bar -> http://localhost:4000/api/foo/bar
Object.keys(proxyTable).forEach(function (context) {
  //options是一个代理服务器地址
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port
//将resolve函数赋值给_resolve变量，用于后面调用，当调用成功后，promise处于fulfil状态
var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port)
//这里的exports有什么用？？
module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
