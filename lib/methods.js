UI.registerHelper('addIndex', function (all) {
    return _.map(all, function(i, k) {
    	i.index = k;
    	return i;
        // return {index: k, value: i};
    });
});