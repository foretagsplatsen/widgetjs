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

		my.cardRenderer = spec.cardRenderer;

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

		return that;
	}

	return cardGridWidget;
});