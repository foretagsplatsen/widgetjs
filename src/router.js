define(
	[
		'./router/url',
		'./router/route',
		'./router/router'
	],

	function (url, route, router) {
		return {
			url: url,
			route: route,
			router: router.router,
			controller: router.controller
		};
	}
);
