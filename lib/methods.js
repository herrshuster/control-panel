UI.registerHelper('addIndex', function (all) {
	// console.log('all',all);
	// console.log('index',index)
    return _.map(all, function(value, index) {
    	// console.log(value,index);
    	value.index = index;

    	var keys = Object.keys(value);
    	//get all the keys, loop through them to find arrays and set their parentIndex appropriately
    	for (var i = 0; i < keys.length; i++) {
    		if(Array.isArray(value[keys[i]])) {
    			for (var j = 0; j < value[keys[i]].length; j++) {
    				value[keys[i]][j].parentIndex = index;
    			};
    		}
    	};
    	return value;
    });
});

// UI.registerHelper('parentIndex', function(){
// 	// console.log(this);
// 	return 'butt';
// });