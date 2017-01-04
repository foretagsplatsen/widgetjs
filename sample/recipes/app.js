define([
    "widgetjs/widgetjs",
    "widgetjs/router",
    "documents",
    "widgets",
    "jquery",
    "bootstrap"
], function(widgetjs, router, documents, widgets, jQuery) {

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
    var app = widgetjs.widget.subclass(function(that, my) {

        /** @type {navigationWidget} Main navigation for application. */
        var navigation;

        /** @type {regionWidget} Displays the current document */
        var mainRegion;

        /**
         * Registers routes and creates menu items using addAction() my once on
         start-up to initilize the application.
        */
        my.initialize = function(spec) {
            my.super(spec);
            /** @type {navigationWidget} Main navigation for application. */
            navigation = widgets.navigationWidget({brand : "My Recipes"});

            /** @type {regionWidget} Displays the current document */
            mainRegion = widgets.regionWidget();

            that.addAction({
                name: "recipes",
                pattern: "",
                action: function(recipes) {
                    recipes.showAll();
                },
                doc: documents.recipesDocument,
                menuLabel: "Recipes",
                menuId: "recipes"
            });

            that.addAction({
                name: "showRecipe",
                pattern: "recipe/#recipeId",
                action: function(recipe, recipeId) {
                    recipe.show(recipeId);
                },
                doc: documents.recipeDocument,
                menuId: "recipes"
            });

            that.addAction({
                name: "editRecipe",
                pattern: "recipe/#recipeId/edit",
                action: function(recipeEditor, recipeId) {
                    recipeEditor.edit(recipeId);
                },
                doc: documents.recipeEditorDocument,
                menuId: "recipes"
            });

            that.addAction({
                name: "createRecipe",
                pattern: "create/recipe",
                action: function(recipeEditor) {
                    recipeEditor.create();
                },
                doc: documents.recipeEditorDocument,
                menuId: "recipes"
            });

            that.addAction({
                name: "export",
                pattern: "export",
                doc: documents.exportDocument,
                menuLabel: "Export"
            });

            that.addAction({
                name: "about",
                pattern: "about",
                doc: documents.aboutDocument,
                menuLabel: "About",
            });

            // Render our self on BODY
            that.appendTo("body");

            // Log route events
            my.router.on("routeMatched", function(result) {
                console.log(result.getRoute().toString(), "matched url", result.getUrl().toString());
            });

            // Route not found
            my.router.on("routeNotFound", function(url) {
                alert("Page not found: " + url);
                my.redirectTo("");
            });

            my.router.start();
        };

        /**
         * Helper that sets-up a route for a document action and
         * a entry in the navigation widget.
         *
         * @param {string} options.doc      Document to attach to action
         * @param {string} options.pattern  Route pattern to match URLs against.
         * @param {string} options.action   Callback to execute on match. First argument to callback is doc
         *                                  thereafter parameters in same order as defined in pattern. (optional)
         * @param {string} options.label    Label for navigation item. If omitted no item is created (optional)
         * @param {string} options.id       Identifier for navigation item to show on route match. (optional)
         * @param {object} options.values   Key-Value object with default values for route parameters
         *                                  to use in menu link.
         */
        that.addAction = function(options) {
            var menuId = options.menuId || my.nextId(),
                doc = options.doc;

            var route = my.router.addRoute({ pattern: options.pattern, name: options.name});
            route.matched.register(function(result) {
                if(options.action) {
                    options.action.apply(my.router, [doc].concat(result.getActionArguments()));
                }

                navigation.activate(menuId);
                mainRegion.set(doc);
                jQuery("html, body").animate({ scrollTop: 0}, 200);
            });

            if(options.menuLabel) {
                var url = route.expand(options.values || {});
                navigation.items.push({ id: menuId, href: my.router.linkToUrl(url), label: options.menuLabel });
            }
        };

        that.renderOn = function(html) {
            html.render(navigation);
            html.div({klass: "container" }, mainRegion);
        };
    });

    return app;
});
