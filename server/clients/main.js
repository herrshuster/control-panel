Meteor.methods({
	client_update_field: function(client,field,value) {
		console.log("client",client,"field",field,"value",value)
		obj = {};
		obj[field] = value;
		console.log(obj);
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
		//xField is the genericized version of the string to check
		xField = field.replace(/(\.[0-9]+\.)/,'.$.');
		console.log("client",client,"field",field);
		var ClientSchema = Clients._c2._simpleSchema._schema;
		if(ClientSchema[xField].type.name == 'Array') {
			//If the field is an array, it needs an object set up to set
			var fieldKeys = Object.keys(ClientSchema),
				dataToInsert = {},
				i;
			dataToInsert[field] = {};
			for (i = 0; i < fieldKeys.length; i++) {
				//For each of the possible keys in the schema
				if(fieldKeys[i].indexOf('.$.') > -1 && fieldKeys[i].indexOf(xField) == 0) {
					//Find those which are arrays (the dot after the $) that begin with the requested field
					var currentKey = ClientSchema[fieldKeys[i]];
					if(currentKey.type.name == 'String' && fieldKeys[i].replace(xField+'.$.','').indexOf('.$.') == -1) {
						//Only insert strings which are not nested
						dataToInsert[field][fieldKeys[i].replace(xField+'.$.','')] = '';	
						console.log('inserted',fieldKeys[i].replace(xField+'.$.',''),'from currentKey',currentKey);					
					} else if(currentKey.type.name == 'Boolean') {
						dataToInsert[field][fieldKeys[i].replace(xField+'.$.','')] = false;
					} else if(currentKey.type.name == 'Array') {
						//TODO: Check optional
						dataToInsert[field][fieldKeys[i].replace(xField+'.$.','')] = [];
						dataToInsert[field][fieldKeys[i].replace(xField+'.$.','')][0] = {};
						//for each of the fieldKeys, find those that begin with fieldKeys[i]
						for (var j = 0; j < fieldKeys.length; j++) {
							if(fieldKeys[j].indexOf(fieldKeys[i]+'.$.') > -1) {
								dataToInsert[field][fieldKeys[i].replace(xField+'.$.','')][0][fieldKeys[j].replace(xField+'.$.'+fieldKeys[i].replace(xField+'.$.','')+'.$.','')] = '';
							}
						};
					}
				}
			};
		} else if(ClientSchema[field].type.name == 'String') {}
		// console.log(dataToInsert);
		Clients.update(
		{
			_id: client
		}, {
			$addToSet: dataToInsert
		},function(error,id) {
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