Template.newClient.helpers({

});
Template.newClient.onRendered(function(){
	$('input[name="slug"]').prop('readonly',true);
});
Template.newClient.events({
	"keyup [name=name]": function(event,context) {
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

Template.client__address.helpers({
	address__map: function() {
		// console.log(this);
		var addressURL = encodeURIComponent(this.street_address+" "+this.address_locality+" "+this.address_region+" "+this.postal_code);
		var mapstring = "http://maps.googleapis.com/maps/api/staticmap?center="+addressURL+"&zoom=14&size=250x100&maptype=roadmap&markers="+addressURL;
		return mapstring;
	}
});

Template.clientInfo.events({
	"focus input[type=editable]": function(event,context) {
		// console.log(event);
		$(event.target).removeProp('readonly');
		// console.log("field:",event);
	},
	"keyup input[type=editable]": function(event,context) {
		var pause;
		if(event.keyCode == 13) {
			$(event.target).prop('readonly','readonly').blur();
		} else {
			// var pause;
			clearTimeout(pause);
			pause = setTimeout(function(){
				//This timeout just waits once, and then live updates instead of clearing the timeout every time
				//use setInterval to save input every second, unless hitting enter
				var field = event.target.name,
					value = event.target.value;
				Meteor.call(
					'client_update_field',
					context.data.client._id,
					field,
					value,
					function(response){
						console.log(response);
					}
				);
			},1500);
		}
		
	}
});