var express = require('express')
var path = require('path')
var logger = require('morgan')
var bodyParser = require('body-parser')
var routes = require('./routes/')
var config = require('./config')
var router = express.Router()
// var tls = require('tls')
// var fs = require('fs')

var app = express()
const options = {
  url: 'https://jsonplaceholder.typicode.com/posts',
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Accept-Charset': 'utf-8',
    'User-Agent': 'my-reddit-client'
  }
}

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(router)
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'static')))
app.use('/', routes)

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
} else {
// production error handler
// no stacktraces leaked to user
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: {}
    })
  })
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).send('Not Found')
})

app.listen(config.app_port)
console.log('Server Started at ' + new Date() + ' on Port ' + config.app_port + '...')

module.exports = app
