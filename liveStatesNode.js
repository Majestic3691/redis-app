var xmlhttp

window.onload = function () {
  getAjaxData()
  setInterval(getAjaxData, 5000)

    // document.getElementById("flights").onchange=function(){
    // getAjaxData();
}

function getAjaxData() {
    if (window.XMLHttpRequest)
        xmlhttp=new XMLHttpRequest()
    else
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");

  xmlhttp.onreadystatechange = function () {
    showAjaxData()
  }

  xmlhttp.open('GET', 'http://localhost:3000/states/', true)
  xmlhttp.send()
}

function showAjaxData()
{
    if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
        var data = JSON.parse(xmlhttp.responseText);

        var output="<table border=1>";
        output+="<tr><th></th><th>Origin</th><th>Airline</th><th>Flight</th><th>Scheduled Date</th><th>Scheduled Time</th><th>Status</th>";
        for(var i=0;i<data.arrivals.length;i++)  // for each fixture
        {
            var terminal;
            if(data.arrivals[i].terminal == "t1")
                terminal = "<img src='images/t1.jpg'/>";
            else
                terminal = "<img src='images/t2.jpg'/>";

            output += '<tr><td>'+terminal+'</td><td>'+data.arrivals[i].origin+'</td><td>'+data.arrivals[i].airline+'</td><td>'+data.arrivals[i].flight+'</td><td>'+data.arrivals[i].scheduledDate+'</td><td>'+data.arrivals[i].scheduledTime+'</td><td>'+data.arrivals[i].status+ '<input type=\'hidden\' name=\'highlight\' value=\'data.arrivals[i].highlight\'></td></tr>';
        }
        output+="</table>";

        // add output to "fixtures" div
        document.getElementById("myFlights").innerHTML=output;
    }
}
