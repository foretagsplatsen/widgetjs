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

        var route = function(path) {
            router.router.setHash('!/'+ path);
        };

        window.route = route;
        router.controller.register();
        router.router.start();
        
        
        // tests
        test("testing unique router", function() {
            equal(router.router, router.router);
        });

        test("testing unique controller", function() {
            equal(router.controller, router.controller);
        });

        test("test setting hash", function() {
            route("hello");
            equal("#!/hello", window.location.hash);
        });
             
        asyncTest("testing basic url handling", function() {
            expect(true);
        	
            // Give some time to the router to initialize.
            setTimeout(function() {
                router.controller.on('foo', function() {
                    ok(true);
                    start();
                });
                route('foo');
            }, 0);
        });

        asyncTest("testing regexp url handling 1", function() {
            expect(true);
        	
            // Give some time to the router to initialize.
            setTimeout(function() {
                router.controller.on('some/#value', function(value) {
                    ok(value === 'thing');
                    start();
                });
                route('some/thing');
            }, 0);
        });

        asyncTest("testing regexp url handling 2", function() {
            expect(true);
        	
            // Give some time to the router to initialize.
            setTimeout(function() {
                router.controller.on('any/.*', function() {
                    ok(true);
                    start();
                });
                route('any/thing');
            }, 0);
        });

        asyncTest("testing regexp url handling 3", function() {
            expect(true);
        	
            // Give some time to the router to initialize.
            setTimeout(function() {
                router.controller.on('blah/.*', function() {
                    ok(true);
                    start();
                });
                route('blah/some/thing/bar/baz');
            }, 0);
        });
    }
);
