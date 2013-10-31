define([
	'widgetjs/core',
	'model/recepies'
], function (widgetjs, recepies) {
	function recipeDocument() {
		var that = widgetjs.widget();

		var recipe;

		that.show = function(id) {
			recipe = recepies.filter(function(item) {
				return item.id === id;
			})[0];

			that.update();
		};

		that.renderContentOn = function (html) {
			if(!recipe) {
				html.div({klass: 'alert alert-info'}, 'Recipe not found');
				return;
			}

			html.div({klass: 'media'},
				html.a({klass: 'pull-left', href: '#!/recipe/' + recipe.id},
					html.img({klass: 'media-object', src: recipe.image, style: 'width: 64px; height: 64px;'})
				),
				html.div({klass: 'media-body'},
					html.h4({klass: 'media-heading'}, recipe.name),
					'Lorem ipsum dolor sit amet, accusantium risus duis, leo volutpat sapien molestiae diam arcu arcu. '
				)
			);
		};

		return that;
	}

	return recipeDocument;
});