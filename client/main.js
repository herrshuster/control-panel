Template.address.helpers({
	address__map: function() {
		var addressURL = encodeURIComponent(this.street_address+" "+this.address_locality+" "+this.address_region+" "+this.postal_code);
		var mapstring = "http://maps.googleapis.com/maps/api/staticmap?center="+addressURL+"&zoom=14&size=250x100&maptype=roadmap&markers="+addressURL;
		return mapstring;
	}
});

Template.registerHelper(
	'collectionType', function() {
		// console.log(Template.parentData(2));
		if(Object.keys(Template.parentData(2))[0] == 'site') {
			return 'site';
		} else if(Object.keys(Template.parentData(2))[0] == 'client') {
			return 'client'
		}
	}
);

Template.registerHelper(
	'isPhone', (
	    (/iphone|android|ie|blackberry|fennec/).test
	     (navigator.userAgent.toLowerCase())
	     && 'ontouchstart' in document.documentElement
	  )
);


Template.phone_number.helpers({
	'mobileNumber': function() {
		console.log('this',this);
		//Not working
	}
});

Template.address.events({
	'click .add-note': function(event,context) {
		console.log(this,event,context);
		$(event.target).parent().append('<textarea class=editable name=address.'+this.index+'.note></textarea>').focus();
		$(event.target).remove();
	}
});

Template.email_address.events({
	'click .add-note': function(event,context) {
		console.log(this,event,context);
		$(event.target).parent().append('<textarea class=editable name=email_address.'+this.index+'.note></textarea>').focus();
		$(event.target).remove();
	}
});

Template.phone_number.events({
	'click .add-note': function(event,context) {
		console.log(this,event,context);
		$(event.target).parent().append('<textarea class=editable name=phone_number.'+this.index+'.note></textarea>').focus();
		$(event.target).remove();
	}
});



