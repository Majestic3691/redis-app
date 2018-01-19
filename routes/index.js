// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes
var router = require('express').Router()
var redis = require('redis')
var config = require('../config')

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

router.get('/', function (req, res) {
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
          tasks: reply.sort(),
          call: call,
          states: results.sort()
        })
      })
    })
  })
})

router.post('/task/add', function (req, res) {
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

router.post('/task/delete', function (req, res) {
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

router.get('/call/list', function (req, res) {
  client.hgetall('call', function (err, results) {
    if (err) {
      console.log(err)
    }
    var jsonList = JSON.stringify(results)
    console.log('jsonList: ' + jsonList)
    return res.status(200).send(jsonList)
  })
})

router.post('/call/add', function (req, res) {
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

router.get('/task/list', function (req, res) {
  client.lrange('tasks', 0, -1, function (err, results) {
    if (err) {
      console.log(err)
    }
    var jsonTasks = JSON.stringify(results.sort())
    console.log('states: ' + jsonTasks)
    return res.status(200).send(jsonTasks)
  })
})

router.get('/states', function (req, res) {
  client.smembers('states', function (err, results) {
    if (err) {
      console.log(err)
    }
    var jsonStates = JSON.stringify(results.sort())
    console.log('states: ' + jsonStates)
    return res.status(200).send(jsonStates)
  })
})

router.get('/airports/:state', function (req, res) {
  var state = req.params.state
  client.smembers(state, function (err, results) {
    if (err) {
      console.log(err)
    } else {
      console.log('Airports for ' + state + ': ' + results)
    }
    var jsonAirports = JSON.stringify(results.sort())
    return res.status(200).send(jsonAirports)
  })
})

router.get('/distance/calcTest', function (req, res) {
  return res.status(200).send('5004 miles')
})

router.get('/distance/calc', function (req, res) {
  var newCalc = {}

  newCalc.state = req.body.state
  newCalc.origin = req.body.origin
  newCalc.destination = req.body.destination
  newCalc.distance = res.body.distance

  console.log('Calculating distance from ' + newCalc.origin + ' to ' + newCalc.destination + ' in ' + newCalc.state + '...')
  client.geodist('calc', ['state', newCalc.state, 'origin', newCalc.origin, 'destination', newCalc.destination, 'distance', newCalc.distance, 'units', newCalc.units], function (err, results) {
    if (err) {
      console.log(err)
    }
    console.log('Geo distance calculated: ' + results)
    return res.status(200).send(results)
  })
})

// default for units is meters
router.post('/distance/calc', function (req, res) {
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
    return res.status(200).send(results)
  })
})
// app.get() //calculate distance between 2 airports in the same State

module.exports = router
