define([], function() {
	var files = [
		"test/htmlCanvasTest",
		"test/widgetTest",
		"test/eventsTest",
		"test/router/hashLocationTest",
		"test/router/routerTest",
		"test/router/routeTest"
	];
	return {
		files: files,
		config: {
			paths: {
				"klassified": "../bower_components/klassified/dist/klassified",
				"jquery": "../bower_components/jquery/dist/jquery"
			},
			shim: {
				"jquery": {
					exports: "$"
				}
			}
		}
	};
});
