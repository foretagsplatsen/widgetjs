define([
	'widgetjs/core',
	'model/recepies'
], function (widgetjs, recepies) {
	function recepiesDocument() {
		var that = widgetjs.widget();

		that.renderContentOn = function (html) {
			html.ul({klass: 'media-list'}, recepies.map(function(recipe) {
				return html.li({klass: 'media'},
					html.a({klass: 'pull-left', href: '#!/recipe/' + recipe.id},
						html.img({klass: 'media-object', src: recipe.image, style: 'width: 84px; height: 84px;'})
					),
					html.div({klass: 'media-body'},
						html.h4({klass: 'media-heading'}, recipe.name),
						'Lorem ipsum dolor sit amet, accusantium risus duis, leo volutpat sapien molestiae diam arcu arcu. '
					)
				);
			}));
		};

		return that;
	}

	return recepiesDocument;
});