

Session.set('places', new Array());

var hideModifier = {};
var showModifier = {};
var top = function() {
	return $(".createitinerary-map").position().top + $(".createitinerary-map").height();
}

Template.itineraries.helpers({
	itineraries: function () {
	  var interests = Session.get('choseninterests');
	  var ids = [];
	  for (var i = 0; interests[i]; i++) {
	    ids.push(interests[i]._id);
	  }

	  return Itineraries.find({interests: {$in:ids}}, {});
	}
});

Template.createitinerary.events({
    "click .add-btn": function(event) {
		showAddDialogue();
    }
});

Template.createitinerary.onRendered(function() {

	var mainCtx = Engine.createContext();

	var alignOriginModifier = new StateModifier({
	  align: [0.5, 1],
	  origin: [0.5, 1]
	});
	hideModifier = new StateModifier({
	  transform: Transform.translate(0,$(window).height())
	});
	showModifier = new StateModifier();

	var surface = new Surface({
		classes: ["dialogue"],
		size: [$(window).width(), $(window).height()],
		content: ""
	});

	surface.on('deploy', function() {
		Blaze.render(Template.addplace, $(".dialogue")[0]);

	});

	mainCtx.add(alignOriginModifier).add(showModifier)
		.add(hideModifier).add(surface);

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

function showAddDialogue() {
  showModifier.setTransform(
    Transform.translate(0,-$(window).height()),
    { duration : 200, curve: 'easeOut' }
  );
}
function hideAddDialogue() {
  showModifier.setTransform(
    Transform.translate(0,$(window).height()),
    { duration : 200, curve: 'easeIn' }
  );
}

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



Template.addplace.events({
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
			limit: '3'
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
	"submit .add-form": function() {
		hideAddDialogue();
	},
	"click .close-btn": function(event) {
		event.preventDefault();
		hideAddDialogue();
    }
})

