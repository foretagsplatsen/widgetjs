import route from "./router/route.js";
import router from "./router/router.js";
import url from "./router/url.js";

let routerSingleton = router();

export default {
	url,
	route,
	router,
	getRouter: function () {
		return routerSingleton;
	},
	setRouter: function (newRouter) {
		routerSingleton = newRouter;
	},
};
