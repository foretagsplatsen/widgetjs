define([
	"./htmlCanvas",
	"./widget",
	"./widget2",
	"./widget-extensions",
	"./router",
	"./events"
], function(htmlCanvas, widget, widget2, widgetExtensions, router, events) {
	return {
		htmlCanvas: htmlCanvas,
		widget: widget,
		Widget: widget2,
		ext: widgetExtensions,
		router: router,
		events: events
	};
});
