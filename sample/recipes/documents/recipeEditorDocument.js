define([
	"widgetjs/widgetjs",
	"model/recipeRepository",
	"model/recipe"
], function(widgetjs, recipeRepository, recipeModel) {

	/**
	 * Editor for editing an existing recipe or creating a new.
	 */
	var recipeDocument = widgetjs.widget.subclass(function(that, my) {

		/**
		 * Recipe currently edited.
		 */
		var recipe;

		/**
		 * Show editor for existing recipe
		 *
		 * @param  {string} id If for recipe to edit
		 */
		that.edit = function(id) {
			recipeRepository.get({ id : id, onSuccess: function(item) {
				recipe = item;
				that.update();
			}});
		};

		/**
		 * Editor for a new recipe
		 */
		that.create = function() {
			recipe = recipeModel.recipe();
			that.update();
		};

		that.renderContentOn = function(html) {
			if(!recipe) {
				html.div({klass: "alert alert-info"}, "Recipe not found");
				return;
			}

			that.renderEditorOn(html);
		};

		that.renderEditorOn = function(html) {
			html.h1({klass: "page-header"}, "Recipe Editor");
			html.form({ id: "recipeForm", klass: "form-horizontal", role: "form" },
				that.formGroup("Id",
					that.inputField({ model: recipe, property: "id"})
				),

				that.formGroup("Name",
					that.inputField({ model: recipe, property: "name"})
				),

				that.formGroup("Source",
					that.inputField({ model: recipe, property: "source"})
				),

				that.formGroup("Image URL",
					// URL
					that.inputField({id: "image", model: recipe, property: "image",
						onChange: function() { jQuery("#image_preview").attr("src", jQuery("#image").val()); }
					}),
					// File drop Zone
					that.renderImageDropZoneOn,

					// Preview
					html.img({id: "image_preview", src: recipe.image, style: "height:140px"})
				),

				that.formGroup("Description",
					that.inputField({model: recipe, property: "description"})
				),

				that.formGroup("Ingrediences",
					that.editor({
						data: recipe.ingredients,
						fields: [
							{ name: "amount", label: "Amount" },
							{ name: "unit", label: "Unit"},
							{ name: "name", label: "Ingredient", klass:  "col-md-9" },
						],
						create :  function() {
							recipe.newIngredient();
							that.update();
						},
						remove: function(ingredient, index) {
							recipe.removeIngredientAtIndex(index);
							that.update();
						}
					})
				),

				that.formGroup("Instructions",
					that.editor({
						data: recipe.instructions,
						fields: [
							{ name: "text", label: "Instruction", klass:  "col-md-11" }
						],
						create :  function() {
							recipe.newInstruction();
							that.update();
						},
						remove: function(ingredient, index) {
							recipe.removeInstructionAtIndex(index);
							that.update();
						}
					})
				),


				that.formGroup("", that.renderFormActionsOn)
			);
		};

		/**
		 * Render row with form buttons
		 */
		that.renderFormActionsOn = function(html) {
			html.div({klass: "well well-sm"},
				html.span(
					// Save Button
					html.button({klass: "btn btn-default"}, "Save Recipe").click(function() {
						recipeRepository.save({model: recipe, onSuccess: function() {
							my.redirectTo("showRecipe", {recipeId: recipe.id});
						}});
					}),
					" or ",

					// Cancel Button
					html.a({ href: recipe.id ? my.linkTo("showRecipe", {recipeId: recipe.id}) : my.linkTo("recipes") }, "Cancel")
				),

				html.span({ klass: "pull-right"},
					// Delete Button
					html.button({klass: "btn btn-danger"}, "Delete Recipe").click(function() {
						recipeRepository.remove({model: recipe, onSuccess: function() {
							my.redirectTo("recipes");
						}});
					})
				)
			);
		};

		/**
		 * Create a Twitter Boostrap form-group with a "label" as control-label and
		 * any other argument supplied as content in right hand column.
		 *
		 * @param  {string} label		Value of control-label element
		 * @param  {...object} content	Any object appendable to div brush
		 *
		 * @return {htmlRenderer}
		 */
		that.formGroup = function(label) {
			var content = Array.prototype.slice.call(arguments, 1);
			return function(html) {
				html.div({ klass: "form-group" },
					html.label({ klass: "col-sm-2 control-label"}, label),
					html.div({ klass: "col-sm-10"}, content)
				);
			};
		};

		/**
		 * Create an input field bound to a property on a model object. Property is updated
		 * when input is changed or blured.
		 *
		 * @param {object} options.model		Model
		 * @param {string} options.property		Name of property on model
		 * @param {function} options.onChange	Optional callback to execute when input change
		 * @param {string} options.id			Optional id to set as attribute on input element
		 *
		 * @return {htmlRenderer}
		 */
		that.inputField  = function(options) {
			var input;
			var onInputChange = function() {
				options.model[options.property] = input.asJQuery().val();
				if(options.onChange) { options.onChange(); }
			};

			return function(html) {
				input = html.input({ id: options.id || my.nextId(), klass: "form-control", value: options.model[options.property]});
				input.blur(onInputChange);
				input.change(onInputChange);
			};
		};

		/**
		 * Create an editor for an array where each item is a row in a table, columns are properties in item model
		 * and cells are inputFields for item properties.
		 *
		 * @param  {object} options.data		Array with items to bind to
		 * @param  {object} options.fields		Editable feilds
		 * @param  {object} options.create		Callback that should append an new element when executed
		 * @param  {object} options.fields		Callback that should remove element given as argument when executed.
		 *
		 * @return {htmlRenderer}
		 */
		that.editor = function(options) {
			return function(html) {
				html.table({ klass: "table"},
					// Field labels as column headings
					html.thead(
						html.tr(options.fields.map(function(field) {
							return html.th(field.label);
						}))
					),

					// Data items as rows
					html.tbody(options.data.map(function(data, index) {
						return html.tr(
							options.fields.map(function(field) {
								// Each cell is a inputField bound to item property
								var td = html.td(that.inputField({ model: data, property: field.name }));
								if(field.klass) {
									td.addClass(field.klass);
								}
								return td;
							}),
							// A delete button for each row
							html.td(html.a({klass: "btn"}, html.span({klass: "glyphicon glyphicon-minus-sign"})).click(function() {
								options.remove(data, index);
							}))
						);
					}))
				);

				// A create button to add more items
				html.a({klass: "btn"}, html.span({klass: "glyphicon glyphicon-plus"}), " Add new").click(options.create);
			};
		};

		/**
		 * Creates a div where mage files can be droped. Droped images get converted into a
		 * Data URL and set as value on #image inputField
		 *
		 * @return {htmlRenderer}
		 */
		that.renderImageDropZoneOn = function(html) {
			function noPropagation (e) {
				e.stopPropagation();
				e.preventDefault();
			}

			html.div({id: "imagedrop_zone", klass: "drop_zone"}, "Drop files here")
				.dragover(noPropagation)
				.dragenter(noPropagation)
				.drop(function(e) {
					if(!(e.originalEvent.dataTransfer &&
						e.originalEvent.dataTransfer.files.length)) {
						return;
					}

					noPropagation(e);

					// Read file as Data URL and set result on #image
					var files = Array.prototype.slice.call(e.originalEvent.dataTransfer.files);
					files.forEach(function(file) {
						if (!file.type.match(/image.*/)) {
							return;
						}

						var reader = new FileReader();
						reader.onload = function() {
							jQuery("#image").val(reader.result).change();
						};

						reader.readAsDataURL(file);
					});
				}
			);
		};
	});

	return recipeDocument;
});
