/*$(document).ready(function () {
  $.get("http://40.74.232.157/extension-details", function(data) {
    document.getElementById("container").textContent = data['name'];
    document.getElementById("container").style.color = data['color'];
  });
});*/

document.addEventListener('DOMContentLoaded', () => {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", "http://40.74.232.157/extension-details", false );
  xmlHttp.send( null );
  var json = JSON.parse(xmlHttp.responseText);
  document.getElementById("container").textContent = json.name;
  document.getElementById("container").style.color = json.color;
});