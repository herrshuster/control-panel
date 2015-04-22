Template.user.events({
    'change input[name=restrictions]': function(event,context) {
        var value = $(event.target).val();
        Meteor.call(
            'change_restrictions',
            Meteor.user()._id,
            context.data._id,
            value,
            function(error,response){
                console.log(error,response);
                $(event.target).val(Meteor.user().profile.restrictions);
                if(response) {
                    //Play failure sound
                } else {
                    //play success sound
                }
                //need to get success or failure back so can either do nothing, or reset the range slider
            }
        );
    }
});
Template.allUsers.helpers({
    isCurrentUser: function() {
        if(this._id == Meteor.user()._id) {
            return true;
        } else {
            return false;
        }
    }
})