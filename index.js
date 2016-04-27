var path = require('path')
var url = require('url')
var fs = require('fs')
var sass = require('node-sass')
var postcss = require('postcss')
var autoprefixer = require('autoprefixer')
var extend = require('extend')

function renderSass(css, options) {
  css = url.parse(css, true, true)
  css = path.relative(options.publicPath, css.pathname)
  var render = sass.renderSync({
    file: path.join(options.src, css).replace('.css', options.extension),
    outputStyle: options.outputStyle
  })
  return render.css
}

function middleware(options) {
  options = extend({
    src: process.cwd,
    publicPath: '',
    extension: '.scss',
    outputStyle: 'compressed',
    autoprefixer: {
      browsers: ['last 2 versions', '> 5%', 'safari >= 5', 'ie >= 8', 'opera >= 12', 'Firefox ESR', 'iOS >= 6', 'android >= 4']
    }
  }, options)

  return function*(next) {
    var ctx = this
    if (this.req.method !== 'GET' && this.req.method !== 'HEAD') {
      return yield next
    }
    if (!/\.css/.test(this.req.url)) {
      return yield next
    }

    this.res.writeHead(200, {
      'Content-Type': 'text/css',
      'Cache-Control': 'max-age=0'
    })

    var css = renderSass(this.req.url, options)

    postcss([
      autoprefixer(options.autoprefixer)
    ])
      .process(css)
      .then(function(result) {
        ctx.res.end(result.css)
      })
  }
}

module.exports = middleware
