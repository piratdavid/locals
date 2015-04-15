Template.profile.helpers({
	itineraries: function () {
	  return Itineraries.find({}, {});
	}
});