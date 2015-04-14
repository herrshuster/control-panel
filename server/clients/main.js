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
	},
	client_add_to_field: function(client,field) {
		console.log("client",client,"field",field);
		var fieldsToInsert = Clients._c2._simpleSchema._objectKeys[field+".$."];
		var fieldToInsert = {};
		fieldToInsert[field] = {};
		for (var i = 0; i < fieldsToInsert.length; i++) {
			fieldToInsert[field][fieldsToInsert[i]] = '';
		};
		//make this only do required fields, and set the type appropriately
		console.log(fieldToInsert);
		Clients.update(
		{
			_id: client
		}, {
			$addToSet: fieldToInsert
		},function(error,id) {
			console.log('error',error,'id',id);
			return(error,id);
		}
		);
	},
	client_remove_field: function(client,field,index) {
		console.log("client",client,"field",field);
		key = field+"."+index;
		unsetObj = {};
		unsetObj[key] = 1;
		pullObj = {};
		pullObj[field] = null;
		console.log(unsetObj,pullObj);
		Clients.update(
			{
				_id: client
			}, {
				$unset: unsetObj
			}, function(error,id) {
				if(!error) {
					Clients.update(
						{
							_id: client
						}, {
							$pull: pullObj
						}, function(error,id) {
							console.log('error',error,'id',id);
							return(error,id);
						}
					);
				}
			}
		)
	}
});