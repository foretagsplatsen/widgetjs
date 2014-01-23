define([
	'widgetjs/core',
	'widgetjs/router',
	'documents',
	'widgets',
	'jquery',
	'boostrap'
], function (widgetjs, router, documents, widgets, jQuery) {

	/**
	 * Recipe application concists of the following views/documents:
	 *
	 * - recipesDocument : Displays all recipes
	 * - recipeDocument : Display as single recipe
	 * - recipeEditorDocument : An editor for creating new recipes or edit existing
	 * - exportDocument : Import/Export document from/to JSON
	 * - aboutDocument : Info on the sample
	 *
	 * @exports app
	 */
	function app (spec, my) {
		spec = spec || {};
		my = my || {};

		var that = widgetjs.widget(spec, my);

		/** @type {navigationWidget} Main navigation for application. */
		var navigation = widgets.navigationWidget({brand : 'My Recipes'});

		/** @type {regionWidget} Displays the current document */
		var mainRegion = widgets.regionWidget();

		/**
		 * Registers routes and creates menu items using addAction()
		 * Executed once on start-up to initialize the application.
		 */
		that.initialize = function () {
			my.router = router.router;

			that.addAction({
				pattern: '',
				action: function(recipes) {
					recipes.showAll();
				},
				doc: documents.recipesDocument,
				menuLabel: 'Recipes',
				menuId: 'recipes'
			});

			that.addAction({
				pattern: 'recipe/#recipeId',
				action: function(recipe, recipeId) {
					recipe.show(recipeId);
				},
				doc: documents.recipeDocument,
				menuId: 'recipes'
			});

			that.addAction({
                name: 'editRecipe',
				pattern: 'recipe/#recipeId/edit',
				action: function(recipeEditor, recipeId) {
					recipeEditor.edit(recipeId);
				},
				doc: documents.recipeEditorDocument,
				menuId: 'recipes'
			});

			that.addAction({
				pattern: 'create/recipe',
				action: function(recipeEditor) {
					recipeEditor.create();
				},
				doc: documents.recipeEditorDocument,
				menuId: 'recipes'
			});

			that.addAction({
				pattern: 'export',
				doc: documents.exportDocument,
				menuLabel: 'Export'
			});

			that.addAction({
				pattern: 'about',
				doc: documents.aboutDocument,
				menuLabel: 'About',
			});

			// Render our self on BODY
			that.appendTo('body');

			// Log route events
			my.router.on('routeMatched', function(result) {
				console.log(result.getRoute().toString(), 'matched url', result.getUrl().toString());
			});

			// Route not found
			my.router.on('routeNotFound', function(url) {
				alert('Page not found: ' + url);
				my.redirectTo('');
			});

			my.router.start();
		};

		/**
		 * Helper that sets-up a route for a document action and
		 * a entry in the navigation widget.
		 *
		 * @param {string} options.doc		Document to attach to action
		 * @param {string} options.pattern	Route pattern to match URLs against.
		 * @param {string} options.action	Callback to execute on match. First argument to callback is doc
		 *									thereafter parameters in same order as defined in pattern. (optional)
		 * @param {string} options.label	Label for navigation item. If omitted no item is created (optional)
		 * @param {string} options.id		Identifier for navigation item to show on route match. (optional)
		 * @param {object} options.values	Key-Value object with default values for route parameters
		 *									to use in menu link.
		 */
		that.addAction = function (options) {
			var menuId = options.menuId || my.nextId(),
				doc = options.doc;

			var route = my.router.addRoute({ pattern: options.pattern, name: options.name });
			route.on('matched', function(result) {
				if(options.action) {
					options.action.apply(my.router, [doc].concat(result.getCallbackArguments()));
				}

				navigation.activate(menuId);
				mainRegion.set(doc);
				jQuery('html, body').animate({ scrollTop: 0}, 200);
			});

            route.on('answer', function(success, callback, result) {
                navigation.activate(menuId);
                mainRegion.set(doc);

                callback(result);
            });

			if(options.menuLabel) {
				var url = route.expand(options.values || {});
				navigation.items.push({ id: menuId, href: my.router.linkTo(url), label: options.menuLabel });
			}
		};

		that.renderOn = function (html) {
			html.render(navigation);
			html.div({klass: 'container' }, mainRegion);
		};

		return that;
	}

	return app;
});