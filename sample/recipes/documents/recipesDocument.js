define([
	"widgetjs/widgetjs",
	"model/recipeRepository"
], function(widgetjs, recipeRepository) {

	/**
	 * List all recipes
	 */
	var recipesDocument = widgetjs.widget.subclass(function(that, my) {

		var recipes = [];

		/**
		 * Show all recipes in database
		 */
		that.showAll = function() {
			recipeRepository.findAll({
				onSuccess: function(allRecipes) {
					recipes = allRecipes;
					that.update();
				}
			});
		};

		that.renderContentOn = function(html) {
			html.div({klass: "row"}, recipes.map(function(recipe, index) {
				return function(html) {
					html.div({klass: "recipe-card col-xs-6 col-sm-2"},
						html.a({href: my.linkTo("showRecipe", { recipeId: recipe.id })},
							html.img({klass: "img-responsive img-thumbnail", src: recipe.image })
						),
						html.h5(html.a({href: my.linkTo("showRecipe", { recipeId: recipe.id })}, recipe.name))
					);

					// Break rows every 6th item on desktop
					if((index + 1) % 6 === 0) {
						html.div({klass: "clearfix visible-sm visible-md visible-lg"});
					}

					// and every 2nd on phone
					if((index + 1) % 2 === 0) {
						html.div({klass: "clearfix visible-xs"});
					}
				};
			}));
		};
	});

	return recipesDocument;
});
