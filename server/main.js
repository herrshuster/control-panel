Accounts.onCreateUser(function(options,user){
	console.log(user);
	user._id = Meteor.users._makeNewID();
	if(options.services) {
		user.services = options.services;
	}
	if(options.profile) {
		user.profile = options.profile;
		user.profile.restrictions = '0';
	}
	return user;
});

Meteor.methods({
	update_field: function(collection,document_id,field,value) {
		obj = {};
		obj[field] = value;
		// console.log(obj);
		if (collection == 'clients') {
			//Replace this if check
			var Collection = Clients;	
		} else if(collection = 'sites') {
			var Collection = Sites;
		}
		Collection.update(
		{
			_id: document_id
		}, {
			$set: obj
		}, function(error,id) {
			return(error,id);
		}
		);
	},
	add_to_field: function(collection,document_id,field) {
		//xField is the genericized version of the string to check
		xField = field.replace(/(\.[0-9]+\.)/,'.$.');
		if (collection == 'clients') {
			//Replace this if check
			var Collection = Clients;	
		} else if(collection = 'sites') {
			var Collection = Sites;
		}
		var Schema = Collection._c2._simpleSchema._schema;

		// console.log(Schema);

		function escapeRegExp(str) {
			return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
		}
		var filterPhrase = escapeRegExp(xField+'.$');
		var filter = new RegExp('^('+filterPhrase+')$');//This filter finds the top-level defininition of any field which has children, whether objects or array items
		console.log('filter',filter)
		if(Schema[xField].type.name == 'Array') {
			//If the field is an array, it needs an object set up to set
			var fieldKeys = Object.keys(Schema),
				i;
			for(i = 0; i < fieldKeys.length; i++) {
				//For each of the possible keys in the schema
				if(fieldKeys[i].match(filter)) {
					var dataToInsert = {};
					dataToInsert[field] = {};
					console.log('match',fieldKeys[i].match(filter));
					console.log('schema',fieldKeys[i],Schema[fieldKeys[i]]);
					// console.log(Schema);
					var subFields = [];
					for (var k = 0; k < fieldKeys.length; k++) {
						if(fieldKeys[k].match(new RegExp('^'+filterPhrase+'\.'))) {
							if(Schema[fieldKeys[k]].type.name == 'String') {
								dataToInsert[field][fieldKeys[k].match(new RegExp('^('+filterPhrase+'\.)(.+)'))[2]] = '';								
							}
						}
					};
					// console.log('subfields',subFields);
					var currentKey = Schema[fieldKeys[i]];
					if(currentKey.type.name == 'String' && fieldKeys[i].replace(xField+'.$.','').indexOf('.$.') == -1) {
						//Only insert strings which are not tested
						// dataToInsert[field][fieldKeys[i].replace(xField+'.$.','')] = '';
						console.log(currentKey);
						dataToInsert[field] = '';
					} else if(currentKey.type.name == 'Boolean') {
						// dataToInsert[field][fieldKeys[i].replace(xField+'.$.','')] = false;
					} else if(currentKey.type.name == 'Array') {
						//TODO: check optional
						// dataToInsert[field][fieldKeys[i].replace(xField+'.$.','')] = [];
						// dataToInsert[field][fieldKeys[i].replace(xField+'.$.','')][0] = {};
						//for each of the fieldKeys, find those that begin with fieldKeys[i]
						// for (var j = 0; j < fieldKeys.length; j++) {
							// if(fieldKeys[j].indexOf(fieldKeys[i]+'.$.') > -1) {
								// dataToInsert[field][fieldKeys[i].replace(xField+'.$.','')][0][fieldKeys[j].replace(xField+'.$.'+fieldKeys[i].replace(xField+'.$.','')+'.$.','')] = '';
							// }
						// };
					}
				}
			};
		}
		console.log('add_to_field dataToInsert',dataToInsert);
		Collection.update(
		{
			_id: document_id
		}, {
			$addToSet: dataToInsert
		}, function(error,id) {
			console.log(error,id);
			return (error,id);
		}
		);
	},
	remove_field: function(collection,document_id,field,index) {
		if (collection == 'clients') {
			//Replace this if check
			var Collection = Clients;	
		} else if(collection = 'sites') {
			var Collection = Sites;
		}
		console.log('collection',collection,'document_id',document_id,'field',field,'index',index);
		key = field+"."+index;
		unsetObj = {};
		unsetObj[key] = 1;
		pullObj = {};
		pullObj[field] = null;
		console.log(unsetObj,pullObj);
		Collection.update(
			{
				_id: document_id
			}, {
				$unset: unsetObj
			}, function(error,id) {
				console.log(error,id);
				if(!error) {
					Collection.update(
						{
							_id: document_id
						}, {
							$pull: pullObj
						}, function(error,id) {
							console.log(error,id);
							if(!error) {
								return id;
							} else {
								throw error;
							}
							console.log('error',error,'id',id);
						}
					);
				}
			}
		)
	}
})