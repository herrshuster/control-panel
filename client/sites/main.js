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
	//change this to a live-updating field instead of an input, which is insecure
});

Template.newSite.events({
	"keyup [name='url']": function(event,context) {
		var siteUrl = event.target.value
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

				active ? status = 'active' : status = 'inactive';

				$('[name=status]').val(status);

				return validateSiteFields();

			} else if(!organization_name) {
				organization_name = prompt('Please enter an organization name','name');
				$('[name=organization_name]').val(organization_name);

				return validateSiteFields();

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
					if(!error)
						Router.go('/site/'+slug);
					else
						console.log(error);
				}
			);
		}
	}

});

Template.site.onRendered(function(){
	$('ul.tabs').tabs();
	$('select.live-field').material_select();
});

Template.site.events({
	"change #newChecklist": function(event,context) {
		window.open(Router.url('checklist.new',{},{query:'site='+this.site.slug+'&type='+event.target.value}),'New Checklist','height=600,width=500,scrollbars=yes');
	},
	"click #checklists a": function(event,context) {
		event.preventDefault();
		window.open(event.target.href,'Checklist','height=600,width=500,scrollbars=yes')
	},
	'keydown .live-field, keyup .live-field': function(event,context) {
		if((event.key == 'Enter' && event.target.type !== 'textarea')) {
			$(event.target).blur();
			console.log('context',context,'this',this);
		} else {
			var parent = $(event.target).parents('.cp-collection').attr('id'),
					index = this.index,
					field = event.target.name,
					value = event.target.type == 'checkbox' ? $(event.target).prop('checked') : event.target.value,
					reference = 'parentIndex' in this ? parent+'.'+this.parentIndex+'.'+$(event.target).parents('section').attr('class')+'.'+index+'.'+field : field ? parent+'.'+index+'.'+field : parent+'.'+index;
			delay(function(){
				console.log('should be delaying')
				update_field('site',context.data.site._id,reference,value);
			}, 500 );
		}
	},
	'blur .live-field, change .live-field[type=checkbox]': function(event,context) {
		if($(event.target).val().length == 0)
			$(event.target).attr('size', $(event.target).attr('placeholder').length);


			var parent = $(event.target).parents('.cp-collection').attr('id'),
					index = this.index,
					field = event.target.name,
					value = event.target.type == 'checkbox' ? $(event.target).prop('checked') : event.target.value,
					reference = 'parentIndex' in this ? parent+'.'+this.parentIndex+'.'+$(event.target).parents('section').attr('class')+'.'+index+'.'+field : field ? parent+'.'+index+'.'+field : parent+'.'+index;

			update_field('site',context.data.site._id,reference,value);
			if(!$(event.target).val())
				console.log('remove it');
	},
	'change select.live-field': function(event,context) {
		//make it work for things like 'billing cycle'
		update_field('site',context.data.site._id,$(event.target).parents('.cp-collection').attr('id')+'.'+this.index,event.target.value);
	},
	'click .add-item a': function(event,context) {
		var item_to_add = event.target.className.split(/\s+/)[0];
		console.log('adding item',item_to_add);
		add_to_field('site',context.data.site._id,item_to_add,function(){
			var ulToWatch = $(event.target).parents('.cp-collection').find('ul');
			ulToWatch.on('DOMNodeInserted',function(event){
				if(event.target.nodeName == 'LI') {
					$(event.target).find('.input-field:first-of-type .live-field').focus();
					ulToWatch.off('DOMNodeInserted','**');
				}
			});
		});
	},
	'click button.remove': function(event,context) {
		var parent = 'parentIndex' in this ? $(event.target).parents('.cp-collection').attr('id')+'.'+this.parentIndex+'.'+$(event.target).parents('section').attr('class') : $(event.target).parents('.cp-collection').attr('id');
		var index = getElIndex($(event.target).parents('li').get()[0]);
		setTimeout(function(){
			remove_field('site',context.data.site._id,parent,index);
		},200);
	},

	'click ul.tabs li a': function(event,context) {
		if(event.target.nodeTupe !== 1)
			var target = event.target.parentNode;
		else
			var target = event.target;

		window.history.pushState({},"",target.href);
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
	provided_services: function(){
		var schemaAllowedValues = Sites._c2._simpleSchema._schema['service_provided.$'].allowedValues,//get all allowed values
				servicesAlreadyProvided = Template.parentData(1).site.service_provided,//get the currently provided services
				services = $(schemaAllowedValues).not(servicesAlreadyProvided).get(),//remove the provided services from the list
				html = '',
				i = services.indexOf(this.value);//get the location of the current service

		services.splice(i,1);//remove the current service from where it is

		services.unshift(this.value);//add the current service to the beginning of the array

		var blankIndex = services.indexOf('');

		if(blankIndex !== 0)
			services.splice(blankIndex,1);

		console.log('services',services);

		for (var i = services.length - 1; i >= 0; i--) {
			html += "<option value="+services[i]+" "+(this.value == services[i] ? 'selected' : '')+">"+services[i]+"</option>";
		};

		return html;
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
				if(this.items[i].events[j].type == 'check' || this.items[i].events[j].type == 'uncheck')
					checkedState = this.items[i].events[j].type;

			};

			if(checkedState == 'check')
				checkedItems++;

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