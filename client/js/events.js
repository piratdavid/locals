
Meteor.methods({
	initEventsAggregator: function() {
 
		App.Vent = new Backbone.Wreqr.EventAggregator();

		App.Vent.on('createitinerary:reorder', function(e) {
			Meteor.call('calcRoute');
		});

		App.Vent.on('createitinerary:chooseplace', function(data) {
			Meteor.call('choosePlace', data);
		});
	}	
});
