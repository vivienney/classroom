Seats = new Mongo.Collection('Seats');

if (Meteor.isClient) {

  Template.body.helpers({
    seats: function() {
        var seats = Seats.find({},{sort: {seatIndex: 'asc'}}).fetch();
        tables = [];
        size = 2
        while (seats.length > 0) {
            tables.push({ table: seats.slice(0, size)});
            seats = seats.slice(size);
        }
        return tables;
    },
    seatSide: function() {
        if((this.seatIndex % 2) === 0) {
          return "seat--right"
        } else {
          return "seat--left"
        }
    },
    seatEmpty: function() {
      if(this.fullName === undefined) {
        return "seat--empty"
      }
    }
  });

  Template.body.events({
    'click .table__seat': function() {
      $('.modal').addClass('modal--visible');
      Session.set('selectedSeat', this._id);
    }
  });


  Template.studentForm.helpers({
    selectedSeatData: function() {
      return Seats.findOne({_id: Session.get('selectedSeat')});
    }
  });

  Template.studentForm.events({
    "submit .addStudent": function (event) {
      event.stopPropagation();
      // This function is called when the new student form is submitted

      var fullName = event.target.fullName.value;
      var email = event.target.email.value;
      var vocation = event.target.vocation.value;
      var twitter = event.target.twitter.value;

      Seats.update(this._id, {$set: {
        fullName: fullName,
        vocation: vocation,
        email: email,
        twitter: twitter,
        createdAt: new Date() // current time
      }});

      // Clear form
      $('form.populate-table').find('input').val('');

      // Prevent default form submit
      return false;
    }
  });


  Template.modal.events({
    'click .modal': function(event) {
      event.stopPropagation();
    },
    'click .modal__overlay': function(event) {
      $('.modal').addClass('modal--closing');
      $('.modal__content').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
        $('.modal').removeClass('modal--visible modal--closing');
      });
    },
    'click .modal__content': function(event) {
      event.stopPropagation();
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    if (Seats.find().count() == 0) {
      for(var i = 13; i >= 0; i-- ) {
        Seats.insert({ seatIndex: i });
      }
    }
  });
}


/*
Seat = {
  seatId: Int,
  fullName: string,
  vocation: String,
  twitter: String,
  email: String
}
*/