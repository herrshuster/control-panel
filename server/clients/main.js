Meteor.methods({
	client_create: function(client) {
		Clients.insert(client, function(error,id){
			console.log(error,id);
			return [error,id];
		});
	}
});