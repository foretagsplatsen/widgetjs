define(
	[
		'./htmlCanvas',
		'./widget',
		'./widget-extensions',
		'./router',
		'./events',
        './property',
        './computedProperty',
        './formWidget',
        './collectionProperty'
	],

	function (htmlCanvas, widget, ext, router, events, property, computedProperty, formWidget, collectionProperty) {
		return {
			htmlCanvas : htmlCanvas,
			widget : widget,
			ext : ext,
			router : router,
			events : events,
            property : property,
            collectionProperty: collectionProperty,
            computedProperty : computedProperty,
            formWidget: formWidget
		};
	}
);