define([
	"./htmlCanvas",
	"./widget",
	"./widget-extensions",
	"./router",
	"./events"
], function(htmlCanvas, widget, widgetExtensions, router, events) {
	return {
		htmlCanvas: htmlCanvas,
		widget: widget,
		ext: widgetExtensions,
		router: router,
		events: events
	};
});
