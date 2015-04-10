Template.newChecklist.helpers({
	siteName: function() {
		var site = Sites.findOne({_id:this.belongs_to});
		return site.url;
	}
});
Template.newChecklistItem.helpers({
	ChecklistTypes: function() {
		var OptionsArray = [];
		for (var i = ChecklistTypes.length - 1; i >= 0; i--) {
			OptionsArray.push({label:ChecklistTypes[i].title,value:ChecklistTypes[i].slug});
			ChecklistTypes[i]
		};
		return OptionsArray;
	}
});
Template.newChecklistItem.events({
	"submit form#insertChecklistItem": function(event,context) {
		//make sure this only fires in the context of being inside a checklist
		event.preventDefault();
		console.log(context);
		var title = event.target[0].value,
			description = event.target[1].value,
			checklist_for = context.data.belongs_to;		
		ChecklistItems.insert({
			checklistType: context.data.type,
			default: false,
			revisions: [
				{
					reversion: 1,
					title: title,
					description: description
				}
			]

		},function(error,id){
			console.log(error,id);
			if(id) {
				Checklists.update(
					{_id:checklist_for},
					{$addToSet: {
						items: {
							id: id,
							events: [
								{
									date: new Date(),
									user: Meteor.user()._id,
									type: "create"
								}
							],
							title: title,
							description: description
						}
					}},
					function(error,id) {
						console.log(error,id);
						if(id) {
							$('form#insertChecklistItem').remove();
							//Also re-insert "new checklist item" link
						}
					}
				);
			}
		});
	}
});
Template.newChecklistItem.onRendered(function(){
	if(this.data.type) {
		$('select[name=checklistType] option[value='+this.data.type+']').attr('selected','selected')
	}
	console.log(this.data.type);
});
Template.newChecklist.events({
	//Items can be added and removed on this screen
	"mousedown [type=submit]": function(event,context) {
		//Move this to serverside
		Checklists.insert({
			title: this.title,
			belongs_to: this.belongs_to,
			type: this.type,
			items: this.items
		}, function(error,id){
			if(id) {
				Router.go('/checklist/'+id);
			}
			console.log(error,id);
		});
		console.log(this);
	},
});
Template.checklist.events({
	"click h2 a": function(event,context) {
		event.preventDefault();
		window.opener.location.href = event.target.href;
	},
	"click a#new_item": function(event,context) {
		Blaze.renderWithData(Template.newChecklistItem,{type:this.type,belongs_to:this._id},document.body,event.currentTarget);
		//remove this link until it is reinserted by a successful checklist item addition
	}	
})
Template.checklist.helpers({
	site: function() {
		var site = Sites.findOne({_id:this.belongs_to});
		return site;
	}
});
