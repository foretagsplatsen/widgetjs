import url from "./router/url.js";
import route from "./router/route.js";
import router from "./router/router.js";

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
