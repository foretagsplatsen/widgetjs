define([
	"klassified",
	"jquery",
	"jstorage",
	"model/defaultRecipesData",
	"model/recipe"
], function(klassified, jQuery, jstorage, defaultRecepies, recipe) {

	/**
	 * Repository data store data using http://www.jstorage.info/
	 */
	var jStorageRepository = klassified.object.subclass(function(that, my) {

		my.initialize = function(spec) {
			my.super(spec);
			my.model = spec.model;
			my.prefix = spec.prefix || "";
		};

		// Protected API

		my.key = function(key) {
			return my.prefix + key;
		};

		my.storageGet = function(options) {
			if(!options.id || !options.onSuccess) {
				throw new Error("Option \"id\" and \"onSuccess\" are required");
			}

			options.onSuccess(my.dataToModel(jQuery.jStorage.get(my.key(options.id))));
		};

		my.storageFindAll = function(options) {
			if(!options.onSuccess ) {
				throw new Error("Option \"onSuccess\" is required");
			}

			options.onSuccess(jQuery.jStorage.index()
				.filter(function(key) {
					return key.indexOf(my.prefix) === 0;
				})
				.map(function(key) {
					return my.dataToModel(jQuery.jStorage.get(key));
				})
			);
		};

		my.storageSave = function(options) {
			if(!options.model) {
				throw new Error("Option \"model\" is required");
			}

			options.id = options.id || options.model.id;
			if(!options.id) {
				throw new Error("Option \"id\" or \"model.id\" is required");
			}

			jQuery.jStorage.set(my.key(options.id), options.model);

			if(options.onSuccess) options.onSuccess(options.model);
		};

		my.storageUpdate = function(options) {
			if(!options.model) {
				throw new Error("Option \"model\" is required");
			}

			options.id = options.id || options.model.id;
			if(!options.id) {
				throw new Error("Option \"id\" or \"model.id\" is required");
			}

			jQuery.jStorage.set(my.key(options.id), options.model);

			if(options.onSuccess) options.onSuccess(options.model);
		};

		my.storageRemove = function(options) {
			options.id = options.id || options.model.id;
			if(!options.id) {
				throw new Error("Option \"id\" or \"model.id\" is required");
			}

			jQuery.jStorage.deleteKey(my.key(options.id));

			if(options.onSuccess) options.onSuccess();
		};


		my.storageEmpty = function(options) {
			jQuery.jStorage.index()
				.filter(function(key) {
					return key.indexOf(my.prefix) === 0;
				})
				.map(function(key) {
					return jQuery.jStorage.deleteKey(key);
				});

			if(options.onSuccess) options.onSuccess();
		};

		my.modelToData = function(entity) {
			return JSON.stringify(entity);
		};

		my.dataToModel = function(data) {
			if(!my.model) {
				return data; // return data object-literal as default
			}

			if(Array.isArray(data)) {
				return data.map(function(entry) {
						objects.add(my.model(entry));
				});
			}

			return my.model(data);
		};

		// Public API (override in specialized repositories)

		that.get = my.storageGet;
		that.findAll = my.storageFindAll;
		that.save = my.storageSave;
		that.update  = my.storageUpdate;
		that.remove = my.storageRemove;
		that.empty = my.storageEmpty;
	});

	/**
	 * jStorageRepository
	 *
	 * @exports recipeRepository
	 */
	var recipeRepository = jStorageRepository.subclass(function(that, my) {

		my.initialize = function(spec) {
			my.super(spec);
			my.prefix = "myrecipe";
			my.model = recipe.recipe;
		};

		// Pre-populate with default data if empty
		that.findAll({ onSuccess: function(recipes) {
			if(recipes.length <= 0) {
				saveDefaultRecipes();
			}
		}});

		function saveDefaultRecipes() {
			defaultRecepies.forEach(function(recipe) {
				that.save({model: recipe});
			});
		}
	});

	return recipeRepository();
});
