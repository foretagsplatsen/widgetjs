define([
	'widgetjs/core'
], function (widgetjs) {
	function regionWidget(spec, my) {
		spec =  spec || {};
		my =  my || {};

		var that = widgetjs.widget(spec, my);

		var widgets = [];

		that.set = function(newWidgets) {
			if(!Array.isArray(newWidgets)) {
				newWidgets = [newWidgets];
			}

			that.empty();

			widgets = newWidgets;

			widgets.forEach(function(aWidget) {
				that.trigger('added', aWidget);
			});

			that.update();
		};

		that.empty = function() {
			widgets.forEach(function(aWidget) {
				that.trigger('removed', aWidget);
			});

			widgets = [];

			that.update();
		};


		that.renderContentOn = function(html) {
			html.render(widgets);
		};

		return that;
	}

	return regionWidget;
});