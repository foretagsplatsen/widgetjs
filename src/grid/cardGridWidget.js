define([
	'./abstractGridWidget'
], function(abstractGridWidget) {

	/**
	 * `cardGridWidget` is
	 */
	function cardGridWidget(spec, my) {
		spec = spec || {};
		my = my || {};

		var that = abstractGridWidget(spec, my);

		my.card = spec.card;
		my.cardRenderer = spec.cardRenderer || defaultCardRenderer;

		//
		// Rendering
		//

		that.renderContentOn = function(html) {
			html.div({klass: 'card-grid'}).render(function(html) {
				html.div({klass: 'cards'},
					my.currentElements.map(function(element, index) {
						return my.cardRenderer({
							element: element,
							grid: that,
							index: index
						});
					})
				);

				if (my.source.hasMore()) {
					html.a({klass: 'btn btn-primary load-more'},
						'Load more'
					).click(my.getNextElements);
				}
			});
		};

		function defaultCardRenderer(options) {
			return my.card({
				grid: that,
				item: options.element,
				index: options.index
			});
		}

		return that;
	}

	return cardGridWidget;
});