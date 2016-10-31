define([
	"klassified"
], function(klassified) {

	/**
	 * Ingredience in recipe
	 *
	 * @param  {object} spec
	 * @param  {string} spec.name
	 * @param  {number} spec.amount
	 * @param  {string} spec.unit
	 *
	 * @return {object} ingredient object
	 */
	var recipeIngredient = klassified.object.subclass(function(that, my) {

		my.initialize = function(spec) {
			my.super(spec);
			that.name = spec.name;
			that.amount = spec.amount;
			that.unit = spec.unit;
		};

		that.toString = function() {
			return "" + that.amount + " " + that.unit + " " + that.name;
		};
	});

	/**
	 * Recipe instruction
	 *
	 * @param  {object} spec
	 * @param  {string} spec.text
	 *
	 * @return {object} instruction object
	 */
	var recipeInstruction = klassified.object.subclass(function(that, my) {

		my.initialize = function(spec) {
			my.super(spec);
			that.text = spec.text;
		};

		that.toString = function() {
			return that.text;
		};
	});

	/**
	 * Recipe
	 *
	 * @param  {object} spec
	 * @param  {string} spec.id
	 * @param  {string} spec.name
	 * @param  {string} spec.source Source URL
	 * @param  {string} spec.description
	 * @param  {array} spec.instructions
	 * @param  {array} spec.ingredients
	 *
	 * @return {[type]}      [description]
	 */
	var recipe = klassified.object.subclass(function(that, my) {

		my.initialize = function(spec) {
			my.super(spec);
			that.id = spec.id || "";
			that.image = spec.image || "";
			that.name = spec.name || "";
			that.source = spec.source;
			that.description = spec.description || "";
			that.instructions = spec.instructions && spec.instructions.map(function(instructionSpec) {
				return recipeInstruction(instructionSpec);
			}) || [];
			that.ingredients = spec.ingredients && spec.ingredients.map(function(ingredientSpec) {
				return recipeIngredient(ingredientSpec);
			}) || [];
		};

		that.newIngredient = function() {
			that.ingredients.push(recipeIngredient({name: "", amount: "", unit: ""}));
		};

		that.removeIngredientAtIndex = function(index) {
			that.ingredients.splice(index, 1);
		};

		that.newInstruction = function() {
			that.instructions.push(recipeInstruction({text: " "}));
		};

		that.removeInstructionAtIndex = function(index) {
			that.instructions.splice(index, 1);
		};
	});

	return {
		recipe: recipe,
		ingredient: recipeIngredient,
		instruction: recipeInstruction
	};
});
