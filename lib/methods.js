UI.registerHelper('addIndex', function (all) {
	// console.log('all',all);
	// console.log('index',index)
    if(Object.prototype.toString.call(all[0]) == '[object String]') {
        // console.log('found an array of strings');
        // return all;
        return _.map(all, function(value,index){
            return {value:value,index:index};
        })
    } else if(Object.prototype.toString.call(all[0]) == '[object Object]') {
        // console.log('found an array of objects')
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
    } else {
        console.log('damn cowboys',Object.prototype.toString.call(all[0]));
        return all;
    }
});

// UI.registerHelper('parentIndex', function(){
// 	// console.log(this);
// 	return 'butt';
// });