define([
	'widgetjs/core'
], function (widgetjs, shared) {

	function navigationWidget(spec, my) {
		spec = spec || {};
		my = my || {};

		var that = widgetjs.widget(spec, my);

		var brand = spec.brand || '';

		that.activeItem = 'home';
		that.items = [];

		that.activate = function(id) {
			that.activeItem = id;
			that.update();
		};

		that.renderContentOn = function (html) {
			html.div({ klass: 'navbar navbar-default navbar-fixed-top' },
				html.div({ klass: 'container'},
					html.div({ klass: 'navbar-header'},
						/* navbar toggle button */
						html.button({ type: 'button', klass: 'navbar-toggle', 'data-toggle': 'collapse', 'data-target': '.navbar-collapse'},
							html.span({ klass: 'icon-bar' }),
							html.span({ klass: 'icon-bar' }),
							html.span({ klass: 'icon-bar' })
						),
						html.a({ href: '#!/', klass: 'navbar-brand' }, brand)
					),
					html.div({ klass: 'navbar-collapse collapse'},
						html.ul({ klass: 'nav navbar-nav' }, that.items.map(function(item) {
							var li = html.li(html.a({ href: item.href }, item.label));

							if(item.id === that.activeItem) {
								li.addClass('active');
							}

							return li;
						}))
					)
				)
			);
		};

		return that;
	}

	return navigationWidget;
});