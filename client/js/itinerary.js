

Session.set('places', new Array());

Template.createitinerary.events({
    "keyup .search-places": function (event) {
		var searchtext = event.target.value;
		if (!searchtext) {
			$(".places ul").css("display", "none");
		} else {
			$(".places ul").css("display", "block");
		}
		Session.set("placesSearchtext", searchtext);
		var parameters = {
			term: searchtext, 
			location: 'göteborg', 
			limit: '5'
		};
		Meteor.call('searchBusiness', parameters, function(error, data) {
			//var map = Session.get('map');
			var parent = $(".foundplaces");
			parent.empty();
			$.each(data.businesses, function(idx, business) {
				Blaze.renderWithData(Template.place, {name:business.name, _id: business.id}, parent[0]);
			});
		});
    },
    "click .foundplaces li": function (event) { 
    	var placeId = $(event.currentTarget).attr('_id');
    	Meteor.call('getBusiness', encodeURIComponent(placeId), function(error, data) {
    		choosePlace(data);
    	});
      	$(".foundplaces").css("display", "none");
    },
    "click .add-btn": function(event) {
  //   	if ( $( ".add-dialogue:first" ).is( ":hidden" ) ) {
		// 	$( ".add-dialogue" ).slideToggle();
		// } else {
		// 	$( ".add-dialogue" ).animate();
		// }
		Meteor.call('showAddDialogue');
    }
});


Template.createitinerary.helpers({
	stops: function () {
		var stopslist = $(".slippylist")[0];
		if (stopslist) {
			addSlippyList(stopslist);
		}

		return Session.get('places');
	} 
});


function choosePlace(business) {
	if (business) {
		var latitude = business.location.coordinate.latitude;
		var longitude = business.location.coordinate.longitude;
		var marker = {
			latitude: latitude,
			longitude: longitude
		}
	    var place = {};
	    place.marker = marker;
	    place.business = business;
	    var places = Session.get('places');

	    places.push(place);
	    Session.set('places', places);

	    $(".foundplaces").css("display", "none");
	    Meteor.call('calcRoute');
	}
}


function addSlippyList(ol) {

	var firstEventInReorder = false;

    ol.addEventListener('slip:beforereorder', function(e){
        if (/demo-no-reorder/.test(e.target.className)) {
            e.preventDefault();
        }
        firstEventInReorder = true;
    }, false);

    ol.addEventListener('slip:beforeswipe', function(e){
        if (e.target.nodeName == 'INPUT' || /demo-no-swipe/.test(e.target.className)) {
            e.preventDefault();
        }
    }, false);

    ol.addEventListener('slip:beforewait', function(e){
        if (e.target.className.indexOf('instant') > -1) e.preventDefault();
    }, false);

    ol.addEventListener('slip:afterswipe', function(e){
        //e.target.parentNode.appendChild(e.target);

    }, false);

	ol.addEventListener('slip:swipe', function(e){
		// if (e.target.parentNode) {
		// 	e.target.parentNode.removeChild(e.target);
	 //        var places = Session.get('places');
	 //        places.splice(e.detail.originalIndex, 1);
	 //        Session.set('places', places);	
		// }
    }, false);

    ol.addEventListener('slip:reorder', function(e){
        if (firstEventInReorder) {
        	firstEventInReorder = false;
        	var places = Session.get('places');
	        var stop = places[e.detail.originalIndex];
	        var moved = places[e.detail.spliceIndex];
	        places[e.detail.originalIndex] = moved;
	        places[e.detail.spliceIndex] = stop;
	        Session.set('places', places);

	        App.Vent.trigger('createitinerary:reorder');
        }
        e.target.parentNode.insertBefore(e.target, e.detail.insertBefore);
        
        return false;
    }, false);

    ol.addEventListener('slip:afterreorder', function(e){
        alert("Hej");
    }, false);

    new Slip(ol);
	
}

Template.addplace.onRendered(function () {
  var fview = FView.from(this);
  var Transform = famous.core.Transform;
  fview.modifier.setTransform(
    Transform.translate(0,500)
  );

  Meteor.methods({
	showAddDialogue: function() {
	  fview.modifier.setTransform(
	    Transform.translate(0,0),
	    { duration : 200, curve: 'easeOut' }
	  );
	}
  });
});

Template.addplace.events({
	"submit .add-form": function() {

	}
})

