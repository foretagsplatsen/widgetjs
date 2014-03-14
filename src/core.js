define(
	[
		'./htmlCanvas',
		'./widget',
		'./widget-extensions',
		'./router',
		'./events',
        './property',
        './computedProperty',
        './formWidget'
	],

	function (htmlCanvas, widget, ext, router, events, property, computedProperty, formWidget) {
		return {
			htmlCanvas : htmlCanvas,
			widget : widget,
			ext : ext,
			router : router,
			events : events,
            property : property,
            computedProperty : computedProperty,
            formWidget: formWidget
		};
	}
);