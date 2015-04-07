define([
	'widgetjs/core'
], function(widgetjs) {
	/**
	 * `detailedCardWidget` is
	 */
	function detailedCardWidget(spec, my) {
		spec = spec || {};
		my = my || {};

		var grid = spec.grid;
		var item = spec.item;
		var index = spec.index;
		var cardClass = spec.cardClass || '';

		var that = widgetjs.widget(spec, my);

		my.fieldSettings = function(name) {
			var settings = grid.getFieldSettings(name);
			if(settings) {
				return settings;
			}

			return grid.findFieldSettings(function (fieldName, fieldSettings) {
				return fieldSettings && fieldSettings['is' + name.charAt(0).toUpperCase() + name.slice(1)];
			});
		};

		my.fieldValue = function(name)  {
			var settings = my.fieldSettings(name);
			return grid.getFieldSettingsValue(settings, item);
		};

		my.getLink = function() {
			return my.fieldValue('link');
		};

		my.getLabel = function() {
			return my.fieldValue('label');
		};

		my.getImage = function() {
			return my.fieldValue('icon');
		};

		my.getExtraFields = function() {
			var excludedFields = ['link', 'label', 'icon'].map(my.fieldSettings);

			var extraFields = {};
			grid.getFieldNames().forEach(function(fieldName) {
				var fieldSettings = grid.getFieldSettings(fieldName);
				if(excludedFields.indexOf(fieldSettings) < 0) {
					extraFields[fieldName] = fieldSettings;
				}
			});

			return extraFields;
		};


		//
		// Rendering
		//

		that.renderContentOn = function(html) {
			html.div(
				html.div({style: 'width:10%'},
					html.a({href: my.getLink()},
						html.img({klass: 'img-responsive img-thumbnail', src: my.getImage() })
					)
				),
				html.div({style: 'width:80%'},
					html.b(' ', html.a({href: my.getLink()}, my.getLabel())),
					my.renderFieldsOn
				)
			);
		};

		my.renderFieldsOn = function(html) {
			var fields = my.getExtraFields();
			var fieldNames = Object.keys(fields);
			html.div(
				fieldNames.map(function(fieldName) {
					return html.span(
						html.span({klass: 'label label-default'}, fieldName),
						grid.getFieldValue(fieldName, item)
					)
				})
			);
		};

		return that;
	}

	return detailedCardWidget;
});