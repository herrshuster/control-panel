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
		console.log(siteUrl);
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
		// console.log(this);
		var checklistType = $('#newChecklist').find('option:selected').val();
		console.log(checklistType);
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
		console.log(client);
		return client.slug;
	}
});