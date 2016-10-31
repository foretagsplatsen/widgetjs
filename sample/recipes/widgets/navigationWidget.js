define([
	"widgetjs/widgetjs"
], function(widgetjs, shared) {

	var navigationWidget = widgetjs.widget.subclass(function(that, my) {

		var brand;

		my.initialize = function(spec) {
			my.super(spec);
			brand = spec.brand || "";

			that.activeItem = "home";
			that.items = [];
		};

		that.activate = function(id) {
			that.activeItem = id;
			that.update();
		};

		that.renderContentOn = function(html) {
			html.div({ klass: "navbar navbar-default navbar-fixed-top" },
				html.div({ klass: "container"},
					html.div({ klass: "navbar-header"},
						/* navbar toggle button */
						html.button({ type: "button", klass: "navbar-toggle", "data-toggle": "collapse", "data-target": ".navbar-collapse"},
							html.span({ klass: "icon-bar" }),
							html.span({ klass: "icon-bar" }),
							html.span({ klass: "icon-bar" })
						),
						html.a({ href: my.linkTo("recipes"), klass: "navbar-brand" }, brand)
					),
					html.div({ klass: "navbar-collapse collapse"},
						html.ul({ klass: "nav navbar-nav" }, that.items.map(function(item) {
							var li = html.li(html.a({ href: item.href }, item.label));

							if(item.id === that.activeItem) {
								li.addClass("active");
							}

							return li;
						})),
						html.form({klass: "navbar-form navbar-right"},
							html.a({klass: "btn btn-primary pull-right", href: my.linkTo("createRecipe") }, "Create")
						)

					)
				)
			);
		};
	});

	return navigationWidget;
});
