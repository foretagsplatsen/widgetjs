define(
	[
		'./htmlCanvas',
		'./widget',
		'./widget-extensions',
		'./router',
		'./events',
        './property'
	],

	function (htmlCanvas, widget, ext, router, events, property) {
		return {
			htmlCanvas : htmlCanvas,
			widget : widget,
			ext : ext,
			router : router,
			events : events,
            property : property
		};
	}
);