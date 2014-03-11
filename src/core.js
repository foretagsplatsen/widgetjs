define(
	[
		'./htmlCanvas',
		'./widget',
		'./widget-extensions',
		'./router',
		'./events',
        './property',
        './formWidget'
	],

	function (htmlCanvas, widget, ext, router, events, property, formWidget) {
		return {
			htmlCanvas : htmlCanvas,
			widget : widget,
			ext : ext,
			router : router,
			events : events,
            property : property,
            formWidget: formWidget
		};
	}
);