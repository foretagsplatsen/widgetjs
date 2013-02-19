define(
	[
	'./htmlCanvas',
	'./widget',
	'./widget-extensions',
	'./router',
	'./events'
	],

	function (htmlCanvas, widget, ext, router, events) {
		return {
			VERSION: '0.0.1',
			htmlCanvas : htmlCanvas,
			widget : widget,
			ext : ext,	
			router : router,
			events : events
		};
	}
);