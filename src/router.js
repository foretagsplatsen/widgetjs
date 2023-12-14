import url from "./router/url.js";
import route from "./router/route.js";
import router from "./router/router.js";

var routerSingleton = router();

export default {
	url: url,
	route: route,
	router: router,
	getRouter: function () {
		return routerSingleton;
	},
	setRouter: function (newRouter) {
		routerSingleton = newRouter;
	},
};
