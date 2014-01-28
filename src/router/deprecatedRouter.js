define([
	'./router',
	'widgetjs/events'
], function (router, events) {
	// FACADE FOR OLD DEPRECATED ROUTER/CONTROLLER
	//  use router.js instead

	var handler = events.at('routing');

	var routerSingleton = (function(spec,my) {
		var that = router(spec, my);

		that.on('routeMatched', function(result) {
			events.at('routing').trigger('match', result);
		});
		that.on('routeNotFound', function(url) {
			events.at('routing').trigger('notfound', url);
		});

		that.resolvePath = that.resolveUrl;
		that.getPath = function() { return that.getUrl().toString(); };
		that.updatePath = that.setParameters;

		return that;
	}());

	var controllerSingleton = {};
	controllerSingleton.on = function(path, callback) {
		routerSingleton.addRoute({
			pattern: path,
			action: callback
		});
	};

	return {
		controller: controllerSingleton,
		router: routerSingleton
	};
});