define([
], function () {
  var doInit = true;

  /**
   * Ensures that the object inititialization method is
   * executed on creation.
   *
   * @param {{}} obj - Object to initilize
   * @param {string} [initName=Init] - Name of init method
   *
   * @return {{}} initilized object
   */
  function initialized(obj, initName) {
    initName = initName || 'init';

    /**
     * Initialized object constructor
     *
     * @return {{}}
     */
    return function initilizedObject() {
      var skipInit = !doInit;
      doInit = false;
      var args = Array.prototype.slice.call(arguments);
      var instance = obj.apply(this, args);

      if(instance.hasOwnProperty(initName) && !skipInit) {
        instance[initName]();
      }

      doInit = true;

      return instance;
    };
  }

  return initialized;
});
