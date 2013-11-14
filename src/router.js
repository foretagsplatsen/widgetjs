define(
	[
		'./router/url',
		'./router/route',
		'./router/router',
		'./router/deprecatedRouter'
	],

	function (url, route, router, deprecatedRouter) {
		return {
			url: url,
			route: route,
			router: deprecatedRouter.router,
			controller: deprecatedRouter.controller,
			newRouter: router
		};
	}
);
