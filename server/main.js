Meteor.publish('clients',function(){
	return Clients.find({});
});

Meteor.publish('sites',function(){
	return Sites.find({});
});

Meteor.publish('checklists',function(){
	return Checklists.find({});
});

Meteor.publish('checklistItems',function(){
	return ChecklistItems.find({});
});

Meteor.publish('userGroups',function(){
	return UserGroups.find({});
});

capitalize = function(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

nameToCollection = function(name) {
  return this[capitalize(name) + 's'];
};

Accounts.onCreateUser(function(options,user){
	console.log(user);

	user._id = Meteor.users._makeNewID();

	if(options.services)
		user.services = options.services;

	if(options.profile)
		user.profile = options.profile;
		// user.profile.groups = [AllUsersGroupID];

	return user;
});

Meteor.methods({
	update_field: function(collection,document_id,field,value) {
		console.log('update_field called',field,value);
		obj = {};
		obj[field] = value;
		console.log(obj);
		var Collection = nameToCollection(collection);
		return Collection.update({_id: document_id}, {$set: obj}, function(error,id) {
			console.log(error,id);
			if(!error) {
				return id;
			}
		});
	},
	add_to_field: function(collection,document_id,field) {
		console.log('add_to_field called',field)
		function escapeRegExp(str) {
			return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
		}
		var indexRegex = /\.([0-9]+)\./, //matches .X., and returns X
				fieldIndex = field.match(indexRegex) ? field.match(indexRegex)[1] : null,//sets fieldIndex to X or null
				xField = field.replace(indexRegex,'.$.'),//genericizes field for matching
				Collection = nameToCollection(collection),
				schema = Collection._c2._simpleSchema._schema,
				objectToInsert= {};
			var Schema = [];
			_.map(schema, function(value,key){
				var newObject = {};
				newObject[key] = value;
				Schema.push(newObject);
			});
			// console.log('schema',Schema);
			Array.prototype.forEach.call(Schema, function(schemoid, i){//loop through all the schema field definitions, calling them 'schemoids'
				if(schemoid[xField]) {//if a schemoid matches the field we are looking for,
					var fieldToMatch = '';
					var fieldToAppend = '';
					var schemaKey = '';
					for(var key in schemoid) {
						fieldToMatch = '^('+escapeRegExp(key+'.$.')+')(.+)';
						schemaKey = key;//schemakey is the unindexed key
						fieldToAppend = fieldIndex ? key.replace(/\.\$\./,'.'+fieldIndex+'.') : key;//fieldtoAppend is the indexed key
					}
					fieldToMatch = new RegExp(fieldToMatch);
					var fieldsToInsert = [];

					Array.prototype.forEach.call(Schema, function(nestedSchemoid,i){
						for (var i in nestedSchemoid) {
							var matches = i.match(fieldToMatch);
							if(matches) {
								var nestedField = matches[2];
								var nestedSchemoids = {};
								fieldsToInsert.push(matches[2]);
							}
						  break;
						}
					});

					//if not matches, it's just an array at top-level
					console.log('inserting',fieldsToInsert);

					if(fieldsToInsert.length == 0) {
						objectToInsert[fieldToAppend] = '';
					} else {
						objectToInsert[fieldToAppend] = {};
					}

					Array.prototype.forEach.call(fieldsToInsert,function(nestedField,i) {
						var fieldSchema = schema[schemaKey+'.$.'+nestedField];
						if(fieldSchema.type.name == 'String' && !fieldSchema.optional) {
							if(!nestedField.match(/\.\$\./)) {
								objectToInsert[fieldToAppend][nestedField] = '';
							}
						} else if(fieldSchema.type.name == 'Boolean' && !fieldSchema.optional) {
							objectToInsert[fieldToAppend][nestedField] = false;
						} else if(fieldSchema.type.name == 'Array' && !fieldSchema.optional) {
							objectToInsert[fieldToAppend][nestedField] = [];
							objectToInsert[fieldToAppend][nestedField][0] = {};
							Array.prototype.forEach.call(fieldsToInsert,function(fieldToCheck,i){
								var fieldMatches = fieldToCheck.match(/\.\$\.([a-zA-Z0-9_]+)/);
								if(fieldMatches) {
									objectToInsert[fieldToAppend][nestedField][0][fieldMatches[1]] = '';
								}
							})
						}
					})
				}
			});
			console.log('prepare for insertion',objectToInsert);
			Collection.update({_id: document_id}, {$addToSet: objectToInsert}, function(error,id) {
				console.log(error,id);
			});

	},
	remove_field: function(collection,document_id,field,index) {
		var Collection = nameToCollection(collection);
		console.log('collection',collection,'document_id',document_id,'field',field,'index',index);
		key = field+"."+index;
		unsetObj = {};
		unsetObj[key] = 1;
		pullObj = {};
		pullObj[field] = null;
		console.log(unsetObj,pullObj);
		Collection.update({_id: document_id}, {$unset: unsetObj}, function(error,id) {
				console.log(error,id);
				if(!error) {
					Collection.update({_id: document_id}, {$pull: pullObj}, function(error,id) {
							console.log('error',error,'id',id);
							return error ? error : id;
						}
					);
				}
			}
		)
	}
});

