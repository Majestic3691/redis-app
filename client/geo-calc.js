<script type="text/javascript" language="javascript">


function GetAirports(state) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "localhost:3000/state/" + state + "/airports", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
    var response = JSON.parse(xhttp.responseText);
    return response;
}

document.getElementById('state').onchange = function () {
  var vState = document.getElementById('state')
  GetAirports(vState.value.toLowerCase(), function (err, results) {
    if (err) {
      console.log(err)
    } else {
      console.log('Airports for ' + vState.value.toLowerCase() + ': ' + results)
    }
    var airportsbystate = results
    var ddOrigin = document.getElementById('origin')
    var ddDestination = document.getElementById('destination')
    var fragment = document.createDocumentFragment()
    airportsbystate.forEach(function (airport, index) {
      var opt = document.createElement('option')
      opt.innerHTML = airport
      opt.value = airport
      fragment.appendChild(opt)
    })
    ddOrigin.appendChild(fragment)
    ddDestination.appendChild(fragment)
  })
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
