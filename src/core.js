define(
	[
		'./htmlCanvas',
		'./widget',
		'./router',
		'./events'
	],

	function (htmlCanvas, widget, router, events) {
		return {
			htmlCanvas : htmlCanvas,
			widget : widget,
			router : router,
			events : events
		};
	}
);
