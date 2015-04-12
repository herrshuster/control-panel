Template.newSite.helpers({
	allClients: function(){
		return Clients.find().map(function(client){
			return {label: client.name, value: client._id};
		});
	},
	siteSlug: function() {
		console.log(this);
		return "butts";
	}
});
Template.newSite.onRendered(function(){
	$('input[name="slug"]').prop('readonly',true);
	//change this to a live-updaing field instead of an input, which is insecure
});
AutoForm.addHooks(
	'add_site',
	{	
		beginSubmit: function() {
			//Add site variable to retrieve when Router.go
		},
		endSubmit: function() {

			// Router.go('/site/'+)
		}
	}
);
Template.newSite.events({
	"keyup [name='url']": function(event,context) {
		var siteUrl = event.target.value;
		siteUrl = siteUrl
						.toLowerCase()
    					.replace(/[^\w ]+/g,'-')
    					.replace(/ +/g,'-');
		$("input[name='slug']").val(siteUrl);
	}
});

Template.site.events({
	"change #newChecklist": function(event,context) {
		window.open(Router.url('checklist.new',{},{query:'site='+this.site.slug+'&type='+event.target.value}),'New Checklist','height=600,width=500,scrollbars=yes');
	},
	"click #checklists a": function(event,context) {
		event.preventDefault();
		window.open(event.target.href,'Checklist','height=600,width=500,scrollbars=yes')
	}
});
Template.site.helpers({
	checklistOptions: function() {
		return {
			ownerId: this._id,
			type: 'reactive to select box in new checklist link'
		}
	},
	checklistQuery: function() {
		var checklistType = $('#newChecklist').find('option:selected').val();
		var site = this.site.slug,
			type = 'sweep';
		return "site="+site+"&type="+type;
	},
	checklistTypes: function() {
		var options = "<option value='' selected>Select Type</option>";
		for (var i = ChecklistTypes.length - 1; i >= 0; i--) {
			options = options + "<option value="+ChecklistTypes[i].slug+">"+ChecklistTypes[i].title+"</option>";
		};

		return "<select id='newChecklist'>"+options+"</select>";
	},
	itemsChecked: function() {
		var checkedItems = 0;
		for (var i = 0; i < this.items.length; i++) {
			var checkedState = "";
			for (var j = 0; j < this.items[i].events.length; j++) {
				if(this.items[i].events[j].type == 'check' || this.items[i].events[j].type == 'uncheck') {
					checkedState = this.items[i].events[j].type;
				}
			};
			if(checkedState == 'check') {
				checkedItems++;
			}
		};
		return checkedItems;
	},
	itemsCount: function(){
		return this.items.length;
	}
});

Template.allSites.helpers({
	sites: function(){
		return Sites.find().fetch();
	},
	clientName: function(){
		var client = Clients.findOne({_id:this.client});
		return client.name;
	},
	clientSlug: function(){
		var client = Clients.findOne({_id:this.client});
		return client.slug;
	}
});