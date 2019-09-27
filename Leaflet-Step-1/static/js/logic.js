
// Creating map object
var myMap = L.map("map", {
  center: [36.77, -119.42],
  zoom: 5
});

// Adding tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Grab the PAST DAY data with d3
d3.json(url, function(response) {
// console.log(response);
// Loop through data
  for (var i = 0; i < response.features.length; i++) {

    // Set the data location property to a variable
   var location = response.features[i].geometry;
   var fillColor ;
  
   if (response.features[i].properties.mag > 5){
     fillColor = 'black'
   } else if (response.features[i].properties.mag>3){
    fillColor = 'red'
   } else if (response.features[i].properties.mag>2){
     fillColor = 'orange'
   } else if (response.features[i].properties.mag>1){
     fillColor = 'yellow'
   } else {fillColor = 'white'};

    console.log('response.features[i]:', response.features[i]);

    L.marker([location.coordinates[1], location.coordinates[0]])
    .bindPopup("<h1>" + response.features[i].properties.title + "</h1>").addTo(myMap);

    var circle = L.circle([location.coordinates[1], location.coordinates[0]], {
      color: 'white',
      fillColor: fillColor,
      fillOpacity:0.5,
      radius:response.features[i].properties.mag*30000,
    }).addTo(myMap);
};

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (myMap) {
   var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 1, 2, 3, 5],
    labels = [];

for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  return div;
};

legend.addTo(myMap);

});

