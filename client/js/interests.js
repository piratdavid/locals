  Template.interests.rendered = function() {
    if (!mobilecheck()) {
      $(".chosen-select").chosen();
    }
  };

  Template.interests.helpers({
    interests: function () { 
      var searchtext = Session.get("searchtext");
      if (searchtext) {
        return Interests.find({text: new RegExp(searchtext)}, {});
      }
    },
    choseninterests: function () { 
      return Session.get('choseninterests');
    }
  });

  Template.interests.events({
    "submit .find-interests": function (event) {
      // This function is called when the new task form is submitted

      var text = event.target.text.value;

      Interests.insert({
        text: text,
        createdAt: new Date(),            // current time
        username: Meteor.user().username  // username of logged in user
      });

      // Clear form
      event.target.text.value = "";

      // Prevent default form submit
      return false;
    },
    "change .hide-completed input": function (event) {
      Session.set("hideCompleted", event.target.checked);
    },
    "keyup .search-interests": function (event) {
      var searchtext = event.target.value;
      if (!searchtext) {
        $(".interests ul").css("display", "none");
      } else {
        $(".interests ul").css("display", "block");
      }
      Session.set("searchtext", searchtext);
    },
    "click .interests li": function (event) {
      var checked = $(event.target).find("input").prop('checked');
      var chosen = Session.get('choseninterests');
      $(event.target).find("input").prop('checked', !checked);
      if ($(event.target).hasClass("checked")) {
        //$(event.target).removeClass("checked");
        removeFromArray(this, chosen);
        Session.set('choseninterests', chosen); 
      } else {
        //$(event.target).addClass("checked");
        if (indexInArray(this, chosen) > -1) {
          return;
        }
        chosen.push(this);
        Session.set('choseninterests', chosen);
      }
      $(".interests ul").css("display", "none");
    },
    "mousedown .foundinterests li": function (event) {
      //$(event.target).addClass("checked");
    },
    "mouseup .foundinterests li": function (event) {
      var chosen = Session.get('choseninterests');
      //$(event.target).removeClass("checked");
      if (indexInArray(this, chosen) > -1) {
        return;
      }
      chosen.push(this);
      Session.set('choseninterests', chosen);
      setTimeout(100);
      $(".interests ul").css("display", "none");
    },
    "click .choseninterests .delete": function (event) {
      var chosen = Session.get('choseninterests');
      removeFromArray(this, chosen);
      Session.set('choseninterests', chosen); 

      var checked = $(".interests li.checked");
      var i = indexInArray(this, checked);
      $(checked[i]).find("input").prop('checked', false);
      $(checked[i]).removeClass("checked");
    }
  });


  function indexInArray(doc, array) {
    var index = -1;
    $.each(array, function(idx, e) { 
      if (e && doc["_id"] == (e["_id"] ? e["_id"] : $(e).attr("_id"))) {
        index = idx;
        return false;
      }
    });
    return index;
  } 

  function removeFromArray(doc, array) {
    var i = indexInArray(doc, array);
    if (i > -1) {
      array.splice(i, 1);
    }
  }