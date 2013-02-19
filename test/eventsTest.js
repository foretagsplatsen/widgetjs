define(["widgetjs/events"], function(manager) {
    // helpers
    var deny = function(o) {
        equal(o, false);
    };

    var assert = function(o) {
        equal(o, true);
    };


    // tests
    test("testing unique event manager", function() {
        equal(manager, manager);
    });

    test("testing event names", function() {
        var triggered = false;

        manager.on('foo', function() {triggered = true});
        deny(triggered);

        manager.trigger('bar');
        deny(triggered);

        manager.at('2').trigger('foo');
        deny(triggered);

        manager.trigger('foo');
        assert(triggered);

    });

    test("testing default events holder", function() {
        var triggered = false;
        manager.on('foo', function() {triggered = true});

        deny(triggered);
        
        manager.trigger('foo');
        assert(triggered);
    });

    test("testing holders", function() {
       var triggered1 = false; 
       var triggered2 = false; 

        manager.at('1').on('foo', function() {
            triggered1 = true;
        });

        manager.at('2').on('foo', function() {
            triggered2 = true;
        });

        deny(triggered1);
        deny(triggered2);

        manager.trigger('foo');

        deny(triggered1);
        deny(triggered2);

        manager.at('2').trigger('bar');
        deny(triggered1);
        deny(triggered2);


        manager.at('2').trigger('foo');
        deny(triggered1);
        assert(triggered2);

        manager.at('1').trigger('foo');
        assert(triggered1);
        assert(triggered2);


    });

    test("testing passing data", function() {
        var data;

        manager.on('foo', function(o) {
            data = o;
        });

        manager.trigger('foo', {a: 1});
        equal(data.a, 1);

        manager.trigger('foo', {a: 2});
        equal(data.a, 2);
    });

});
