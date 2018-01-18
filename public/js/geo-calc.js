
function GetAirports (state) {
  console.log('GetAirports called!!!')
  var xhttp = new XMLHttpRequest()
  xhttp.open('GET', 'http://localhost:3000/airports/' + state, true)
  xhttp.setRequestHeader('Content-type', 'application/json')
  xhttp.send()
//  var response = JSON.parse(xhttp.responseText)
  var response = xhttp.responseText
  return response
}

document.getElementById('state').addEventListener('change', function () {
  console.log('OnChange event fired!!!')
  var vState = document.getElementById('state')
  console.log('State selected value: ' + vState.value)
  try {
    var airportsByState = GetAirports(vState.value.toLowerCase())
    console.log('(client)Airports for ' + vState.value.toLowerCase() + ': ' + airportsByState.value)
    var ddOrigin = document.getElementById('origin')
    ClearDropdown(ddOrigin.id)
    var ddDestination = document.getElementById('destination')
    ClearDropdown(ddDestination.id)
    var fragment = document.createDocumentFragment()
    for (var i = 0; i < airportsByState.length; i++) {
      console.log('Airport: ' + airportsByState[i].value + '\n')
      var opt = document.createElement('option')
      opt.innerHTML = airportsByState[i].value
      opt.value = airportsByState[i].value
      fragment.appendChild(opt)
    }
    console.log('Contents of fragment: ' + fragment + '\n')
    ddOrigin.appendChild(fragment)
    ddDestination.appendChild(fragment)
  } catch (error) {
    console.log('GetAirports Status: ' + error.stack)
  }
})

function ClearDropdown (elementId) {
  console.log('ClearDropdown called!!! DD: ' + elementId)
  var select = document.getElementById(elementId)
  for (var i = 0; i < select.options.length; i++) {
    console.log('...removing ' + i + ' ' + select.options[i].value)
    select.options[i] = null
  }
}

// document.getElementById('state').onchange = function () {
//   var vState = document.getElementById('state')
//   client.smembers(vState.value.toLowerCase(), function (err, results) {
//     if (err) {
//       console.log(err)
//     } else {
//       console.log('Airports for ' + vState.value.toLowerCase() + ': ' + results)
//     }
//     var airportsbystate = results
//     var ddOrigin = document.getElementById('origin')
//     var ddDestination = document.getElementById('destination')
//     var fragment = document.createDocumentFragment()
//     airportsbystate.forEach(function (airport, index) {
//       var opt = document.createElement('option')
//       opt.innerHTML = airport
//       opt.value = airport
//       fragment.appendChild(opt)
//     })
//     ddOrigin.appendChild(fragment)
//     ddDestination.appendChild(fragment)
//   })
// }
