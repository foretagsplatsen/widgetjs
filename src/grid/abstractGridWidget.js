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

		my.fields = spec.fields || [];
		my.source = sourceBuilder(spec);
		my.currentElements = []; //TODO: Let source keep?

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
			//TODO: check if source is sortable
			my.source.setOrderBy(newValue);
			my.currentElements = [];
			my.getNextElements();
		};

		// Search support
		that.applySearchFrom = function(searchWidget) {
			searchWidget.applySearchOnGrid(that);
		};

		that.updateSearch = function(string) {
			//TODO: check if source is searchable
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

		that.getFieldNames = function() {
			return Object.keys(my.fields);
		};

		that.getFieldSettings = function(name) {
			return my.fields[name] || {};
		};

		that.findFieldSettings = function(predicate, settingName) {
			var names = that.getFieldNames();
			for(var fieldIndex = 0; fieldIndex < names.length; fieldIndex++) {
				var name = names[fieldIndex];
				var settings = my.fields[name];
				if(predicate(name, settings, fieldIndex)) {
					if(settingName) {
						return settings && settings[settingName];
					}

					return settings;
				}
			}
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

		that.getFieldTitle = function(name) {
			var fieldSettings = that.getFieldSettings(name);

			if(fieldSettings.title) {
				return fieldSettings.title;
			}

			return name.charAt(0).toUpperCase() + name.slice(1);
		};




		my.getNextElements(); //TODO: should we fetch data when a widget is set-up? maybe only on render and when explicitly told to
		return that;
	}

	return abstractGridWidget;
});