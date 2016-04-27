# koa-sass-middleware

koa middleware for rendering stylesheet request

## use
```js
var koa = require('koa')
var sassMiddleware = require('../')
var path = require('path')

var app = koa()

app.use(sassMiddleware({
  src: path.join(__dirname, 'static'), // css file context folder
  publicPath: '/static/',  // request context path
  extension: '.scss',  // optional
  outputStyle: 'compressed', // optional, it can be nexted, extended, compact, compressed
  autoprefixer: {
    browsers: ['last 2 versions', '> 5%', 'safari >= 5', 'ie >= 8', 'opera >= 12', 'Firefox ESR', 'iOS >= 6', 'android >= 4']
  } //optional, autoprefixer config
}))

var PORT = 8080
module.exports = app.listen(PORT, function(err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + PORT)
})
```