define([
	'widgetjs/core',
	'widgetjs/grid/searchFieldWidget',
	'widgetjs/grid/cardGridWidget',
	'model/recipeRepository'
], function (widgetjs, searchFieldWidget, cardGridWidget, recipeRepository) {

	/**
	 * List all recipes
	 */
	function recipesDocument(spec, my) {
		spec = spec || {};
		my = my || {};

		var that = widgetjs.widget(spec, my);

		var recipes = [];

		/**
		 * Show all recipes in database
		 */
		that.showAll = function() {
			recipeRepository.findAll({
				onSuccess: function(allRecipes) {
					recipes = allRecipes;
					cardGrid.setSource(recipes);
					that.update();
				}
			});
		};

		var search = searchFieldWidget();

		var cardGrid = cardGridWidget({
			source: recipes,
			pageSize: 6,
			searchableString: function(recipe) {
				return recipe.name;
			},
			orderBy: function(a, b) {
				return a.name > b.name ? 1 : (a.name > b.name ? -1 : 0);
			},
			cardRenderer: function(spec) { //TODO: Spec?
				var recipe = spec.element;
				var index = spec.index;

				return function(html) {
					html.div({klass: 'recipe-card col-xs-6 col-sm-2'},
						html.a({href: my.linkTo('showRecipe', { recipeId: recipe.id })},
							html.img({klass: 'img-responsive img-thumbnail', src: recipe.image })
						),
						html.h5(html.a({href: my.linkTo('showRecipe', { recipeId: recipe.id })}, recipe.name))
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
			}
		});
		search.applySearchOn(cardGrid);

		var bool = true;

		that.renderViewSwitcherOn = function(html) {
			html.div({ klass: 'btn-group',  'data-toggle': 'buttons'},
				html.label({klass: 'btn btn-primary active'}, html.input({type: 'radio', name: 'view'},  'Icons')),
				html.label({klass: 'btn btn-primary'}, html.input({type: 'radio', name: 'view'}, 'Card')),
				html.label({klass: 'btn btn-primary'}, html.input({type: 'radio', name: 'view'}, 'Table'))
			);
		};

		function renderSortOrderOn(html) {
			html.a('Reverse order').click(function () {
				if (bool) {
					cardGrid.setOrderBy(function (a, b) {
						return a.name < b.name ? 1 : (a.name > b.name ? -1 : 0);
					});
				} else {
					cardGrid.setOrderBy(function (a, b) {
						return a.name < b.name ? -1 : (a.name > b.name ? 1 : 0);
					});
				}
				bool = !bool;
			});
		}

		that.renderContentOn = function (html) {
			that.renderViewSwitcherOn(html);
			html.render(search);
			html.div({klass: 'row'}, cardGrid);
			renderSortOrderOn(html);
		};

		return that;
	}

	return recipesDocument;
});