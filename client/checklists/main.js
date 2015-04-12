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
		var ChecklistItem = {
			checklistType: context.data.type,
			default: false,
			revisions: [
				{
					reversion: 1,
					title: event.target[0].value,
					description: event.target[1].value
				}
			]
		};
		Meteor.call(
			'create_checklistItem',
			ChecklistItem,
			context.data.belongs_to,
			function(response){
				$('form#insertChecklistItem').remove();
				//Also re-insert "new checklist item" link
			}
		);
	}
});
Template.newChecklistItem.onRendered(function(){
	if(this.data.type) {
		$('select[name=checklistType] option[value='+this.data.type+']').attr('selected','selected')
	}
});
Template.newChecklist.events({
	//Items can be added and removed on this screen
	"mousedown [type=submit]": function(event,context) {
		var Checklist = {
			title: this.title,
			belongs_to: this.belongs_to,
			type: this.type,
			items: this.items
		};
		Meteor.call(
			'create_checklist',
			Checklist,
			function(response){
				console.log(response);//returns undefined
			}
		);
	},
});
Template.checklist.events({
	"click h2 a": function(event,context) {
		event.preventDefault();
		window.opener.location.href = event.target.href;
	},
	"click a#new_item": function(event,context) {
		Blaze.renderWithData(
			Template.newChecklistItem,
			{
				type:this.type,
				belongs_to:this._id
			},
			document.body,
			event.currentTarget
		);
		//remove this link until it is reinserted by a successful checklist item addition
	},
	"click .checklistItem input[type=checkbox]": function(event,context) {
		var item_id = this.id,
			checklist_id = context.data._id,
			eventType;
		var checklist = Checklists.findOne({_id:checklist_id});
		if(event.target.checked) {
			eventType = 'check';
		} else {
			eventType = 'uncheck';
		}
		Meteor.call(
			'event_checklist_item',
			eventType,
			item_id,
			checklist_id,
			function(response) {
				console.log(response)
			}
		);
	}
})
Template.checklist.helpers({
	site: function() {
		var site = Sites.findOne({_id:this.belongs_to});
		return site;
	},
	isChecked: function() {
		var checkedState = "";
		for (var i = 0; i < this.events.length; i++) {
			if(this.events[i].type == 'check' || this.events[i].type == 'uncheck') {
				checkedState = this.events[i].type;
			}
		};
		if(checkedState == 'check') {
			return 'checked';
		};
	}
});
