define(["widgetjs/events"], function(manager) {
    // helpers
    var deny = function(o) {
        equal(o, false);
    };

    var assert = function(o) {
        equal(o, true);
    };

    test("singleton event manager", function() {
        equal(manager, manager);
    });

    test("testing event names", function() {
        var triggered = false;

        // callback should only be executed once triggered
        manager.on('foo', function() { triggered = true; });
        deny(triggered);

        // callback should not be executed on other events
        manager.trigger('bar');
        deny(triggered);

        // callback should not be executed if an event
        // with same name in nother category is triggered
        manager.at('2').trigger('foo');
        deny(triggered);

        // callback should be executed when event triggered
        manager.trigger('foo');
        assert(triggered);
    });

    test("default event category", function() {
        // should be able to attach callbacks to default
        // category
        var triggered = false;
        manager.on('foo', function() {triggered = true;});

        // callback should not be executed without event triggered
        deny(triggered);
        
        // callback should be executed when event triggered
        manager.trigger('foo');
        assert(triggered);
    });

    test("event categories", function() {
       var triggered1 = false;
       var triggered2 = false;

        var firstFooEventBinding = manager.at('1').on('foo', function() {
            triggered1 = true;
        });

        var secondFooEventBinding = manager.at('2').on('foo', function() {
            triggered2 = true;
        });

        // callback should not be executed without event triggered
        deny(triggered1);
        deny(triggered2);

        // callback should not be executed on other event
        manager.trigger('foo');
        deny(triggered1);
        deny(triggered2);


        // callback should not be executed on other events in same category
        manager.at('2').trigger('bar');
        deny(triggered1);
        deny(triggered2);


        // callback should be executed on named event
        // but other events in same category should not be executed.
        manager.at('2').trigger('foo');
        deny(triggered1);
        assert(triggered2);

        manager.at('1').trigger('foo');
        assert(triggered1);
        assert(triggered2);

         // clean-up
        firstFooEventBinding.unbind();
        secondFooEventBinding.unbind();
    });

    test("passing data", function() {
        var params;

        var fooEvent = manager.on('foo', function() {
            params = arguments;
        });

        // should pass argument to callback
        manager.trigger('foo', {a: 1});
        equal(params[0].a, 1);

        // should pass multiple arguments to callback
        manager.trigger('foo', {a: 2}, {b: 3});
        equal(params[0].a, 2);
        equal(params[1].b, 3);

        // clean-up
        fooEvent.unbind();
    });

});
