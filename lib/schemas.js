Sites = new Mongo.Collection("sites");
Clients = new Mongo.Collection("clients");
Checklists = new Mongo.Collection("checklists");
ChecklistItems = new Mongo.Collection("checklistItems");
var Schemas = {};

ChecklistTypes = [
	{	
		'slug': 'seo-sweep',
		'unique': true,
		//unique checklists may only have one instance attached to a site
		'title': 'SEO Sweep',
		'prerequisite': function(site) {
			//if client is seo and does not have an seo-sweep checklist ,return true
			//else return false
		}
	},
	{	
		'slug': 'dev-phase-0',
		'unique': false,
		'title': 'Development Phase 0',
		'prerequisite': function(site) {
			//if previous checklist is completed for site, return true
			//else return false
		}
	},
	{	
		'slug': 'dev-phase-1',
		'unique': false,
		'title': 'Development Phase 1',
		'prerequisite': function(site) {
			//if previous checklist is completed for site, return true
			//else return false
		}
	},
	{	
		'slug': 'dev-phase-2',
		'unique': false,
		'title': 'Development Phase 2',
		'prerequisite': function(site) {
			//if previous checklist is completed for site, return true
			//else return false
		}
	},
	{	
		'slug': 'dev-phase-3',
		'unique': false,
		'title': 'Development Phase 3',
		'prerequisite': function(site) {
			//if previous checklist is completed for site, return true
			//else return false
		}
	},
	{	
		'slug': 'security',
		'unique': false,
		'title': 'Security Scan'
	}
];

function ChecklistSlugs() {
 	var Options = [];
	for (var i = ChecklistTypes.length - 1; i >= 0; i--) {
		Options.push(ChecklistTypes[i].slug);
	};
	return Options;
}


ChecklistItemRevisionSchema = new SimpleSchema({
	reversion: {
		type: Number
	},
	title: {
		type: String
	},
	description: {
		type: String
	}
});

Schemas.ChecklistItem = new SimpleSchema({
	checklistType: {
		type: String,
		allowedValues: ChecklistSlugs()
	},
	default: {
		type: Boolean
	},
	revisions: {
		type: [ChecklistItemRevisionSchema]
	}
});

ChecklistItems.attachSchema(Schemas.ChecklistItem);

ChecklistItemEventSchema = new SimpleSchema({
	date: {
		type: Date
	},
	user: {
		type: String
	},
	type: {
		type: String,
		allowedValues: [
			'create',
			'remove',
			'check',
			'uncheck',
			'note'
		]
	}
})

InstantiatedItemSchema = new SimpleSchema({
	id: {//matches id of checklistItem from which it was instantiated
		type: String
	},
	events: {
		type: [ChecklistItemEventSchema]
	},
	title: {
		type: String
	},
	description: {
		type: String
	}
})

Schemas.Checklist = new SimpleSchema({
	title: {
		type: String,
		optional: true
	},
	belongs_to: {
		type: String
	},
	type: {
		type: String,
		allowedValues: [
			'seo-sweep',
			'dev-phase-0',
			'dev-phase-1',
			'dev-phase-2',
			'dev-phase-3',
			'security'
		],
		optional: true
	},
	items: {
		type: [InstantiatedItemSchema],
		optional: true
	}
});
Checklists.attachSchema(Schemas.Checklist);

LoginSchema = new SimpleSchema({
	level: {
		type: Number,
		min: 0,
		max: 9
	},
	users: {
		type: Array
	},
	"users.$": {
		type: Object
	},
	"users.$.name": {
		type: String,
		label: "Username"
	},
	"users.$.password": {
		type: String,
		label: "Password"
	},
	note: {
		type: String
	}
});

AddressSchema = new SimpleSchema({
	address_locality: {
		type: String,
		label: "City"
	},
	address_region: {
		type: String,
		label: "State"
	},
	street_address: {
		type: String,
		label: "Street Address"
	},
	postal_code: {
		type: String,
		label: "ZIP Code",
		regEx: SimpleSchema.RegEx.ZipCode
	},
	note: {
		type: String,
		label: "Notes",
		optional: true
	}
});

EmailAddressSchema = new SimpleSchema({
	address: {
		type: String,
		regEx: SimpleSchema.RegEx.Email
	},
	login: {
		type: LoginSchema,
		optional: true
	},
	note: {
		type: String,
		optional: true
	}
});

PhoneNumberSchema = new SimpleSchema({
	number: {
		type: String
	},
	note: {
		type: String
	}
});

PersonSchema = new SimpleSchema({
	name: {
		type: String
	},
	phone_number: {
		type: [PhoneNumberSchema],
		optional: true
	},
	email: {
		type: [EmailAddressSchema],
		optional: true
	},
	position: {
		type: String,
		optional: true
	},
	public: {
		type: Boolean
	},
	note: {
		type: String,
		optional: true
	}
});

FileAccessSchema = new SimpleSchema({
	type: {
		type: String,
		allowedValues: [
			'FTP',
			'SFTP'
		]
	},
	address: {
		type: String,
		label: "Address or IP",
		regEx: SimpleSchema.RegEx.WeakDomain
	},
	path: {
		type: String
	},
	login: {
		type: LoginSchema
	},
	note: {
		type: String
	}
});

ServiceUsed = new SimpleSchema({
	login_url: {
		type: String,
		regEx: SimpleSchema.RegEx.Url
	},
	login: {
		type: LoginSchema
	},
	type: {
		type: String,
		allowedValues: [
			'Social',
			'Domain',
			'Hosting',
			'Database',
			'CMS',
			'Other'
		]
	},
	note: {
		type: String,
		optional: true
	}
});

Schemas.Client = new SimpleSchema({
	name: {
		type: String
	},
	slug: {
		type: String//add validation as defined: https://github.com/aldeed/meteor-simple-schema#validate-one-key-against-another
	},
	address: {
		type: [AddressSchema],
		optional: true
	},
	email_addresses: {
		type: [EmailAddressSchema],
		optional: true
	},
	phone_numbers: {
		type: [PhoneNumberSchema],
		optional: true
	},
	people: {
		type: [PersonSchema],
		optional: true
	},
	referral: {
		type: String,
		optional: true
	},
	note: {
		type: String,
		optional: true
	}
});

Clients.attachSchema(Schemas.Client);

Schemas.Site = new SimpleSchema({
	client: {
		type: String,
		label: "Client"
	},
	url: {
		type: String,
		label: "URL",
		regEx: SimpleSchema.RegEx.Domain
	},
	slug: {
		type: String
	},
	secure: {
		type: Boolean,
		label: "HTTPS?"
	},
	organization_name: {
		type: String,
		label: "Organization Name"
	},
	billing_cycle: {
		type: String,
		allowedValues: [
			"1m01",
			"1m15"
		],
		label: "Billing Cycle",
		autoform: {
			options: [
				{
					label: "First of Every Month",
					value: "1m01"
				},
				{
					label: "Fifteenth of Every Month",
					value: "1m15"
				}
			]
		},
		optional: true
	},
	addresses: {
		type: [AddressSchema],
		optional: true
	},
	email_addresses: {
		type: [EmailAddressSchema],
		optional: true
	},
	phone_numbers: {
		type: [PhoneNumberSchema],
		optional: true
	},
	services_offered: {
		type: Array,
		optional: true
	},
	"services_offered.$": {
		type: String
	},
	products_offered: {
		type: Array,
		optional: true
	},
	"products_offered.$": {
		type: String
	},
	locations: {
		type: Array,
		optional: true
	},
	"locations.$": {
		type: String
	},
	board: {
		type: String,
		optional: true
	},
	// people: {
	// 	type: [PersonSchema],
	// 	optional: true
	// }, //can add people from client, and specify their roles
	services_provided: {
		type: Array,
		optional: true
	},
	"services_provided.$": {
		type: String,
		allowedValues: [
			"SEO",
			"Development",
			"Advertising",
			"Social",
			"Domain",
			"Email",
			"Hosting",
			"Security",
			"Backup"
		]
	},
	status: {
		type: String,
		allowedValues: [
			"active",
			"inactive"
		]
	},
	services_used: {
		type: [ServiceUsed],
		optional: true
	},
	file_access: {
		type: [FileAccessSchema],
		optional: true
	}
});

Sites.attachSchema(Schemas.Site);