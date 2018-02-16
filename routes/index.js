// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes
var router = require('express').Router()
var cors = require('cors')
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

var corsOptions = {
  origin: 'http://localhost',
  optionsSuccessStatus: 200 // some browsers and devices gag on 204
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
client.auth(config.redisConf.pass, function (err, result) {
  if (err) {
    console.log(err.stack)
  } else {
    console.log('Authentication was passed to the Redis Server, response was: ' + result)
  }
})

client.on('connect', function () {
  console.log('Redis Server Connected at ' + config.redisConf.host + ':' + config.redisConf.port + '...')
})

client.ping(function (err, result) {
  if (err) {
    console.log(err.stack)
  } else {
    console.log('Redis Server was pinged, response was: ' + result)
  }
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

router.get('/airports/:state', cors(corsOptions), function (req, res) {
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

router.get('/distance/calc/test', function (req, res) {
  return res.status(200).send('5004 miles')
})

router.get('/distance/calc', function (req, res) {
  var newCalc = {}

//  console.log('Request Parameters: State: ' + req.urlquery.state + ' Origin: ' + req.query.origin + ' Destination: ' + req.query.destination + ' Units: ' + req.query.units)
  console.log('Method: ' + req.method)
  console.log('Request URL: ' + req.url)
  var url = require('url')
  var qs = require('querystring')
  var parsedUrl = url.parse(req.url)
  console.log('Parsed Url(encoded): query: ' + parsedUrl.query)
  console.log('Parsed Url(decoded): query: ' + decodeURIComponent(parsedUrl.query))
  var parsedQs = qs.parse(decodeURIComponent(parsedUrl.query))
  console.log('Parsed QueryString: State: ' + parsedQs.state)

  newCalc.state = parsedQs.state
  newCalc.origin = parsedQs.origin
  newCalc.destination = parsedQs.destination
  newCalc.units = parsedQs.units

  console.log('Calculating distance from ' + newCalc.origin + ' to ' + newCalc.destination + ' in ' + newCalc.state + '...')
  client.geodist(newCalc.state, newCalc.origin, newCalc.destination, newCalc.units, function (err, results) {
    if (err) {
      console.log(err)
    }
    console.log('Geo distance calculated: ' + results)
    return res.status(200).send(results)
  })
})

module.exports = router
