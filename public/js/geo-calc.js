
function processGeoCalc () {
  console.log('(calculate)Click event fired!!!')
  try {
    var httpOP = 'GET'
    var url = 'http://localhost:3000/distance/calc'
    var params = ''
    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        var jsonResponse = JSON.parse(xhttp.responseText)
        console.log('GetDistance: json: ' + jsonResponse)
        var vUnits = document.getElementById('units')
        var vDistance = document.getElementById('distance')
        var vMessage = '<strong>Success!</strong>Distance in ' + vUnits.value + ': ' + jsonResponse
        vDistance.innerHTML = vMessage
        displayMessage(vDistance, true)
      }
    }
    var vState = document.getElementById('state')
    params += 'state=' + vState.value + '&'
    var vOrigin = document.getElementById('origin')
    params += 'origin=' + vOrigin.value + '&'
    var vDestination = document.getElementById('destination')
    params += 'destination=' + vDestination.value + '&'
    var vUnits = document.getElementById('units')
    params += 'units=' + vUnits.value
    xhttp.open(httpOP, url + '?' + params, true)
//    xhttp.open('GET', 'http://localhost:3000/distance/calc/test', true)
//http://localhost:3000/distance/calc?state=Guam&origin=Andersen+Afb&destination=Guam+Intl&units=km
    xhttp.setRequestHeader('Content-type', 'application/json')
    xhttp.send()
    console.log('Get response: ' + xhttp.responseText)
  } catch (error) {
    console.log('Http request GetAirports: ' + error.stack)
  }
}

document.getElementById('state').addEventListener('change', function () {
  console.log('(state)Change event fired!!!')
  var vState = document.getElementById('state')
  console.log('State selected value: ' + vState.value)
  try {
    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        var jsonResponse = JSON.parse(xhttp.responseText)
        console.log('GetAirports: json: ' + jsonResponse)
        var ddOrigin = document.getElementById('origin')
        ddOrigin.options.length = 0
        var ddDestination = document.getElementById('destination')
        ddDestination.options.length = 0
        var originFragment = document.createDocumentFragment()
        var destinationFragment = document.createDocumentFragment()
        for (var i = 0; i < jsonResponse.length; i++) {
          console.log('Add Airport: ' + jsonResponse[i] + ' to the dropdown element\n')
          makeOptionElement(originFragment, jsonResponse[i], jsonResponse[i])
          makeOptionElement(destinationFragment, jsonResponse[i], jsonResponse[i])
        }
        console.log('Length of ddOrigin fragment: ' + originFragment.children.length + '\n')
        ddOrigin.appendChild(originFragment)
        console.log('Length of ddDestination fragment: ' + destinationFragment.children.length + '\n')
        ddDestination.appendChild(destinationFragment)
      }
    }
    xhttp.open('GET', 'http://localhost:3000/airports/' + vState.value.toLowerCase(), true)
    xhttp.setRequestHeader('Content-type', 'application/json')
    xhttp.send()
    console.log('Get response: ' + xhttp.responseText)
  } catch (error) {
    console.log('State:OnChange status: ' + error.stack)
  }
})

function makeOptionElement (vFragment, vKey, vValue) {
  var opt = document.createElement('option')
  opt.innerHTML = vKey
  opt.value = vValue
  vFragment.appendChild(opt)
}

function validateCalcForm () {
  var vMessage = ''
  var ddState = document.getElementById('state')
  var ddOrigin = document.getElementById('origin')
  var ddDestination = document.getElementById('destination')
  var ddUnits = document.getElementById('units')
  var divMessage = document.getElementById('message')
  console.log('State: ' + ddState.value + '\n' + 'Origin: ' + ddOrigin.value + '\n' + 'Destination: ' + ddDestination.value + '\n' + 'Units: ' + ddUnits.value + '\n')
  if (ddState.value === '') {
    vMessage += '<strong>Warning!</strong>Please choose a State!<br>'
  }
  if (ddOrigin.value === '') {
    vMessage += '<strong>Warning!</strong>Please choose an origin!<br>'
  }
  if (ddDestination.value === '') {
    vMessage += '<strong>Warning!</strong>Please choose a destination!<br>'
  }
  if (ddUnits.value === '') {
    vMessage += '<strong>Warning!</strong>Please choose a unit!<br>'
  }
  if (vMessage.length > 0) {
    displayMessage(divMessage, true)
    divMessage.innerHTML = vMessage
    return false
  } else {
    processGeoCalc()
  }
}

function displayMessage (vDiv, vShow) {
  if (vDiv !== undefined) {
    if (vShow) {
      vDiv.style.display = 'block'
    } else {
      vDiv.style.display = 'none'
    }
  }
}

function GetAirports (state) {
  console.log('GetAirports called!!!')
  try {
    var xhttp = new XMLHttpRequest()
    xhttp.open('GET', 'http://localhost:3000/airports/' + state, true)
    xhttp.setRequestHeader('Content-type', 'application/json')
    xhttp.send()
    console.log('Get response: ' + xhttp.responseText)
    var response = JSON.parse(xhttp.responseText)
    console.log('GetAirports: json: ' + response)
    return response
  } catch (error) {
    console.log('GetAirports Status: ' + error.stack)
  }
}
