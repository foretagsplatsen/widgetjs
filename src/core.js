define(
	[
		"./htmlCanvas",
		"./widget",
		"./widget-extensions",
		"./router",
		"./events"
	],

	function(htmlCanvas, widget, ext, router, events) {
		return {
			htmlCanvas : htmlCanvas,
			widget : widget,
			ext : ext,
			router : router,
			events : events
		};
	}
);
