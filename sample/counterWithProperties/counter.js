define([
	'widgetjs/property',
	'widgetjs/widget'
], function(property, widget) {

	/**
	 *    `counter` is an example of how to use `properties`
	 *    to update automatically the counter label when the
	 *    counter value changes.
	 */

	var counterModel = function() {
		var that = {};
		that.count = property({
			value: 0
		});
		that.increase = function() {
			that.count.set(that.count.get() + 1);
		};
		that.decrease = function() {
			that.count.set(that.count.get() - 1);
		};
		return that;
	};

	var counterWidget = function() {
		var that = widget();
		var count = counterModel();
		that.renderContentOn = function(html) {
			html.h1(count.count, ' hello');
			html.button('+').click(function() {
				count.increase();
			});
			html.button('-').click(function() {
				count.decrease();
			});
		};

		that.appendToBody = function() {
			that.appendTo('body');
		};

		return that;
	};

	return counterWidget;
});