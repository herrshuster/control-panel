Template.newClient.helpers({

});
Template.newClient.onRendered(function(){
	$('input[name="slug"]').prop('readonly',true);
});
Template.newClient.events({
	"keyup [name=name]": function(event,context) {
		var clientName = event.target.value;
		clientName = clientName
						.toLowerCase()
    					.replace(/[^\w ]+/g,'')
    					.replace(/ +/g,'-');
		$("input[name='slug']").val(clientName);
		console.log(clientName);
	}
});

Template.allClients.helpers({
	clients: function(){
		return Clients.find().fetch();
	},
	clientFileUrl: function() {
		console.log(this);
		return this.slug;
	},
	sites: function() {
		return Sites.find({client:this._id}).fetch();
	}
});

Template.client__address.helpers({
	address__map: function() {
		// console.log(this);
		var addressURL = encodeURIComponent(this.street_address+" "+this.address_locality+" "+this.address_region+" "+this.postal_code);
		var mapstring = "http://maps.googleapis.com/maps/api/staticmap?center="+addressURL+"&zoom=14&size=250x100&maptype=roadmap&markers="+addressURL;
		return mapstring;
	}
});

Template.clientInfo.onRendered(function(){
	console.log('rendered');
	// console.log(this.findAll('input'));
	// $('input').attr('size',$(this).val().length);
})

Template.clientInfo.events({
	'load': function(event,context) {
		var editables = $('*[type=editable]');
		$.each(editables, function(index, val) {
			$(this).attr('size',$(this).val().length);
		});
	},
	'focus *[type=editable]': function(event,context) {
		$(event.target).removeProp('readonly');
	},
	'keydown *[type=editable]': function(event,context) {
		$(event.target).attr('size',$(event.target).val().length + 1);
	},
	'keyup *[type=editable]': function(event,context) {
		//this should wait for a pause and then save
		// console.log(event);
		$(event.target).attr('size',$(event.target).val().length);
		if(event.keyCode == 13) {
			var field = event.target.name,
					value = event.target.value;
			Meteor.call(
				'client_update_field',
				context.data.client._id,
				field,
				value,
				function(response){
					console.log(response);
					$(event.target).prop('readonly','readonly').blur();
				}
			);
		}
	},
	'blur *[type=editable]': function(event,context) {
		var field = event.target.name,
				value = event.target.value;
		Meteor.call(
			'client_update_field',
			context.data.client._id,
			field,
			value,
			function(response){
				console.log(response);
				$(event.target).prop('readonly','readonly');
			}
		);
	},
	'click .add-item': function(event,context) {
		var classes = event.target.className.split(/\s+/);
		//this only adds address because of hard-code in server/clients/main.js
		var item_to_add = classes[1];
		Meteor.call(
			'client_add_to_field',
			context.data.client._id,
			item_to_add,
			function(response) {
				console.log(response);
			}
		);
	},
	'click button.remove': function(event,context) {
		var index_to_remove = $(event.target.parentElement).attr('data-index');
		console.log(index_to_remove);
		Meteor.call(
			'client_remove_field',
			context.data.client._id,
			$(event.target.parentElement).attr('data-field'),
			index_to_remove,
			function(response) {
				console.log(response);
			}
		)
	}
});