define([
  '../router',
], function (router) {
  /**
   * Extends widget with protected routing methods.
   *
   * @param {widget} widget - Widget to extend
   * @param {router} [router=router.getRouter()] - Router to use
   *
   * @return {routedWidget} widget with routing
   */
  return function routed(widget, aRouter) {
    aRouter = aRouter || router.getRouter();

    /**
     * Routed widget
     *
     * @return {{}}
     */
    return function routedWidget(spec, my) {
      my = my || {};
      spec = spec || {};

      // Route / Controller extensions
      my.router = aRouter;

      // Link
      my.linkTo = my.router.linkTo;
      my.linkToPath = my.router.linkToPath;
      my.linkToUrl = my.router.linkToUrl;

      // Redirect
      my.redirectTo = my.router.redirectTo;
      my.redirectToPath = my.router.redirectToPath;
      my.redirectToUrl = my.router.redirectToUrl;

      // Parameters
      my.getParameters = my.router.getParameters;
      my.getParameter = my.router.getParameter;
      my.setParameters = my.router.setParameters;

      return widget(spec, my);
    };
  };
});
