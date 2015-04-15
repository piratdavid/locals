  Router.configure({
    layoutTemplate: 'layout'
  });

  // Router.route('/', function () {
  //   this.render('interests', {
  //     data: function () { return Interests.find({}); }
  //   });
  // });


  Router.map(function() {
  	this.route('interests', {path: '/'}),
    this.route('layout', {path: '/layout'}),
  	this.route('guides', {path: '/guides'}),
    this.route('itineraries', {path: '/itineraries'})
    this.route('createitinerary', {path: '/createitinerary'})
    this.route('searchplace', {path: '/createitinerary/searchplace'})
  });

  Router.route('guides/:_id', function () {
    this.render('profile', {
      data: function () {
        return Guides.findOne({_id: this.params._id});
      }
    });
  });

  Router.route('itineraries/:_id', function () {
    this.render('itinerary', {
      data: function () {
        return Itineraries.findOne({_id: this.params._id});
      }
    });
  });

