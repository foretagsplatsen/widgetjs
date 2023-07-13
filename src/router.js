import route from "./router/route";
import router from "./router/router";
import url from "./router/url";

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
