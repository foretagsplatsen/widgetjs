define(
	[
		'./htmlCanvas',
		'./tagBrush',
		'./widget',
		'./widget-extensions',
		'./router',
		'./events'
	],

	function (htmlCanvas, tagBrush, widget, ext, router, events) {
		return {
			htmlCanvas : htmlCanvas,
			widget : widget,
			ext : ext,
			router : router,
			events : events
		};
	}
);
