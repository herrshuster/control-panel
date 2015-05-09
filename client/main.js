Meteor.subscribe('clients');
Meteor.subscribe('sites');
Meteor.subscribe('checklists');
Meteor.subscribe('checklistItems');

var lastScrollTop = 0,
	currentScrollTop,
	navTop,
	navHeight,
	bottomOfNav;

// $(window).scroll(function(){

// 	currentScrollTop = $(this).scrollTop();
// 	navTop = $('body>nav').position().top;
// 	navHeight = $('body>nav').outerHeight(true);
// 	bottomOfNav = navTop + navHeight;

// 	if(currentScrollTop > lastScrollTop && bottomOfNav > 0) {
// 		$('body>nav').css('top',navTop - (navHeight / 8));
// 		//scrolling down, keep these from overstepping their bounds
// 	} else if(bottomOfNav < navHeight){
// 		$('body>nav').css('top',navTop + (navHeight / 16));
// 	}

// 	lastScrollTop = currentScrollTop;
// });

fitText = function(element) {
	if(!$(element).is('textarea')) {
		var text = element.value.length > 0 ? element.value : element.placeholder,
				font = $(element).css('font-size') + " " + $(element).css('font-family');

		$(element).width($(element).textWidth(text,font) + 8);
	}
}

$.fn.textWidth = function(text, font) {
	if (!$.fn.textWidth.fakeEl) $.fn.textWidth.fakeEl = $('<span>').appendTo(document.body);
	var htmlText = text || this.val() || this.text();
	htmlText = $.fn.textWidth.fakeEl.text(htmlText).html(); //encode to Html
	htmlText = htmlText.replace(/\s/g, "&nbsp;"); //replace trailing and leading spaces
	$.fn.textWidth.fakeEl.html(htmlText).css('font', font || this.css('font'));
	return $.fn.textWidth.fakeEl.width();
};

Template.body_nav.onRendered(function(){

    $(".button-collapse").sideNav();

})

Template.body_nav.helpers({
	allClients: function() {
		return Clients.find({},{slug:1,name:1}).fetch();
	},
	allSites: function() {
		return Sites.find({},{slug:1,url:1}).fetch();
	},
	documentName: function() {
		return Session.get('documentName');
	}
});

Template.body_nav.events({
	'change select': function(event,context) {
		Router.go(event.target.value);
	}
})


Template.registerHelper(
	'isPhone', (
	    (/iphone|android|ie|blackberry|fennec/).test
	     (navigator.userAgent.toLowerCase())
	     && 'ontouchstart' in document.documentElement
	  )
);

Template.registerHelper(
	'bodyScroll', function(event) {
		// console.log('event',event,'this',this);
	}
);


Template.phone_number.helpers({
	'mobileNumber': function() {
		return this.number.replace(/[^\d.]/g, "");
	}
});

fitLiveFields = function(template) {
	$.each(template.findAll('.live-field'),function(i,el) {
		fitText(el);
	});
}

appendNote = function(event,context) {
	$(event.target).parent('.card').find('.card-content .col:last-of-type').show().find('textarea').focus();
	$(event.target).remove();
}

delay = (function(){
	var timer = 0;
	return function(callback, ms){
		clearTimeout (timer);
		timer = setTimeout(callback, ms);
	};
})();

Template.address.onRendered(function(){
	$(this.firstNode).before('<button class="remove btn-flat waves-effect waves-red"><i class="mdi-content-clear"></i></button>');
	// var addressURL = encodeURIComponent(this.data.street_address+" "+this.data.address_locality+" "+this.data.address_region+" "+this.data.postal_code),
	// 		mapstring = "http://maps.googleapis.com/maps/api/staticmap?center="+addressURL+"&zoom=14&size=500x350&maptype=roadmap&markers="+addressURL;
	// $(this.firstNode).css('background-image','url('+mapstring+')');
	// fitLiveFields(this);
	$('.collapsible').collapsible();
});

Template.address.helpers({
	'addressURL': function() {
		// console.log('map',this);
		return encodeURIComponent(this.street_address+" "+this.address_locality+" "+this.address_region+" "+this.postal_code);
	}
})

Template.address.events({
	'click .add-note': function(event,context) {
		appendNote(event,context);
	}
	//change map background when address is changed
});

Template.email_address.onRendered(function(){
	$(this.firstNode).before('<button class="remove btn-flat waves-effect waves-red"><i class="mdi-content-clear"></i></button>');
	// fitLiveFields(this);
	$('.collapsible').collapsible();
});

Template.email_address.events({
	'click .add-note': function(event,context) {
		appendNote(event,context);
	}
});

Template.phone_number.onRendered(function(){
	$(this.firstNode).before('<button class="remove btn-flat waves-effect waves-red"><i class="mdi-content-clear"></i></button>');
	// fitLiveFields(this);
	$('.collapsible').collapsible();
});

Template.phone_number.events({
	'click .add-note': function(event,context) {
		appendNote(event,context);
	}
});

getElIndex = function(el) {
    var k = 0;
		while(el.previousElementSibling){
				k++;
				el = el.previousElementSibling;
		}
		return k;
}




update_field = function(collection,document_id,field,value) {
	Meteor.call(
		'update_field',
		collection,
		document_id,
		field,
		value
	);
}

remove_field = function(collection,document_id,field,index) {
	Meteor.call(
		'remove_field',
		collection,
		document_id,
		field,
		index,
		function(error,response) {
			console.log(error,response);
		}
	);
}

add_to_field = function(collection,document_id,field,callback) {
	Meteor.call(
		'add_to_field',
		collection,
		document_id,
		field,
		function(error, response) {
			if(!error)
				callback();
		}
	);
}





