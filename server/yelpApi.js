
// Request API access: http://www.yelp.com/developers/getting_started/api_access

var yelp = Meteor.npmRequire("yelp").createClient({
  consumer_key: "UhEBd0igWNnMtk8z3HqUbg", 
  consumer_secret: "lHzLe5P2qEP3Ll2tDPLZ25f9jW8",
  token: "BoIuHi7ZGKSEwKKdOXAp1b5ioLjVRopQ",
  token_secret: "sX-uUv6mcMAvZMy5dZpkaKJIjjQ"
});

function searchYelpBusiness(parameters, callback) {
	yelp.search(parameters, callback);
}
function getYelpBusiness(id, callback) {
	//console.log("in wrapped with id: " + id);
	yelp.business(id, function(error, data) {
		console.log(error);
		console.log(data);
		callback(error, data);
	});
}

var wrappedYelpSearch = Meteor.wrapAsync(searchYelpBusiness);
var wrappedYelpBusiness = Meteor.wrapAsync(getYelpBusiness);

// See http://www.yelp.com/developers/documentation/v2/search_api
Meteor.methods({
   	searchBusiness: function(parameters) {
   		console.log("in search method");
		return wrappedYelpSearch(parameters);
	},
	getBusiness: function(id) {
		console.log("in get method");
		return wrappedYelpBusiness(id);
	}
});

// See http://www.yelp.com/developers/documentation/v2/business
// yelp.business("yelp-san-francisco", function(error, data) {
//   console.log(error);
//   console.log(data);
// });