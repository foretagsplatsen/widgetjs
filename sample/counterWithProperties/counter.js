define([
	'widgetjs/property',
	'widgetjs/collectionProperty',
	'widgetjs/widget'
], function(property, collectionProperty, widget) {

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

	var counterCollection = function() {
		var that = {};
	
		that.items = collectionProperty({
			value: [counterModel(), counterModel()]
		});

		that.increase = function() {
			that.items.forEach(function(item) {
				item.increase();
			});
		};

		that.decrease = function() {
			that.items.forEach(function(item) {
				item.decrease();
			});
		};

		that.addCounter = function() {
			that.items.push(counterModel());
		};

		return that;
	};


	var counterWidget = function() {
		var that = widget();
		var count = counterCollection();

		that.renderContentOn = function(html) {

			html.div(count.items.map(function(counter) {
				return html.h1(counter.count, ' hello');
			}));
							

			html.button('+').click(function() {
				count.increase();
			});
			html.button('-').click(function() {
				count.decrease();
			});
			html.button('add').click(function() {
				count.addCounter();
			});
		};

		that.appendToBody = function() {
			that.appendTo('body');
		};

		return that;
	};

	return counterWidget;
});
