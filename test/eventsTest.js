define(function(require) {

    var assert = require("chai").assert;
    var events = require("widgetjs/events");

    suite("events");

    test("Bind callback to event", function() {
        // Arrange: an event
        var anEvent = events.event();

        // Act: bind a callback
        anEvent(function() {
            assert.ok(true);
        });

        // and execute
        anEvent.trigger();
    });

    test("Bind multiple callbacks to an event", function() {
        // Arrange: an event
        var anEvent = events.event();

        // Act: bind two callbacks and trigger event
        var counter = 0;
        anEvent(function() { counter++;});
        anEvent(function() { counter++;});

        anEvent.trigger();

        // Assert: that both where executed
        assert.ok(counter, 2, "Both callbacks executed");
    });

    test("Trigger pass values to callbacks", function() {
        // Arrange: an event
        var anEvent = events.event();

        // Act: bind two callbacks and trigger event
        var counter = 0;
        anEvent(function(num, str) {
            assert.equal(num, 2);
            assert.equal(str, "text");
            counter++;
        });
        anEvent(function() {
            assert.equal(arguments.length, 2);
            counter++;
        });

        anEvent.trigger(2, "text");

        // Assert: that both where executed
        assert.ok(counter, 2, "Both callbacks executed");
    });

    test("Bind callback to event using on", function() {
        // Arrange: an event
        var anEvent = events.event();

        // bind a callback using on
        anEvent.on(function() {
            assert.ok(true);
        });

        anEvent.trigger();
    });

    test("Un-Bind callback using off", function() {
        // Arrange: an event
        var anEvent = events.event();

        // bind a callback using on
        var eventBinding = anEvent.on(function() {
            assert.ok(false); // assert not executed
        });

        // unbind using off
        anEvent.off(eventBinding);

        anEvent.trigger();
    });

    test("Un-Bind callback using unbind", function() {
        // Arrange: an event
        var anEvent = events.event();

        // bind a callback using on
        var eventBinding = anEvent.on(function() {
            assert.ok(false); // assert not executed
        });

        // Unbind
        eventBinding.unbind();

        anEvent.trigger();
    });

    test("Bind and trigger callback only once using onceOn", function() {
        // Arrange: an event
        var anEvent = events.event();


        // Act: bind a callback using on
        var counter = 0;
        anEvent.onceOn(function() {
            counter++;
        });

        // and trigger twice
        anEvent.trigger();
        anEvent.trigger();

        assert.equal(counter, 1, "Callback executed only once");
    });

    test("Event dispose unbinds all callbacks", function() {
        // Arrange: an event
        var anEvent = events.event();

        // Act: bind two callbacks and trigger event
        var firstBinding = anEvent(function() {});
        var secondBinding = anEvent(function() {});

        anEvent.dispose();

        // Assert: that both where unbound
        assert.equal(firstBinding.isBound(), false, "first unbound");
        assert.equal(secondBinding.isBound(), false, "second unbound");
    });

    test("Event Category keeps a list of events", function() {
        // Act: create an event handler ans some events
        var someEvents = events.eventCategory();
        var anEvent = someEvents.createEvent();
        var anotherEvent = someEvents.createEvent();

        // Assert: events created
        assert.ok(anEvent.on, "first event");
        assert.ok(anotherEvent.on, "second event");
    });

    test("Event Category can keep named events", function() {
        // Act: create an event handler ans some events
        var someEvents = events.eventCategory();
        var anEvent = someEvents.createEvent("namedEvent");

        // Assert: events created
        assert.ok(anEvent.on, "first event");
    });

    test("Event Category can bind callback to named event using on", function() {
        // Arrange: an event
        var someEvents = events.eventCategory();
        var anEvent = someEvents.createEvent("namedEvent");

        // bind a callback using on
        someEvents.on("namedEvent", function() {
            assert.ok(true);
        });

        // Act: trigger named event
        anEvent.trigger("namedEvent");
    });

    test("Event Category can un-bind named event callbacks using off", function() {
        // Arrange: an event
        var someEvents = events.eventCategory();
        var anEvent = someEvents.createEvent("namedEvent");

        // bind a callback using on
        var eventBinding = someEvents.on("namedEvent", function() {
            assert.ok(false); // assert not executed
        });

        // unbind using off
        someEvents.off("namedEvent", eventBinding);

        anEvent.trigger("namedEvent");
    });

    test("Event Category can bind and trigger named event callback only once using onceOn", function() {
        // Arrange: an event
        var someEvents = events.eventCategory();
        var anEvent = someEvents.createEvent("namedEvent");


        // Act: bind a callback using on
        var counter = 0;
        someEvents.onceOn("namedEvent", function() {
            counter++;
        });

        // and trigger twice
        anEvent.trigger("namedEvent");
        anEvent.trigger("namedEvent");

        assert.equal(counter, 1, "Callback executed only once");
    });

    test("Event Category can bind dispose unbinds all events and there callbacks", function() {
        // Arrange: two events in a event handler
        var someEvents = events.eventCategory();
        var anEvent = someEvents.createEvent("namedEvent");
        var anotherEvent = someEvents.createEvent("namedEvent");

        // Act: bind two callbacks and trigger event
        var firstBinding = anEvent(function() {});
        var secondBinding = anEvent(function() {});
        var thirdBinding = anotherEvent(function() {});
        var fourthBinding = anotherEvent(function() {});

        someEvents.dispose();

        // Assert: that all where unbound
        assert.equal(firstBinding.isBound(), false, "1");
        assert.equal(secondBinding.isBound(), false, "2");
        assert.equal(thirdBinding.isBound(), false, "3");
        assert.equal(fourthBinding.isBound(), false, "4");
    });

    test("Event Manager is a singleton", function() {
        assert.equal(events, events);
    });

    test("Event Manager keeps list of named event categories", function() {
        var triggered = false;

        events.at("c1").on("foo", function() {
            triggered = true;
        });
        assert.ok(!triggered, "should only be executed once triggered");

        events.at("c1").trigger("bar");
        assert.ok(!triggered, "should not be executed on other events");

        events.at("c2").trigger("foo");
        assert.ok(!triggered, "should not be executed on event with same name in other category");

        events.at("c1").trigger("foo");
        assert.ok(triggered, "callback should be executed when event triggered");
    });

});
