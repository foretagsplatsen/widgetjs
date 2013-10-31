define([
	'widgetjs/core',
	'widgetjs/router/router',
	'documents',
	'widgets',
	'jquery',
	'boostrap'
], function (widgetjs, router, documents, widgets, jQuery) {

	function app (spec, my) {
		spec = spec || {};
		my = my || {};

		var that = widgetjs.widget(spec, my);

		var navigation = widgets.navigationWidget({brand : 'My Recipes'});
		var mainRegion = widgets.regionWidget();

		that.initialize = function () {
			// Setup routes
			my.router = router();

			that.addAction({
				pattern: '/',
				doc: documents.recipesDocument,
				label: 'Recipes',
			});

			that.addAction({
				pattern: '/recipe/#id',
				doc: documents.recipeDocument,
				action: function(doc, id) {
					doc.show(id);
				}
			});

			that.addAction({
				pattern: '/about',
				label: 'About',
				doc: documents.aboutDocument
			});

			// Render our self on BODY
			that.appendTo('body');

			my.router.start();
		};

		that.addAction = function (options) {
			var id = options.id || my.nextId(),
				doc = options.doc;

			var route = my.router.addRoute({ pattern: options.pattern, action: function() {
				// Forward action to callback with document as first argument
				if(options.action) {
					var params = Array.prototype.slice.call(arguments);
					params.unshift(doc);
					options.action.apply(this, params);
				}

				// Activate menu item and show
				navigation.activate(id);
				mainRegion.set(doc);
			}});

			if(options.label) {
				var url = route.expand(options.values || {});
				navigation.items.push({ id: id, href: my.router.linkTo(url), label: options.label });
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