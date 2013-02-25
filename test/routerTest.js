define(
    ["widgetjs/router", "widgetjs/events"],
    function(router, events) {

        // helpers
        var deny = function(o) {
            equal(o, false);
        };

        var assert = function(o) {
            equal(o, true);
        };

        function delayedAsyncTest(name, fn) {
            asyncTest(name, function() {
                expect(true);
                setTimeout(fn, 0 /* Give some time to the router to initialize. */);
            });
        }

        var redirectTo = window.redirectTo = function(path) {
            router.router.redirectTo(path);
        };

        // setup router
        router.controller.register();
        router.router.start();

        redirectTo('');
        

        module("router");

        test("testing unique router", function() {
            equal(router.router, router.router);
        });

        test("testing unique controller", function() {
            equal(router.controller, router.controller);
        });

             
        delayedAsyncTest("basic route", function() {
            router.controller.on('foo', function() {
                ok(true);
                start();
            });

            redirectTo('foo');
        });

        delayedAsyncTest("route with parameter", function() {
            router.controller.on('some/#value', function(value) {
                ok(value === 'thing');
                start();
            });
            redirectTo('some/thing');
        });


        delayedAsyncTest("route with multiple parameters", function() {
            router.controller.on('some/#value/#anothervalue', function(value, anothervalue) {
                ok(value === 'thing'&& anothervalue === 'thing2');
                start();
            });
            redirectTo('some/thing/thing2');
        });

        delayedAsyncTest("regexp route", function() {
            router.controller.on('any/.*', function() {
                ok(true);
                start();
            });
            redirectTo('any/thing');
        });

        delayedAsyncTest("regexp route with slashes", function() {
            router.controller.on('blah/.*', function() {
                ok(true);
                start();
            });
            redirectTo('blah/some/thing/bar/baz');
        });

        delayedAsyncTest("notfound event triggered", function() {
            events.at('routing').on('notfound', function(url) {
                ok(true);
                this.unbind(); // clean-up: unbound this event
                start();
            });

            redirectTo('APathNoyBoundToACallback');
        });

    }
);
