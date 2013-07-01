define(
	[
		'./router/url.js',
		'./router/route.js',
		'./router/router.js'
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
