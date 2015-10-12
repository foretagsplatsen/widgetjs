define([
  '../router',
], function (router) {
  /**
   * Extends widget with transaction support. During a
   * transaction all updates are disabled
   *
   * @param {widget} widget - Widget to extend
   * @param {router} [router=router.getRouter()] - Router to use
   *
   * @return {routedWidget} widget with routing
   */
  return function transactable(widget) {

    /**
     * Widget with update transaction support.
     *
     * @return {{}}
     */
    return function transactableWidget(spec, my) {
      my = my || {};
      spec = spec || {};

      var that = widget(spec, my);

      /** When within an update transaction, do not update the widget */
			my.inUpdateTransaction = false;

      that.withinTransaction = function(fn, onDone) {
				if(my.inUpdateTransaction) {
					fn();
				} else {
					try {
						my.inUpdateTransaction = true;
						fn();
					}
					finally {
						my.inUpdateTransaction = false;
						if(onDone) {
							onDone();
						}
					}
				}
			};

      that.update = (function(superUpdate){
        return function() {
          // No updates within transactions
          if(!my.inUpdateTransaction) {
            superUpdate();
          }
        };
      })(that.update);

      /**
       * Evaluate `fn`, ensuring that an update will be
       * performed after evaluating the function. Nested calls
       * to `withUpdate` or `update` will result in updating the
       * widget only once.
       */
      that.withUpdate = function(fn) {
        that.withinTransaction(fn, that.update);
      };

      that.withNoUpdate = function(fn) {
        that.withinTransaction(fn);
      };

      return that;
    };
  };
});
