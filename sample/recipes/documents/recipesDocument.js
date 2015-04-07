define([
	'widgetjs/core',
	'widgetjs/grid/searchFieldWidget',
	'widgetjs/grid/cardGridWidget',
	'widgetjs/grid/tableGridWidget',
	'widgetjs/grid/iconCardWidget',
	'widgetjs/grid/detailedCardWidget',
	'model/recipe',
	'model/recipeRepository'
], function (widgetjs, searchFieldWidget, cardGridWidget, tableGridWidget, iconCardWidget,
			 detailedCardWidget, recipeModel, recipeRepository) {

	/**
	 * List all recipes
	 */
	function recipesDocument(spec, my) {
		spec = spec || {};
		my = my || {};

		var that = widgetjs.widget(spec, my);

		var recipes = [];
		var views = ['Card', 'Icons', 'Table'];
		var activeView = "Card";

		/**
		 * Show all recipes in database
		 */
		that.showAll = function() {
			recipeRepository.findAll({
				onSuccess: function(allRecipes) {
					recipes = allRecipes;
					cardGrid.setSource(recipes);
					tableGrid.setSource(recipes);
					detailedCardGrid.setSource(recipes);
					that.update();
				}
			});
		};

		var search = searchFieldWidget();

		// TABLE GRID
		var tableGrid = tableGridWidget({
			source: recipes,
			orderBy: recipeModel.recipe.orderByName, // TODO: array with fields as argument
			searchOn: property('match'),
			//TODO: search: function(query) { return async... ]);
			columns: {
				'name' : {
					content: function(recipe) {
						return function(html) {
							html.a({href: my.linkTo('showRecipe', { recipeId: recipe.id })},
								html.img({style: 'height:30px', klass: 'img-circle', src: recipe.image }),
								html.b(' ', recipe.name)
							)
						}
					}
					//TODO: class: 'tada'
				},
				'source' : {
					title: 'Original source',
					value: property('source', linkify)
					//TODO: type: date/url/string/number/currency
					//TODO: orderable: false
				},
				'description' : property('description')

			}

		});
		search.applySearchOn(tableGrid);

		//TODO: Sortable columns => orderBy function?

		// CARDGRID ALTERNATIVE 1: Generic grid with specialized cards
		var cardGrid = cardGridWidget({
			source: recipes,
			searchOn: property('match'),
			orderBy: recipeModel.recipe.orderByName,
			card: iconCardWidget,
			fields: {
				'link': function(item) {
					return my.linkTo('showRecipe', { recipeId: item.id })
				},
				'label': property('name'),
				'icon': property('image')
			}
		});

		// CARDGRID ALTERNATIVE 2: specialized iconGrid ?
		//var cardGrid = iconGridWidget({
		//	source: recipes,
		//	'link': function(item) {
		//		return my.linkTo('showRecipe', { recipeId: item.id })
		//	},
		//	'label': property('name'),
		//	'icon': property('image')
		//});

		// cardGrid.asTable()?

		search.applySearchOn(cardGrid); //TODO: argument

		var bool = true;


		// ANOTHER EXAMPLE OF A GRID
		var detailedCardGrid = cardGridWidget({
			source: recipes,
			pageSize: 3,
			searchOn: property('match'),
			orderBy: recipeModel.recipe.orderByName,
			card: detailedCardWidget,
			fields: {
				'link': function(item) {
					return my.linkTo('showRecipe', { recipeId: item.id })
				},
				'label': property('name'),
				'icon': property('image'),
				'ingredients' : function(recipe) {
					return recipe.ingredients.length;
				},
				'instructions' : function(recipe) {
					return recipe.instructions.length;
				}
			}
		});

		search.applySearchOn(detailedCardGrid);

		that.renderViewSwitcherOn = function(html) {
			html.div({ klass: 'btn-group btn-group-xs', role: 'group',  'data-toggle': 'buttons'},
				views.map(function(viewName) {
					var activeClass = activeView === viewName ? 'active' : '';
					return html.div({
							klass: 'btn btn-primary ' + activeClass,
							click: function() {
								activeView = viewName;
								that.update();
							}
						},
						viewName
					)
				})
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

			html.div({style: 'margin-bottom:20px;'},
				search,
				html.div({ style: 'float:right'}, that.renderViewSwitcherOn)
			);

			if(activeView === 'Card') {
				html.div({klass: 'row'}, cardGrid);
				renderSortOrderOn(html);
			}

			if(activeView === 'Table') {
				html.div(html.hr(), tableGrid);
			}

			if(activeView === 'Icons') {
				html.div(html.hr(), detailedCardGrid);
			}

		};

		function linkify(url) {
			return function(html) {
				html.a({href: url}, url);
			}
		}

		function property(name, formatter) {
			return function(item) {
				if(formatter) {
					return formatter(item[name]);
				}
				return item[name];
			}
		}

		return that;
	}

	return recipesDocument;
});