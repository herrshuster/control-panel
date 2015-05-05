Master password is stored for 5 minutes in memory so after entering, user can look at a number of passwords without retyping master password.



Use singular form for all property declarations

Body text size always = 1rem. Adjust root element to scale.

days/ folder creates one folder per day listing:
-sites updated
-work done


Favicon generator via API

##Design Principles
Shouldn't have to scroll: All relevant information should be suggested by what's on the screen. Icons are ok, hiding something is not


Be able to pull up a client QUICKLY if they call

Tasks get pulled from related Trello cards. On task completion, checks item on Trello card

JSON files are used to store data in a human-readable format that allows pages to render instantly, then are validated against database, which is the program's canonical copy. While editing page, edits are made directly to the JSON file and then synced to the database after user is done editing. Syncs automatically each minute, or sync can be triggered on pageleave or other triggers
-Not completely sure this needs to be done. Maybe the filesystem IS the database
-Use JSON schema to create master version of site JSONs, and validate against
--Loading a json file loads the associated jsonschema, and inputs are checked against their schema before being saved to file


Express Routing
node-sass for compiling
jade templating

###Example Structure

```
/app
	/js
	/sass
	/views
		/client
		/site
		/day
	/snippets
	ids.json
/data
	/client
		/{client}
			meta.json
			sites.json
			documents.json
			logins.json
	/site
		/{site}
			meta.json
			checklists.json
			design.json
			development.json
			logins.json
			tasks.json
	/days
		/{YYYY-MM-DD}
			some-file.txt
	/documents
		/{document}
			meta.json
			document.md
			{images}
/public
	server.js
	/css
```

Server.js handles requests, gets data from data folder, js as needed, css from public css folder, which is compiled on scss change


Mongoose Schema Validation

##Endpoints:
```
/
/clients
	/{client}
		/meta
		/logins
		/sites
	/us (alias of /client/{optimize-worldwide})

/sites
	/{site}
		/checklists
		/design
		/development
		/logins
		/meta
		/tasks
		/documents
		/snippets
		/{document}
		/client (alias)

/logins (alias of /us/logins)

/snippets
	/new
	/{snippet}
		/edit

/days
	/{date}

/?search={search}
```


ID schema: (deprecated)
```
Clients: _client0001
Sites: _site[0001]01 [client]
-e.g. _site291001 is client 2910's first site. Most site ids will end in 01
Comments: _comment[0001][01]0001 [client][site]
Logins: _login[0001]000 [client] || _login[0001][01]000 [client][site]
Checklists: _list001
Checklist Items: _item[001]001 [list]
People: _person[0001]01 [client]
Documents: _doc0001 || _doc[0001]0001 [client] || _doc[0001][01]0001 [client][site]
```

Say a login is referenced
First the id is parsed to determine what kind of login it is.
If 7 digits, it's a client login
- Looks up id of client
- Opens referenced folder of client, and file logins.json (ids.json gives it the folder, uses query "login" to determine which file)
If 9 digits, it's a site login
- Looks up id of site
- Opens referenced site folder
