toTitleCase = function (str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}


Router.onBeforeAction(function () {
  if (!Meteor.userId()) {
    this.render('login');
  } else {
    this.next();
  }
});

Router.route('/', function(){
	this.render('home');
});


Router.route('/site/new', function() {
	this.render('newSite');
},{
	name: 'site.new'
});

Router.route('/sites', function(){
	this.render('allSites');
},{
	name: 'site.all'
});

Router.route('/site/:_slug', function(){
	this.render(
		'site',
		{
			data: function(){
				_slug = this.params._slug;

				var site = Sites.findOne({
					slug: _slug
				});

				if(site) {
					var client = Clients.findOne({
						_id: site.client
					});


					if(!client) {
						var client = {
							name: "No associated client"
						};
					};

					var checklists = Checklists.find({belongs_to:site._id}).fetch();
					console.log(checklists);
					if(!checklists) {
						var checklists = [{
							title: "No checklists"
						}];
					};

					return {
						site: site,
						client: client,
						checklists: checklists
					};
				} else {
					console.log('Site not found');
				}		
			}
		}
	);
}, {
	name: 'site.show'
});

Router.route('/client/new', function(){
	this.render('newClient');
},{
	name: 'client.new'
})

Router.route('/clients', function(){
	this.render('allClients');
},{
	name: 'client.all'
})

Router.route('/client/:_slug', function(){
	this.render(
		'clientInfo',
		{
			data: function(){
				_slug = this.params._slug;
				var client = Clients.findOne({
					slug: _slug
				});

				if(client) {
					var sites = Sites.find({client:client._id}).fetch();
					console.log(client,sites);
					return {
						client: client,
						sites: sites
					};
				} else {
					console.log('Client not found');
				}		
			}
		}
	);
}, {
	name: 'client.show'
});


Router.route('/checklist/new', {
	data: function() {
		if(this.params.query.site) {
			var site = Sites.findOne({slug:this.params.query.site});
		}
		if(this.params.query.type) {
			var type = this.params.query.type;
		}
		
		latestRevisions = [];
		//Get all default items of the requested checklist type
		var items = ChecklistItems.find({checklistType:type,default:true}).fetch();
		//loop through items and build a new checklist 
		for (var i = items.length - 1; i >= 0; i--) {
			var latestRevision = items[i].revisions[items[i].revisions.length -1];
			latestRevisions.push({
				id: items[i]._id,//ID of checklist item for reference later
				events: [{
					date: new Date(),
					type: 'create',
					user: Meteor.user()._id,
				}],
				title: latestRevision.title,
				description: latestRevision.description
			});
		};
		console.log('revisions',latestRevisions);
	

		return {
			title: "Checklist",
			belongs_to: site._id,
			type: type,
			items: latestRevisions
		}
	},
	action: function() {
		// I think it would be better to build up all the information and then pass that into the newChecklist template, then use the Template.newChecklist.rendered function to instantiate/insert the new checklist and redirect
		this.render('newChecklist');
	},
	name: 'checklist.new'
	
});

Router.route('/checklist/:_id', function(){
	this.render(
		'checklist',
		{
			data: function(){
				var checklist = Checklists.findOne({_id:this.params._id});

				console.log(checklist);

				return checklist;
			}
		}
	);
}, {
	name: 'checklist.show'
});

Router.route('/checklistitem/new', function() {
	this.render(
		'newChecklistItem',
		{
			data: function() {
				console.log(this);
				//add a check so if query is not set, is automatically default
				return {
					type: this.params.query.type
				}
			}
		}
	);
},{
	name: 'checklistitem.new'
});

Router.route('/user/:_id', function(){
	this.render(
		'user',
		{
			data: function(){
				var user = Meteor.users.findOne({_id:this.params._id});

				// console.log(user);

				return user;
			}
		}
	);
}, {
	name: 'user.show'
});

Router.route('/users/', function(){
	this.render(
		'allUsers',
		{
			data: function(){
				var users = Meteor.users.find().fetch();

				// console.log(users);

				return {
					users: users
				};
			}
		}
	);
}, {
	name: 'user.all'
});

