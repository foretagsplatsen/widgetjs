define([
	'widgetjs/core',
	'./sourceBuilder'
], function(widgetjs, sourceBuilder) {

	/**
	 * `abstractGridWidget` is
	 */
	function abstractGridWidget(spec, my) {
		spec = spec || {};
		my = my || {};

		var that = widgetjs.widget(spec, my);

		my.source = sourceBuilder(spec);
		my.currentElements = [];

		//
		// Events
		//

		that.onPending = my.events.createEvent();
		that.onSuccess = my.events.createEvent();

		//
		// Public
		//

		that.setSource = function(source) {
			var sourceSpec = Object.create(spec);
			sourceSpec.source = source;
			my.source = sourceBuilder(sourceSpec);
			my.getNextElements();
		};

		that.setOrderBy = function(newValue) {
			my.source.setOrderBy(newValue);
			my.currentElements = [];
			my.getNextElements();
		};

		// Search support
		that.applySearchFrom = function(searchWidget) {
			searchWidget.applySearchOnGrid(that);
		};

		that.updateSearch = function(string) {
			my.source.setSearch(string);
			my.currentElements = [];
			my.getNextElements();
		};

		//
		// Rendering
		//

		that.renderContentOn = function(html) {
			html.h1('Override me');
		};

		//
		// Protected
		//

		my.getNextElements = function() {
			that.onPending.trigger();
			my.source.getNextElements(function(elements) {
				that.onSuccess.trigger();
				my.currentElements.push.apply(my.currentElements, elements);
				that.update();
			});
		};

		my.getNextElements();
		return that;
	}

	return abstractGridWidget;
});