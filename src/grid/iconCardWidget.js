define([
	'widgetjs/core'
], function(widgetjs) {
	/**
	 * `iconCardWidget` is
	 */
	function iconCardWidget(spec, my) {
		spec = spec || {};
		my = my || {};

		var grid = spec.grid;
		var item = spec.item;
		var index = spec.index;
		var cardClass = spec.cardClass || '';

		var that = widgetjs.widget(spec, my);


		my.fieldValue = function(name)  {
			//TODO: rename settings to fieldProperties
			var settings = grid.getFieldSettings(name);
			if(!settings) {
				settings = grid.findFieldSettings(function (fieldName, fieldSettings) {
					return fieldSettings && fieldSettings['is' + (name.charAt(0).toUpperCase() + name.slice(1))];
				});
			}

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

		//
		// Rendering
		//

		that.renderContentOn = function(html) {
			html.div({klass: cardClass  + ' col-xs-6 col-sm-2'},
				html.a({href: my.getLink() },
					html.img({klass: 'img-responsive img-thumbnail', src: my.getImage() })
				),
				html.h5(html.a({href: my.getLink()}, my.getLabel()))
			);

			// Break rows every 6th item on desktop
			if((index + 1) % 6 === 0) {
				html.div({klass: 'clearfix visible-sm visible-md visible-lg'});
			}

			// and every 2nd on phone
			if((index + 1) % 2 === 0) {
				html.div({klass: 'clearfix visible-xs'});
			}
		};

		return that;
	}

	return iconCardWidget;
});