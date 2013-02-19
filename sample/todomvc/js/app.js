require.config({
	paths: {
		'jquery': '../../../components/jquery/jquery',
		'widgetjs': '../../../dist/WidgetJS.min'
	}
});

define(
	[
		'widgetjs'
	],
	function (widgetjs) {
		var controller = widgetjs.router.controller;

		var app = (function() {
			var my = {};
			var that = widgetjs.widget({}, my);

			that.renderContentOn = function (html) {

				html.section({id: 'todoapp'},
					html.header({id: 'header'},
						html.h1('todos'),
						html.input({id: 'new-todo', autofocus : '', placeholder : 'What needs to be done?'})
					),

					html.section({id: 'main'},
						html.input({id: 'toggle-all', type: 'checkbox'}),
						html.label({'for': 'toggle-all'}, 'Mark all as complete'),

						html.ul({ id : 'todo-list'},
							html.li({'class' : 'completed'},
								html.div({'class' : 'view'},
									html.input({ 'class' : 'toggle', type : 'checkbox', 'checked' : ''}),
									html.label('Create a TodoMVC template'),
									html.button({'class' : 'destroy'})
								),
								html.input({'class' : 'edit', value : 'Create a TodoMVC template'})
							),
							html.li(
								html.div({'class' : 'view'},
									html.input({ 'class' : 'toggle', type : 'checkbox'}),
									html.label('Rule of the web'),
									html.button({'class' : 'destroy'})
								),
								html.input({'class' : 'edit', value : 'Rule of the web'})
							)
						)
					),

					html.footer({id: 'footer'},
						html.span({id: 'todo-count'}, html.strong('1'), ' item left'),
						html.ul({id: 'filters'},
							html.li(html.a({'class' : 'selected'}, 'All').href(my.linkTo(''))),
							html.li(html.a('Active').href(my.linkTo('active'))),
							html.li(html.a('Completed').href(my.linkTo('completed')))
						),
						html.button({id: 'clear-completed'}, 'Clear completed (1)')
					)
				);

				html.footer({id: 'info'},
					html.p('Double-click to edit a todo'),
					html.p('Template by ', html.a('Henrik Wallström').href('http://github.com/whenrik')),
					html.p('Created by ', html.a('Henrik Wallström').href('http://github.com/whenrik')),
					html.p('Part of ', html.a('TodoMVC').href('http://todomvc.com'))
				);
			};

			// Routing
			controller.on('', function() { console.log('all');});
			controller.on('active', function() { console.log('active');});
			controller.on('completed', function() { console.log('completed');});

			return that;
		})();

		// start-up
		controller.register();
		app.appendTo('body');
		widgetjs.router.router.start();
	}
);