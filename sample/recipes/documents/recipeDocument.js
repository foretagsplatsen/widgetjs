define([
	"widgetjs/widgetjs",
	"model/recipeRepository"
], function(widgetjs, recipeRepository) {

	/**
	 * Page for a single recipe
	 */
	var recipeDocument = widgetjs.widget.subclass(function(that, my) {

		var recipe;

		/**
		 * Show a recipe
		 *
		 * @param  {string} id Id for recipe to show
		 */
		that.show = function(id) {
			recipeRepository.get({ id : id, onSuccess: function(item) {
				recipe = item;
				that.update();
			}});
		};

		that.renderContentOn = function(html) {
			if(!recipe) {
				html.div({klass: "alert alert-info"}, "Recipe not found");
				return;
			}

			html.div({klass: "row"},
				// Image
				html.div({klass: "col-xs-12 col-md-4 col-md-push-8"},
					html.img({klass: "img-responsive img-circle", src: recipe.image})
				),

				// Recipe
				html.div({klass: "col-xs-12 col-md-8 col-md-pull-4"},
					html.h1(recipe.name),
					html.p(recipe.description),
					html.p(html.strong("source: "), html.a({ href: recipe.source, target: "_blank"}, recipe.source)),

					html.h3("Ingredients"),
					html.ul(recipe.ingredients.map(function(ingredient){
						return html.li(ingredient.toString());
					})),

					html.h3("Instructions"),
					html.ol(recipe.instructions.map(function(instruction){
						return html.li(instruction.toString());
					})),

					html.a({ klass: "btn", href: my.linkTo("editRecipe", {recipeId: recipe.id})}, html.span({klass: "glyphicon glyphicon-pencil"}), " Edit")
				)
			);
		};
	});

	return recipeDocument;
});
