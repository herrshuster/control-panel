Meteor.subscribe('clients');
Meteor.subscribe('sites');
Meteor.subscribe('checklists');
Meteor.subscribe('checklistItems');

var lastScrollTop = 0;
$(window).scroll(function(){

	var currentScrollTop = $(this).scrollTop(),
		navTop = $('body>nav').position().top,
		navHeight = $('body>nav').outerHeight(true),
		bottomOfNav = navTop + navHeight;

	console.log('navTop',navTop,'navHeight',navHeight)

	if(currentScrollTop > lastScrollTop) {
		if(bottomOfNav > 0) {
			$('body>nav').css('top',navTop - (navHeight / 8));
		}
	} else {
		if(bottomOfNav < navHeight) {
			$('body>nav').css('top',navTop + (navHeight / 16));
		}
	}

	lastScrollTop = currentScrollTop;
});

$.fn.textWidth = function(text, font) {
	if (!$.fn.textWidth.fakeEl) $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body);
	$.fn.textWidth.fakeEl.text(text || this.val() || this.text()).css('font', font || this.css('font'));
	return $.fn.textWidth.fakeEl.width();
};

Template.body_nav.helpers({
	allClients: function() {
		return Clients.find({},{slug:1,name:1}).fetch();
	},
	allSites: function() {
		return Sites.find({},{slug:1,url:1}).fetch();
	}
});

Template.body_nav.events({
	'change select': function(event,context) {
		Router.go(event.target.value);
	}
})

Template.address.helpers({
	address__map: function() {
		var addressURL = encodeURIComponent(this.street_address+" "+this.address_locality+" "+this.address_region+" "+this.postal_code);
		var mapstring = "http://maps.googleapis.com/maps/api/staticmap?center="+addressURL+"&zoom=14&size=500x350&maptype=roadmap&markers="+addressURL;
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

Template.registerHelper(
	'bodyScroll', function(event) {
		console.log('event',event,'this',this);
	}
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






