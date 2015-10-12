define(function(require) {

    var assert = require('chai').assert;
    var initilized = require('widgetjs/addons/initialized');

    suite("initialized");

    test('Should execute init method on creation', function() {
        // Arrange: an object with an init method
        var testObject = function(spec, my) {
          var that = {};
          that.isInitialized = false;

          that.init = function() {
            that.isInitialized = true;
          };

          return that;
        };

        // Act: Ensure it's always initialized and create an instance
        testObject =  initilized(testObject);
        var obj = testObject();

        // Assert: that object was initialized
        assert.ok(obj.isInitialized, 'init was called');
    });

    test('Can execute init method with defined name', function() {
        // Arrange: an object with a differently named init method
        var testObject = function(spec, my) {
          var that = {};
          that.isInitialized = false;

          that.specialInit = function() {
            that.isInitialized = true;
          };

          return that;
        };

        // Act: Ensure it's always initialized and create an instance
        testObject =  initilized(testObject, 'specialInit');
        var obj = testObject();

        // Assert: that object was initialized
        assert.ok(obj.isInitialized, 'init was called');
    });

    test('Should only execute parent init method', function() {
        // Arrange: a initilized object
        var testObject = function(spec, my) {
          var that = {};
          that.isInitialized = false;

          that.init = function() {
            that.isInitialized = true;
          };

          return that;
        };
        testObject =  initilized(testObject);

        // and another initilized parent object
        var parentTestObject = function(spec, my) {
          var that = testObject(spec, my);
          that.isParentInitialized = false;

          that.init = function() {
            that.isParentInitialized = true;
          };

          return that;
        };
        parentTestObject = initilized(parentTestObject);

        // Act: create parent object
        var obj = parentTestObject();

        // Assert: that object was initialized
        assert.equal(obj.isParentInitialized, true, 'Init on parent was called');
        assert.equal(obj.isInitialized, false, 'Init was not executed on child object');
    });

    test('Should create children before executing init', function() {
        // Arrange: a initilized object
        var testObject = function(spec, my) {
          var that = {};
          that.isInitialized = false;

          that.testInit = function() {
            that.isInitialized = true;
          };

          that.init = that.testInit;

          return that;
        };
        testObject =  initilized(testObject);

        // and another initilized parent object
        var parentTestObject = function(spec, my) {
          var that = testObject(spec, my);
          that.isParentInitialized = false;

          // Override init
          that.init = function() {
            that.testInit(); // but call base
            that.isParentInitialized = true;
          };

          return that;
        };
        parentTestObject = initilized(parentTestObject);

        // Act: create parent object
        var obj = parentTestObject();

        // Assert: that object was initialized
        assert.equal(obj.isParentInitialized, true, 'Init on parent was called');
        assert.equal(obj.isInitialized, true, 'Init was executed on child object');
    });
});
