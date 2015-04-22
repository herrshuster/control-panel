Meteor.methods({
	site_create: function(site) {
		Sites.insert(site, function(error,id){
			console.log(error,id);
			return [error,id];
		});
	}
})