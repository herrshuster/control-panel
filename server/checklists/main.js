Meteor.methods({
	create_checklistItem: function(ChecklistItem,Checklist) {
		ChecklistItems.insert(
			{
				checklistType: ChecklistItem.checklistType,
				default: ChecklistItem.default,
				revisions: ChecklistItem.revisions
			},function(error,id){
				if(id) {
					Checklists.update(
						{_id:Checklist},
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
								title: ChecklistItem.revisions[0].title,
								description: ChecklistItem.revisions[0].description
							}
						}},
						function(error,id) {
							return id ? id : error;
						}
					);
				}
			}
		);
	},
	create_checklist: function(Checklist) {
		return Checklists.insert(
			{
				title: Checklist.title,
				belongs_to: Checklist.belongs_to,
				type: Checklist.type,
				items: Checklist.items
			}, function(error,id){
				console.log(error,id);
				return id ? id : error;
			}
		);
	},
	event_checklist_item: function(type,item_id,checklist_id) {
		Checklists.update(
			{
				_id: checklist_id,
				'items.id': item_id
			}, {
				$addToSet: {
					'items.$.events': {//Doesn't work because field operators like $ are not available on client side
						date: new Date(),
						user: Meteor.user()._id,
						type: type
					}
				}
			}, function(error,id) {
				if(id) {
					return id;
				} else {
					return error;
				}
			}
		);
	}
})