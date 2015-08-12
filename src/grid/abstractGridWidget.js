define([
	'widgetjs/core',
	'./arrayGridSource'
], function(widgetjs, arrayGridSource) {

	/**
	 * `abstractGridWidget` is TODO: explain
	 */
	function abstractGridWidget(spec, my) {
		spec = spec || {};
		my = my || {};

		var that = widgetjs.widget(spec, my);

		/**
		 * TODO: explain
		 */
		my.source = undefined;

		/**
		 * TODO: explain
		 */
		my.fields = spec.fields || [];

		/**
		 * TODO: explain
		 */
		my.itemRenderer = spec.itemRenderer || defaultCardRenderer;

		//
		// Events
		//

		// On pending?
		that.onPending = my.events.createEvent();
		that.onSuccess = my.events.createEvent();

		//
		// Public
		//

		that.setSource = function(source) {
			var sourceSpec = Object.create(spec);
			sourceSpec.source = source;
			//TODO: do not pass spec.
			my.source = sourceBuilder(sourceSpec);
			my.getNextElements();
			//TODO: should we fetch data when a widget is set-up? maybe only on render and when explicitly told to
		};

		that.setOrderBy = function(newValue) {
			if(!my.isSourceOrderable()) {
					return;
			}

			my.source.setOrderBy(newValue);
			my.getNextElements();
		};

		// Search support
		that.applySearchFrom = function(searchWidget) {
			searchWidget.applySearchOnGrid(that);
		};

		//TODO: rename set search? Why update?
		that.updateSearch = function(string) {
			if(!my.isSourceSearchable()) {
					return;
			}

			my.source.setSearch(string);
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

		my.isSourceOrderable = function() {
			return my.source.setOrderBy !== undefined;
		};

		my.isSourceSearchable = function() {
			return my.source.setSearch  !== undefined;
		};

		//TODO: How to name?
		my.getNextElements = function() {
			that.onPending.trigger();
			my.source.getNextElements(function(elements) {
				that.onSuccess.trigger();
				that.update();
			});
		};

		//TODO: not as async and nice as Nico and Bens
		// and we should look at promisses and streams
		my.getCurrentElements = function() {
			return my.source.getCurrentElements();
		};

		that.getFieldNames = function() {
			return Object.keys(my.fields);
		};

		that.getFieldSettings = function(name) {
			return my.fields[name];
		};

		that.getFieldTitle = function(name) {
			var fieldSettings = that.getFieldSettings(name);

			if(fieldSettings && fieldSettings.title) {
				return fieldSettings.title;
			}

			// Default to field name
			return name.charAt(0).toUpperCase() + name.slice(1);
		};

		that.getFieldValue = function(name, item) {
			var fieldSettings = that.getFieldSettings(name);
			return that.getFieldSettingsValue(fieldSettings, item);
		};

		that.getFieldSettingsValue = function(fieldSettings, item) {
			if(fieldSettings.content) {
				return fieldSettings.content(item);
			}

			if(fieldSettings.value) {
				return fieldSettings.value(item);
			}

			return fieldSettings(item);
		};

		that.findFieldSettings = function(predicate) {
			var names = that.getFieldNames();
			for(var fieldIndex = 0; fieldIndex < names.length; fieldIndex++) {
				var fieldName = names[fieldIndex];
				var fieldSettings = my.fields[fieldName];
				if(predicate(fieldName, fieldSettings, fieldIndex)) {
					return fieldSettings;
				}
			}
		};

		var sources = [arrayGridSource];

		function sourceBuilder(options) {
			//TODO: If it implements interface set it without builder
			//TODO: why the builder

			var source = options.source;
			for(var i = 0; i < sources.length; i++) {
				if (sources[i].validFor(source)) {
					return sources[i](options);
				}
			}

			throw new Error('No grid source for source');
		}

		function defaultCardRenderer(item) {
			return function(html) {
				html.ul(my.getFieldNames().map(function(field) {
					html.li(field)
				}));
			}

			return my.card({
				grid: that,
				item: options.element,
				index: options.index
			});
		}

		//
		// Init
		//

		that.setSource(spec.source);
		return that;
	}

	return abstractGridWidget;
});
