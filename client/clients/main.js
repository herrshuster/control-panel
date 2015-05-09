Template.newClient.onRendered(function(){
	$('input[name="slug"]').prop('readonly',true);
});

Template.newClient.events({
	'keyup [name=name]': function(event,context) {
		var clientName = event.target.value
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
		return this.slug;
	},
	sites: function() {
		return Sites.find({client:this._id},{slug:1,url:1}).fetch();
	}
});
Template.clientInfo.onRendered(function(){
	// fitLiveFields(this);
	$('ul.tabs').tabs();
	// $('.tabs').pushpin({ top: 64 });
})
Template.client__person.onRendered(function(){
	// fitLiveFields(this);
	$('.collapsible').collapsible();
})
Template.clientInfo.events({
	'keydown .live-field, keyup .live-field': function(event,context) {
		// fitText(event.target);
		if((event.key == 'Enter' && event.target.type !== 'textarea')) {
			$(event.target).blur();
		} else {
			var parent = $(event.target).parents('.cp-collection').attr('id'),
					index = this.index,
					field = event.target.name,
					value = event.target.type == 'checkbox' ? $(event.target).prop('checked') : event.target.value,
					reference = 'parentIndex' in this ? parent+'.'+this.parentIndex+'.'+$(event.target).parents('section').attr('class')+'.'+index+'.'+field : parent+'.'+index+'.'+field;
			delay(function(){
				console.log('should be delaying')
				update_field('client',context.data.client._id,reference,value);
			}, 500 );
		}
	},
	'blur .live-field, change .live-field[type=checkbox]': function(event,context) {
		if($(event.target).val().length == 0)
			$(event.target).attr('size', $(event.target).attr('placeholder').length);


			var parent = $(event.target).parents('.cp-collection').attr('id'),
					index = this.index,
					field = event.target.name,
					value = event.target.type == 'checkbox' ? $(event.target).prop('checked') : event.target.value,
					reference = 'parentIndex' in this ? parent+'.'+this.parentIndex+'.'+$(event.target).parents('section').attr('class')+'.'+index+'.'+field : parent+'.'+index+'.'+field;

			update_field('client',context.data.client._id,reference,value);
			if(!$(event.target).val())
				console.log('remove it');

	},
	'click .add-item a': function(event,context) {
		var item_to_add = event.target.className.split(/\s+/)[0];
		console.log('adding item',item_to_add);
		add_to_field('client',context.data.client._id,item_to_add,function(){
			var ulToWatch = $(event.target).parents('.cp-collection').find('ul');
			ulToWatch.on('DOMNodeInserted',function(event){
				if(event.target.nodeName == 'LI') {
					$(event.target).find('.input-field:first-of-type .live-field').focus();
					ulToWatch.off('DOMNodeInserted','**');
					//needs to expand accordion by adding active, and then focus
				}
			});
		});
	},
	'click button.remove': function(event,context) {
		var parent = 'parentIndex' in this ? $(event.target).parents('.cp-collection').attr('id')+'.'+this.parentIndex+'.'+$(event.target).parents('section').attr('class') : $(event.target).parents('.cp-collection').attr('id');
		var index = getElIndex($(event.target).parents('li').get()[0]);
		setTimeout(function(){
			remove_field('client',context.data.client._id,parent,index);
		},200);
	}
});

Template.clientInfo.onDestroyed(function(){
	//clean up unused fields
})

