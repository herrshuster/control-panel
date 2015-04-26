Template.newClient.helpers({

});
Template.newClient.onRendered(function(){
	$('input[name="slug"]').prop('readonly',true);
});
Template.newClient.events({
	'keyup [name=name]': function(event,context) {
		var clientName = event.target.value;
		clientName = clientName
						.toLowerCase()
    					.replace(/[^\w ]+/g,'')
    					.replace(/ +/g,'-');
		$(".slug").val(clientName);
	},
	'submit form': function(event,context) {
		event.preventDefault();

		var name = $('[name=name]').val(),
			slug = $('.slug').val(),
			referral = $('[name=referral]').val();

		Meteor.call(
			'client_create',
			{
				name: name,
				slug: slug,
				referral: referral,
			},
			function(error,response) {
				if(!error) {
					Router.go('/client/'+slug);
				}
			}
		);
	}
});


Template.allClients.helpers({
	clients: function(){
		return Clients.find({},{name:1,sites:1}).fetch();
	},
	clientFileUrl: function() {
		// console.log(this);
		return this.slug;
	},
	sites: function() {
		return Sites.find({client:this._id},{slug:1,url:1}).fetch();
	}
});

Template.clientInfo.events({
	'keydown .editable, keyup .editable': function(event,context) {
		fitText(event.target);
		//this should wait for a pause and then save
		if(event.keyCode == 13) {
			event.stopImmediatePropagation();
			//Allow for new lines in textareas
			Meteor.call(
				'update_field',
				'clients',
				context.data.client._id,
				event.target.name,
				event.target.value,
				function(error,response){
					if(!error){
						$(event.target).blur();
					}
				}
			);
		}
	},
	'onblur .editable': function(event,context) {
		if($(event.target).val().length == 0) {
			$(event.target).attr('size',$(event.target).attr('placeholder').length);
		}

		var field = event.target.name;
		if($(event.target).attr('type') == 'checkbox') {
			var value = $(event.target).prop('checked');
		} else {
			value = event.target.value;
		}
		Meteor.call(
			'update_field',
			'clients',
			context.data.client._id,
			field,
			value,
			function(error,response){
				if(!error) {
					// $(event.target).prop('readonly','readonly');
				}
			}
		);
		if(!$(event.target).val()) {
			console.log('remove it');
		}
	},
	'click .add-item': function(event,context) {
		//TODO: Remove empty fields
		var classes = event.target.className.split(/\s+/);
		var item_to_add = classes[1];
		Meteor.call(
			'add_to_field',
			'clients',
			context.data.client._id,
			item_to_add,
			function(error, response) {
				console.log(error,response);
			}
		);
	},
	'click button.remove': function(event,context) {
		var index_to_remove = $(event.target.parentElement).attr('data-index');
		Meteor.call(
			'remove_field',
			'clients',
			context.data.client._id,
			$(event.target.parentElement).attr('data-field'),
			index_to_remove,
			function(error,response) {
				console.log(error,response);
			}
		)
	}
});

