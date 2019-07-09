import url from "./router/url";
import route from "./router/route";
import router from "./router/router";

var routerSingleton = router();

export default {
	url: url,
	route: route,
	router: router,
	getRouter: function() {
		return routerSingleton;
	},
	setRouter: function(newRouter) {
		routerSingleton = newRouter;
	}
};
