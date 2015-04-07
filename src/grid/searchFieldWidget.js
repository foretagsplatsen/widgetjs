define([
	'widgetjs/core',
	'jquery'
], function(widgetjs, jQuery) {

	/**
	 * `searchFieldWidget` is a widget used to filter another widget entries.
	 *
	 * The queries are not sent at each keystroke but wait for `timeout` milliseconds
	 * without a keystroke to trigger a new query.
	 *
	 *
	 * @param {{}} spec
	 * @param {String} [spec.placeholder]        Placeholder string to display when the searchFiled content is empty.
	 *                                               Default is empty string
	 * @param {Integer} spec.timeout             Time in ms to wait after a keystroke before the query is actually triggered.
	 *                                               Default is 600.
	 * @param {boolean} [spec.onlySearchOnEnter] Set if a new query must be triggered only when [Enter] is pressed.
	 *                                               Default is false.
	 *
	 * @param my
	 * @returns {*}
	 */
	function searchFieldWidget(spec, my) {
		spec = spec || {};
		my = my || {};
		var that = widgetjs.widget(spec, my);

		var placeholder = spec.placeholder || '';
		var timeout = spec.timeout || 600;
		var onlySearchOnEnter = spec.onlySearchOnEnter;

		var listening = true;

		var searchString = '';
		var onResume;

		my.onSearchChange = my.events.createEvent();

		//
		// Public
		//

		that.setSearchString = function(string) {
			searchString = string;
			my.onSearchChange.trigger(string);
			that.update();
		};

		that.reset = function() {
			searchString = '';
			that.update();
		};

		that.applySearchOn = function(searchableWidget) {
			searchableWidget.applySearchFrom(that);
		};

		that.applySearchOnCardList = function(cardList) {
			my.onSearchChange(function() {
				my.stop();
				cardList.updateSearch(searchString);
			});
			cardList.onDataChange(function() {
				my.start();
			});
		};

		that.applySearchOnGrid = function(grid) {
			my.onSearchChange(function() {
				my.stop();
				grid.updateSearch(searchString);
			});

			grid.onSuccess(function() {
				my.start();
			});
		};

		//
		// Protected
		//

		my.stop = function() {
			listening = false;
		};

		my.start = function() {
			listening = true;
			if(onResume) {
				onResume();
				onResume = undefined;
			}
		};


		//
		// Rendering
		//

		that.renderContentOn = function(html) {
			var input = html.input({
				type: 'text',
				placeholder: placeholder,
				value: searchString
			});
			input.keyup(function(event) {
				var keyCode = event.keyCode || event.which;
				if(onlySearchOnEnter && keyCode !== 13) {
					return;
				}

				// Ignore arrow-keys
				if(keyCode >= 37 && keyCode <= 40) {
					return;
				}

				searchString = input.asJQuery().val();
				delay(function() {
					if(listening) {
						my.onSearchChange.trigger(searchString);
					} else {
						onResume = function() {
							my.onSearchChange.trigger(searchString);
						};
					}
				}, timeout);
			});
		};

		var delay = (function() {
			var timer = 0;
			return function(callback, ms) {
				clearTimeout (timer);
				timer = setTimeout(callback, ms);
			};
		})();

		return that;
	}

	return searchFieldWidget;
});
