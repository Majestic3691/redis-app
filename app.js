var express = require('express')
var path = require('path')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var redis = require('redis')
var config = require('./config')

var app = express()

// Create redis client
var client = redis.createClient(config.redisConf.port, config.redisConf.host)
client.on('connect', function () {
  console.log('Redis Server Connected...')
})
client.on('error', function (err) {
  console.log('Error ' + err)
})

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
//  res.send('Welcome!')
  var title = 'Task List'

  client.lrange('tasks', 0 , -1, function(err, reply) {
    res.render('index', {
      title: title,
      tasks: reply
    })

  })
})
app.listen(config.Port)
console.log('Server Started on Port ' + config.port + '...')

module.exports = app
