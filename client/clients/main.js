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

Template.clientInfo.events({
	'keydown .editable, keyup .editable': function(event,context) {
		fitText(event.target);
		if((event.key == 'Enter' && event.target.type !== 'textarea') || event.key == 'Tab') {
			var parent = $(event.target).parents('.card').attr('id'),
					index = this.index,
					field = event.target.name,
					reference = 'parentIndex' in this ? parent+'.'+this.parentIndex+'.'+$(event.target).parents('section').attr('class')+'.'+index+'.'+field : parent+'.'+index+'.'+field,
					value = event.target.type == 'checkbox' ? $(event.target).prop('checked') : event.target.value;
					// not working to edit checkboxes?

			event.stopImmediatePropagation();

			console.log(parent,index,field,reference,value);

		}
			delay(function(){
				update_field('client',context.data.client._id,reference,value,function(){});
			}, 500 );
	},
	'blur .editable, change .editable[type=checkbox]': function(event,context) {
		// console.log('blur',event)
		if($(event.target).val().length == 0)
			$(event.target).attr('size', $(event.target).attr('placeholder').length);


			var parent = $(event.target).parents('.card').attr('id'),
					index = this.index,
					field = event.target.name,
					value = event.target.type == 'checkbox' ? $(event.target).prop('checked') : event.target.value,
					reference = 'parentIndex' in this ? parent+'.'+this.parentIndex+'.'+$(event.target).parents('section').attr('class')+'.'+index+'.'+field : parent+'.'+index+'.'+field;

			update_field('client',context.data.client._id,reference,value);
			if(!$(event.target).val())
				console.log('remove it');

	},
	'click .add-item': function(event,context) {
		var item_to_add = event.target.className.split(/\s+/)[1];
		add_to_field('client',context.data.client._id,item_to_add,function(){
			var ulToWatch = $(event.target).parents('.card').find('ul');
			ulToWatch.on('DOMNodeInserted',function(event){
				if(event.target.nodeName == 'LI') {
					$(event.target).find('input:first-of-type').focus();
					ulToWatch.off('DOMNodeInserted','**');
				}
			});
		});
	},
	'click button.remove': function(event,context) {
		console.log('event',event,'context','this',this);
		var parent = 'parentIndex' in this ? $(event.target).parents('.card').attr('id')+'.'+this.parentIndex+'.'+$(event.target).parents('section').attr('class') : $(event.target).parents('.card').attr('id'),
				index = getElIndex($(event.target).parents('li').get()[0]);
		remove_field('client',context.data.client._id,parent,index);
	}
});

Template.clientInfo.onDestroyed(function(){
	//clean up unused fields
})

