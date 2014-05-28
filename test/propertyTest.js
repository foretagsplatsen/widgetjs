define(["widgetjs/property", "jquery", "chai"], function(property, jquery, chai) {

    var assert = chai.assert;

    suite("property");

    test("property get", function() {
        // Arrange a property with a value
        var name = property({
            value: 'John Doe'
        });

        var val = name.get();


        assert.equal(val, 'John Doe');
    });

    test("property custom get", function() {
        // Arrange a property with a value
        var name = property({
            value: 'John Doe',
            get: function(currentValue) {
                return currentValue.toLowerCase();
            }
        });

        var val = name.get();


        assert.equal(val, 'john doe');
    });

    test("property set", function() {
        // Arrange a property with a value
        var name = property({
            value: 'John Doe'
        });

        name.set('Tony two times');
        var val = name.get();


        assert.equal(val, 'Tony two times');
    });

    test("property custom set", function() {
        // Arrange a property with a value
        var name = property({
            set: function(newValue) {
                return newValue.toLowerCase();
            }
        });

        name.set('Tony two times');
        var val = name.get();


        assert.equal(val, 'tony two times');
    });

    test("property onChange", function(start) {
        // Arrange a property with a value
        var name = property({
            value: 1,
            onChange: function(newValue, oldValue) {
                assert.equal(oldValue, 1, 'onChange get old value');
                assert.equal(newValue, 2, 'onChange get new value');
                start();
            }
        });

        name.set(2);
    });

    test("property type", function() {
        // Arrange a property with a value
        var name = property({
            type: 'string'
        });

        name.get();

        assert.equal(name.type, 'string');
    });

    test("property label", function() {
        // Arrange a property with a value
        var name = property({
            label: 'Name'
        });

        name.get();

        assert.equal(name.label, 'Name');
    });

    test("property validate", function() {
        // Arrange a property with a value
        var name = property({
            validator: function(val) {
                if(val === undefined || val === null) {
                    throw new Error('Field is required');
                }
            }
        });

        name.set(undefined);
        assert.equal(name.isValid(), false, 'Not valid if validator throws exception');

        name.set('Valid value');
        assert.equal(name.isValid(), true, 'Valid if no exception thrown by validator');
    });


    test("property change event", function(start) {
        // Arrange a property with a value
        var name = property({
            value: 'initialValue'
        });

        name.onChange(function(newValue, previousValue) {
            assert.equal(newValue, 'newValue');
            assert.equal(previousValue, 'initialValue');
            start();
        });

        name.set('newValue');
    });

});