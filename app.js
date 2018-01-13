var express = require('express')
var path = require('path')
var logger = require('morgan')
var bodyParser = require('body-parser')
var redis = require('redis')
var config = require('./config')

var app = express()

// Create Client
var client = redis.createClient(config.redisConf.port, config.redisConf.host)

client.on('connect', function () {
  console.log('Redis Server Connected at ' + config.redisConf.host + ':' + config.redisConf.port + '...')
})

client.on('error', function (err) {
  console.log('Error ' + err)
})

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
  var title = 'Task List'

  client.lrange('tasks', 0, -1, function (err, reply) {
    if (err) {
      console.log(err)
    }
    client.hgetall('call', function (err, call) {
      if (err) {
        console.log(err.stack)
      }
    client.geopos()
      res.render('index', {
        title: title,
        tasks: reply,
        call: call,
        calc: calc
      })
    })
  })
})

app.post('/task/add', function (req, res) {
  var task = req.body.task

  console.log('Adding task: ' + task)
  client.rpush('tasks', task, function (err, reply) {
    if (err) {
      console.log(err)
    }
    console.log('Task Added...')
    res.redirect('/')
  })
})

app.post('/task/delete', function (req, res) {
  var tasksToDel = req.body.tasks

  client.lrange('tasks', 0, -1, function (err, tasks) {
    for (var i = 0; i < tasks.length; i++) {
      if (tasksToDel.indexOf(tasks[i]) > -1) {
        client.lrem('tasks', 0, tasks[i], function () {
          if (err) {
            console.log(err)
          }
        })
      }
    }
    res.redirect('/')
  })
})

app.post('/call/add', function (req, res) {
  var newCall = {}

  newCall.name = req.body.name
  newCall.company = req.body.company
  newCall.phone = req.body.phone
  newCall.time = req.body.time

  console.log('Adding call record for: ' + newCall.name)
  client.hmset('call', ['name', newCall.name, 'company', newCall.company, 'phone', newCall.phone, 'time', newCall.time], function (err, reply) {
    if (err) {
      console.log(err)
    }
    console.log('Added call record: ' + reply)
    res.redirect('/')
  })
})

app.post('/distance/calc', function (req, res){
  var newCalc = {}

  newCalc.state = req.body.state
  newCalc.origin = req.body.origin
  newCalc.destination = req.body.destination
  newCalc.distance = req.body.distance

  console.log('Calculating distance from ' + newCalc.origin + ' to ' + newCalc.destination + ' in ' + newCalc.state + '...')
  client.geodist('call', ['name', newCall.name, 'company', newCall.company, 'phone', newCall.phone, 'time', newCall.time], function (err, reply) {
    if (err) {
      console.log(err)
    }
    console.log('Added call record: ' + reply)
    res.redirect('/')
  })
})
// app.get() //calculate distance between 2 airports in the same State
// 3 dropdowns
// fill in dropdowns choose state then each airport
// use the 2 values to find distance
// button Calculate
// 1 text box = distance
// add set of states - to retreive a list of all states
// add set of locations for each state - to retrieve the list for the dropdowns


app.listen(config.app_port)
console.log('Server Started on Port ' + config.app_port + '...')

module.exports = app
