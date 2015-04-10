Template.newClient.helpers({

});
Template.newClient.onRendered(function(){
	$('input[name="slug"]').prop('readonly',true);
});
Template.newClient.events({

	"keyup [name='name']": function(event,context) {
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