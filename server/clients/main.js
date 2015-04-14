Meteor.methods({
	client_update_field: function(client,field,value) {
		console.log("client",client,"field",field,"value",value)
		obj = {};
		obj[field] = value;
		Clients.update(
		{
			_id: client
		},{
			$set: obj
		},function(error,id){
			return(error,id);
		});
	}
})