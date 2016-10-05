define(["widgetjs/events"], function(events) {
    describe("events", function() {

        it("Bind callback to event", function() {
            // Arrange: an event
            var anEvent = events.event();

            // Act: bind a callback
            anEvent(function() {
                expect(true).toBeTruthy();
            });

            // and execute
            anEvent.trigger();
        });

        it("Bind multiple callbacks to an event", function() {
            // Arrange: an event
            var anEvent = events.event();

            // Act: bind two callbacks and trigger event
            var counter = 0;
            anEvent(function() { counter++;});
            anEvent(function() { counter++;});

            anEvent.trigger();

            // Assert: that both where executed
            expect(counter).toBe(2);
        });

        it("Trigger pass values to callbacks", function() {
            // Arrange: an event
            var anEvent = events.event();

            // Act: bind two callbacks and trigger event
            var counter = 0;
            anEvent(function(num, str) {
                expect(num).toBe(2);
                expect(str).toBe("text");
                counter++;
            });
            anEvent(function() {
                expect(arguments.length).toBe(2);
                counter++;
            });

            anEvent.trigger(2, "text");

            // Assert: that both where executed
            expect(counter).toBe(2);
        });

        it("Bind callback to event using on", function() {
            // Arrange: an event
            var anEvent = events.event();

            // bind a callback using on
            anEvent.on(function() {
                expect(true).toBeTruthy();
            });

            anEvent.trigger();
        });

        it("Un-Bind callback using off", function() {
            // Arrange: an event
            var anEvent = events.event();

            // bind a callback using on
            var eventBinding = anEvent.on(function() {
                jasmine.fail();
            });

            // unbind using off
            anEvent.off(eventBinding);

            anEvent.trigger();
        });

        it("Un-Bind callback using unbind", function() {
            // Arrange: an event
            var anEvent = events.event();

            // bind a callback using on
            var eventBinding = anEvent.on(function() {
                jasmine.fail();
            });

            // Unbind
            eventBinding.unbind();

            anEvent.trigger();
        });

        it("Bind and trigger callback only once using onceOn", function() {
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

            expect(counter).toBe(1);
        });

        it("Event dispose unbinds all callbacks", function() {
            // Arrange: an event
            var anEvent = events.event();

            // Act: bind two callbacks and trigger event
            var firstBinding = anEvent(function() {});
            var secondBinding = anEvent(function() {});

            anEvent.dispose();

            // Assert: that both where unbound
            expect(firstBinding.isBound()).toBeFalsy();
            expect(secondBinding.isBound()).toBeFalsy();
        });

        it("Event Category keeps a list of events", function() {
            // Act: create an event handler ans some events
            var someEvents = events.eventCategory();
            var anEvent = someEvents.createEvent();
            var anotherEvent = someEvents.createEvent();

            // Assert: events created
            expect(anEvent.on).toBeTruthy();
            expect(anotherEvent.on).toBeTruthy();
        });

        it("Event Category can keep named events", function() {
            // Act: create an event handler ans some events
            var someEvents = events.eventCategory();
            var anEvent = someEvents.createEvent("namedEvent");

            // Assert: events created
            expect(anEvent.on).toBeTruthy();
        });

        it("Event Category can bind callback to named event using on", function() {
            // Arrange: an event
            var someEvents = events.eventCategory();
            var anEvent = someEvents.createEvent("namedEvent");

            // bind a callback using on
            someEvents.on("namedEvent", function() {
                expect(true).toBeTruthy();
            });

            // Act: trigger named event
            anEvent.trigger("namedEvent");
        });

        it("Event Category can un-bind named event callbacks using off", function() {
            // Arrange: an event
            var someEvents = events.eventCategory();
            var anEvent = someEvents.createEvent("namedEvent");

            // bind a callback using on
            var eventBinding = someEvents.on("namedEvent", function() {
                expect(true).toBeFalsy();
            });

            // unbind using off
            someEvents.off("namedEvent", eventBinding);

            anEvent.trigger("namedEvent");
        });

        it("Event Category can bind and trigger named event callback only once using onceOn", function() {
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

            expect(counter).toBe(1);
        });

        it("Event Category can bind dispose unbinds all events and there callbacks", function() {
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
            expect(firstBinding.isBound()).toBeFalsy();
            expect(secondBinding.isBound()).toBeFalsy();
            expect(thirdBinding.isBound()).toBeFalsy();
            expect(fourthBinding.isBound()).toBeFalsy();
        });

        it("Event Manager is a singleton", function() {
            expect(events).toBe(events);
        });

        it("Event Manager keeps list of named event categories", function() {
            var triggered = false;

            events.at("c1").on("foo", function() {
                triggered = true;
            });
            expect(!triggered).toBeTruthy();

            events.at("c1").trigger("bar");
            expect(!triggered).toBeTruthy();

            events.at("c2").trigger("foo");
            expect(!triggered).toBeTruthy();

            events.at("c1").trigger("foo");
            expect(triggered).toBeTruthy();
        });
    });
});
