Template.newSite.helpers({
	allClients: function(){
		return Clients.find().map(function(client){
			return {label: client.name, value: client._id};
		});
	},
	statusOptions: function() {
		var SiteSchema = Sites._c2._simpleSchema._schema;
		return SiteSchema.status.allowedValues.map(function(status){
			return {label: toTitleCase(status), value: status}
		});
	}
});
Template.newSite.onRendered(function(){
	$('input[name="slug"]').prop('readonly',true);
	//change this to a live-updaing field instead of an input, which is insecure
});

Template.newSite.events({
	"keyup [name='url']": function(event,context) {
		var siteUrl = event.target.value;
		siteUrl = siteUrl
						.toLowerCase()
    					.replace(/[^\w ]+/g,'-')
    					.replace(/ +/g,'-');
		$("input[name='slug']").val(siteUrl);
	},
	'submit form': function(event,context) {
		event.preventDefault();
		function isValidUrl(url) {
			//validate against RegEx.Domain
			return true;
		}
		var client = $('[name=client]').val(),
			url = $('[name=url]').val(),
			slug = url.toLowerCase().replace(/[^\w ]+/g,'-').replace(/ +/g,'-'),
			secure = $('[name=secure]').prop('checked'),
			status = $('[name=status]').val(),
			organization_name = $('[name=organization_name]').val();
		function validateSiteFields() {
			if(!client) {
				alert('You must enter a client first');
				//click here to create a client first
				return false;
			} else if(!url || !isValidUrl(url)) {
				alert('Enter a URL');
				return false;
			} else if(!status) {
				var active = confirm('Is this an active site?');
				if(active) {
					status = 'active';
				} else {
					status = 'inactive';
				}
				$('[name=status]').val(status);
				if(validateSiteFields()) {
					return true;
				} else {
					return false;
				}
				
			} else if(!organization_name) {
				organization_name = prompt('Please enter an organization name','name');
				$('[name=organization_name]').val(organization_name);
				if(validateSiteFields()) {
					return true;
				} else {
					return false;
				}
			} else {
				return true;
			}
		}
		if(validateSiteFields()) {
			Meteor.call(
				'site_create',
				{
					client: client,
					url: url,
					slug: slug,
					secure: secure,
					status: status,
					organization_name: organization_name

				},
				function(error,response) {
					if(!error) {
						Router.go('/site/'+slug);
					} else {
						console.log(error);
					}
				}
			);
		} 
	}
	
});

Template.site.events({
	"change #newChecklist": function(event,context) {
		window.open(Router.url('checklist.new',{},{query:'site='+this.site.slug+'&type='+event.target.value}),'New Checklist','height=600,width=500,scrollbars=yes');
	},
	"click #checklists a": function(event,context) {
		event.preventDefault();
		window.open(event.target.href,'Checklist','height=600,width=500,scrollbars=yes')
	},
	'load': function(event,context) {
		//not working
		var editables = $('.editable');
		$.each(editables, function(index, val) {
			$(this).attr('size',$(this).val().length);
		});
	},
	'focus .editable': function(event,context) {
		$(event.target).removeProp('readonly');
	},
	'keydown .editable': function(event,context) {
		$(event.target).attr('size',$(event.target).val().length + 1);
	},
	'keyup .editable': function(event,context) {
		//this should wait for a pause and then save
		$(event.target).attr('size',$(event.target).val().length);
		//Should check if it's in a field ending with a comma, and advance if so (for city)
		if(event.keyCode == 13) {
			event.preventDefault();
			//Though allow for new lines in textareas
			Meteor.call(
				'update_field',
				'sites',
				context.data.site._id,
				event.target.name,
				event.target.value,
				function(response){
					$(event.target).prop('readonly','readonly').blur();
				}
			);
		}
	},
	'blur .editable:not(select)': function(event,context) {
		if($(event.target).val().length == 0) {
			$(event.target).attr('size',$(event.target).attr('placeholder').length);
		}

		var field = event.target.name;
		if($(event.target).attr('type') == 'checkbox') {
			var value = $(event.target).prop('checked');
		} else {
			value = event.target.value;
		}
		// console.log('field',field,'value',value);
		Meteor.call(
			'update_field',
			'sites',
			context.data.site._id,
			field,
			value,
			function(response){
				$(event.target).prop('readonly','readonly').blur();
			}
		);
	},
	'change select.editable': function(event,context) {
		Meteor.call(
			'update_field',
			'sites',
			context.data.site._id,
			$(event.target).attr('name'),
			event.target.value,
			function(response) {
				console.log(response);
			}

		);
	},
	'click .add-item': function(event,context) {
		//TODO: Remove empty fields
		//TODO: Focus on first field of new item
		var classes = event.target.className.split(/\s+/);
		var item_to_add = classes[1];
		Meteor.call(
			'add_to_field',
			'sites',
			context.data.site._id,
			item_to_add,
			function(error, response) {
				console.log(error,response);
			}
		);
	},
	'click button.remove': function(event,context) {
		var index_to_remove = $(event.target.parentElement).attr('data-index');
		Meteor.call(
			'remove_field',
			'sites',
			context.data.site._id,
			$(event.target.parentElement).attr('data-field'),
			index_to_remove,
			function(response) {
				console.log(response);
			}
		)
	}
});
Template.site.helpers({
	isSiteFile: true,
	checklistTypes: function() {
		var options = "<option value='' selected>Select Type</option>";
		for (var i = ChecklistTypes.length - 1; i >= 0; i--) {
			options = options + "<option value="+ChecklistTypes[i].slug+">"+ChecklistTypes[i].title+"</option>";
		};

		return "<select id='newChecklist'>"+options+"</select>";
	},
	collectionType: function() {
		return 'site';
	},
	provided_services: function() {
		var schemaAllowedValues = Sites._c2._simpleSchema._schema['service_provided.$'].allowedValues,//get all allowed values
			siteProvidedServices = Template.parentData(1).service_provided,//get the currently provided services
			services = $(schemaAllowedValues).not(siteProvidedServices).get();//remove the provided services from the list
		services.unshift(this.value);//add the current service to the beginning of the array
		var blankIndex = services.indexOf('');
		if(blankIndex !== 0) {
			services.splice(blankIndex,1);
		}
		return services;
		//Find other provided_services and exclude only those values
		//e.g. a site has domain and SEO. the domain dropdown excludes 'SEO' and vice versa, and a new service excludes both
	},
	is_provided_service: function() {
		return (this == Template.parentData().value);
	}
});

Template.site__checklist.helpers({
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
		return Sites.find({},{slug:1,url:1}).fetch();
	},
	clientName: function(){
		var client = Clients.findOne({_id:this.client});
		return client.name;
	},
	clientSlug: function(){
		var client = Clients.findOne({_id:this.client},{slug:1});
		return client.slug;
	}
});