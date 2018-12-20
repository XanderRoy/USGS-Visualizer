//getting most recent data from USGS
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0" +
    "/summary/all_week.geojson"

// d3.json(url, markEvents(data.features));
d3.json(url).then(function(data){

    markEvents(data.features)
});

//Setting Map to Global
var EarthQuakeMap = null

function Intensity (magnitude) {
    if (magnitude >= 6) {
        color = "red"
    } else if(magnitude >= 4) {
        color = "orange"
    } else if (magnitude >= 2) {
        color = "yellow"
    } else {
        color = "green"
    };
    return color;
    }




function MapIt(events) {

    //Our BaseLayer
    var basemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    })


    
    // Our Map Object
    var EarthQuakeMap = L.map("mapBox", {
        center: [40.00, -100.00],
        zoom: 5,
        //We will build event layer below
        layers: [basemap, events]
        }
    );

    var baseMaps = {
        "Dark Map": basemap
      };
    

    //SET UP CONTROL BOX
    var EventOverlay = {


        Events: events
    };
    
    L.control.layers(baseMaps, EventOverlay, {
    collapsed: false
    }).addTo(EarthQuakeMap);


    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "legend");
      //Add min & max
      div.innerHTML = "<h3>Magnitude</h3>" +
        "<span class=1'> <2</span><hr>"+
        "<span class='2'> 2-4</span><hr>"+
        "<span class='3'> 4-6</span><hr>"+
        "<span class='4'> >=6</span><hr>"+
        "</div>"; 
    

    
      return div;
    };
    
    // Adding legend to the map
    legend.addTo(EarthQuakeMap);



};


//Function to Create Markers and Circles for Each Event

function markEvents(data) {


    function bindPopups (feature, layer) {

        layer.bindPopup("<h3>" + feature.properties.place +  "</h3><hr>"  + 
       "<p>Magnitude: " + feature.properties.mag + "</p>"
        )
      };


    var events = L.geoJSON(data, {
        //For each event, we need popups and circles
        onEachFeature: bindPopups,

            //geojson circles are not supported, so we bind circles to points
            pointToLayer: function (feature) {

                return L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
                    color: '',
                    fillColor: Intensity(feature.properties.mag),
                    fillOpacity: 0.5,
                    radius: feature.properties.mag * 50000
                });
        }
    });


    MapIt(events);



};


