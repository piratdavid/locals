Meteor.startup(function() {  
  GoogleMaps.load();
});

Template.map.helpers({  
  mapOptions: function() {
    if (GoogleMaps.loaded()) {
      return {
        center: new google.maps.LatLng(57.6988852,11.951107),
        zoom: 15,
        zoomControl: false,
        mapTypeControl: false,
        panControl: false,
        streetViewControl: false
      };
    }
  }
});


Template.map.onCreated(function() {  
  GoogleMaps.ready('map', function(map) {
    var directionsDisplay = new google.maps.DirectionsRenderer();
	var directionsService = new google.maps.DirectionsService();
	App.gMap = map;
	directionsDisplay.setMap(map.instance);
	App.directionsDisplay = directionsDisplay;
	App.directionsService = directionsService;
  });
});

Meteor.methods({
	calcRoute: function() {
		var directionsService = App.directionsService;
		var directionsDisplay = App.directionsDisplay;
		var start;
		var end;
        var waypoints = new Array();
        var places = Session.get('places');
        if (places.length == 1) {
        	marker = createMarker(places[0]);
        	marker.setMap(App.gMap.instance);
        	App.gMap.instance.panTo(marker.position);
        	App.firstMarker = marker;
        	return;
        } else if (places.length == 2) {
        	App.firstMarker.setMap(null);
        }
		$.each(places, function(idx, place) {
			marker = createMarker(place);
			if (idx == 0) {
				start = marker.position;
			} else if (places[idx+1] == undefined) {
				end = marker.position;
			} else {
				waypoints.push({
		            location: marker.position,
		            stopover: true
		        });
			}
		});		
		if (start && end) {
			var request = {
				origin: start,
				waypoints: waypoints,
				destination: end,
				travelMode: google.maps.TravelMode.WALKING
			};	
			directionsService.route(request, function(result, status) {
				if (status == google.maps.DirectionsStatus.OK) {
				  	directionsDisplay.setDirections(result);
				}
			});
		}
	}
});

function createMarker(place) {
	var latitude = place.marker.latitude;
	var longitude = place.marker.longitude;
	var myLatlng = new google.maps.LatLng(latitude,longitude);
	var marker = new google.maps.Marker({
        position: myLatlng,
        title: place.business.name
    });
    return marker;
}
