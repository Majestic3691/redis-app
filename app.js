var express = require('express')
var path = require('path')
var logger = require('morgan')
var bodyParser = require('body-parser')
var redis = require('redis')
var config = require('./config')
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

// Establish SSL
// var ssl = {
//  key: fs.readFileSync('C:\\Users\\Michael\\OneDrive\\MTRConsulting\\Certificates\\TwoDudes.ppk', encoding = 'ascii'),
//  cert: fs.readFileSync('C:\\Users\\Michael\\OneDrive\\MTRConsulting\\Certificates\\TwoDudesCert.pfx', encoding = 'ascii')
//  ca: [ fs.readFileSync('path to ca certfile', encoding = 'ascii') ]
// }

// Create Client
// var client = redis.createClient(config.redisConf.port, config.redisConf.host, {tls: ssl})
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
  var title = 'Task List(Main)'

  client.lrange('tasks', 0, -1, function (err, reply) {
    if (err) {
      console.log(err.stack)
    } else {
      console.log('Contents of tasks: ' + reply)
    }
    client.hgetall('call', function (err, call) {
      if (err) {
        console.log(err.stack)
      } else {
        console.log('Contents of call: \nName: ' + call.name + '\nCompany: ' + call.company + '\nPhone: ' + call.phone + '\nTime: ' + call.time)
      }
      client.smembers('states', function (err, results) {
        if (err) {
          console.log(err.stack)
        } else {
          console.log('Contents of results: ' + results)
        }
        res.render('index', {
          title: title,
          tasks: reply,
          call: call,
          states: results,

        })
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

  console.log('Adding call record for: ' + newCall)
  client.hmset('call', ['name', newCall.name, 'company', newCall.company, 'phone', newCall.phone, 'time', newCall.time], function (err, reply) {
    if (err) {
      console.log(err)
    }
    console.log('Added call record: ' + reply)
    res.redirect('/')
  })
})

app.get('/states', function (req, res) {
  client.smembers('states', function (err, results) {
    if (err) {
      console.log(err)
    }
    var states = results
    console.log('states: ' + states)
    return res.status(200).send(results)
  })
})

app.get('/airports/:state', function (req, res) {
  var state = req.params.state
  client.smembers(state, function (err, results) {
    if (err) {
      console.log(err)
    } else {
      console.log('Airports for ' + state + ': ' + results)
    }
    return res.status(200).send(results)
  })
})

// default for units is meters
app.post('/distance/calc', function (req, res) {
  var newCalc = {}

  newCalc.state = req.body.state
  newCalc.origin = req.body.origin
  newCalc.destination = req.body.destination
  newCalc.distance = res.body.distance
  newCalc.units = req.body.units

  console.log('Calculating distance from ' + newCalc.origin + ' to ' + newCalc.destination + ' in ' + newCalc.state + '...')
  client.geodist('calc', ['state', newCalc.state, 'origin', newCalc.origin, 'destination', newCalc.destination, 'distance', newCalc.distance, 'units', newCalc.units], function (err, results) {
    if (err) {
      console.log(err)
    }
    console.log('Geo distance calculated: ' + results)
    res.redirect('/')
  })
})
// app.get() //calculate distance between 2 airports in the same State
// fill in dropdowns choose state then each airport
// create javascript function and event for choosing state.
// On state selected event, execute the ajax script to retrieve the data for the origin and destination dropdowns
//


app.listen(config.app_port)
console.log('Server Started on Port ' + config.app_port + '...')

module.exports = app
