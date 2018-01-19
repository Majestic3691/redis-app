
document.getElementById('state').addEventListener('change', function () {
  console.log('OnChange event fired!!!')
  var vState = document.getElementById('state')
  console.log('State selected value: ' + vState.value)
  try {
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
      console.log('Http request GetAirports: ' + error.stack)
    }
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

function clearDropdown (elementId) {
  console.log('ClearDropdown called!!! DD: ' + elementId)
  elementId.options.length = 0
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
