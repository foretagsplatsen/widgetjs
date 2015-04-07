define([], function () {

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
	function recipeIngredient(spec) {
		var that = {};

		that.name = spec.name;
		that.amount = spec.amount;
		that.unit = spec.unit;

		that.toString = function() {
			return '' + that.amount + ' ' + that.unit + ' ' + that.name;
		};

		return that;
	}

	/**
	 * Recipe instruction
	 *
	 * @param  {object} spec
	 * @param  {string} spec.text
	 *
	 * @return {object} instruction object
	 */
	function recipeInstruction(spec) {
		var that = {};

		that.text = spec.text;

		that.toString = function() {
			return spec.text;
		};

		return that;
	}

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
	function recipe(spec) {
		spec = spec || {};

		var id = spec.id || '',
			image = spec.image || '',
			name = spec.name || '',
			source = spec.source,
			description = spec.description || '',
			instructions = spec.instructions && spec.instructions.map(function(instructionSpec) {
				return recipeInstruction(instructionSpec);
			}) || [],
			ingredients = spec.ingredients && spec.ingredients.map(function(ingredientSpec) {
				return recipeIngredient(ingredientSpec);
			}) || [];

		var that = {};

		that.id = id;
		that.name = name;
		that.source = source;
		that.image = image;
		that.description = description;

		that.instructions = instructions;
		that.ingredients = ingredients;

		that.newIngredient = function() {
			ingredients.push(recipeIngredient({name: '', amount: '', unit: ''}));
		};

		that.removeIngredientAtIndex = function(index) {
			ingredients.splice(index, 1);
		};

		that.newInstruction = function() {
			instructions.push(recipeInstruction({text: ' '}));
		};

		that.removeInstructionAtIndex = function(index) {
			instructions.splice(index, 1);
		};

		that.match = function(search) {
			return name.indexOf(search) > 0 ||
				description.indexOf(search) > 0;
		};

		return that;
	}

	recipe.orderByName = function(a, b) {
		return a.name > b.name ? 1 : (a.name > b.name ? -1 : 0);
	};

	return {
		recipe: recipe,
		ingredient: recipeIngredient,
		instruction: recipeInstruction
	};

});