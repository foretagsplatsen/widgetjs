define(["src/events"], function(events) {
	describe("events", function() {

		it("Bind callback to event", function() {
			// Arrange: an event
			var anEvent = events.event();
			var spy = jasmine.createSpy("callback");

			// Act: bind a callback
			anEvent.register(spy);

			// and execute
			anEvent.trigger();

			// Assert
			expect(spy).toHaveBeenCalled();
		});

		it("Bind multiple callbacks to an event", function() {
			// Arrange: an event
			var anEvent = events.event();
			var spy = jasmine.createSpy("callback");

			// Act: bind two callbacks and trigger event
			anEvent.register(spy);
			anEvent.register(spy);

			anEvent.trigger();

			// Assert: that both where executed
			expect(spy).toHaveBeenCalledTimes(2);
		});

		it("Trigger pass values to callbacks", function() {
			// Arrange: an event
			var anEvent = events.event();
			var spy1 = jasmine.createSpy("callback1");
			var spy2 = jasmine.createSpy("callback2");

			// Act: bind two callbacks and trigger event
			anEvent.register(spy1);
			anEvent.register(spy2);

			anEvent.trigger(2, "text");

			// Assert: that both where executed
			expect(spy1).toHaveBeenCalledWith(2, "text");
			expect(spy2).toHaveBeenCalledWith(2, "text");
		});

		it("Un-Bind callback using unregister", function() {
			// Arrange: an event
			var anEvent = events.event();
			var spy = jasmine.createSpy("callback");

			// bind a callback
			var eventBinding = anEvent.register(spy);

			// unbind
			anEvent.unregister(eventBinding);

			anEvent.trigger();

			expect(spy).not.toHaveBeenCalled();
		});

		it("Un-Bind callback using unbind", function() {
			// Arrange: an event
			var anEvent = events.event();
			var spy = jasmine.createSpy("callback");

			// bind a callback
			var eventBinding = anEvent.register(spy);

			// Unbind
			eventBinding.unbind();

			anEvent.trigger();
			expect(spy).not.toHaveBeenCalled();
		});

		it("Bind and trigger callback only once using registerOnce", function() {
			// Arrange: an event
			var anEvent = events.event();
			var spy = jasmine.createSpy("callback");

			// Act: bind a callback
			anEvent.registerOnce(spy);

			// and trigger twice
			anEvent.trigger();
			anEvent.trigger();

			expect(spy).toHaveBeenCalledTimes(1);
		});

		it("Event dispose unbinds all callbacks", function() {
			// Arrange: an event
			var anEvent = events.event();

			// Act: bind two callbacks and trigger event
			var firstBinding = anEvent.register(function() {});
			var secondBinding = anEvent.register(function() {});

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

		it("Event Category can bind callback to named event using register", function() {
			// Arrange: an event
			var someEvents = events.eventCategory();
			var anEvent = someEvents.createEvent("namedEvent");

			// bind a callback
			someEvents.register("namedEvent", function() {
				expect(true).toBeTruthy();
			});

			// Act: trigger named event
			anEvent.trigger("namedEvent");
		});

		it("Event Category can un-bind named event callbacks using unregister", function() {
			// Arrange: an event
			var someEvents = events.eventCategory();
			var anEvent = someEvents.createEvent("namedEvent");
			var spy = jasmine.createSpy("callback");

			// bind a callback
			var eventBinding = someEvents.register("namedEvent", spy);

			// unbind
			someEvents.unregister("namedEvent", eventBinding);

			anEvent.trigger("namedEvent");
			expect(spy).not.toHaveBeenCalled();
		});

		it("Event Category can bind and trigger named event callback only once using registerOnce", function() {
			// Arrange: an event
			var someEvents = events.eventCategory();
			var anEvent = someEvents.createEvent("namedEvent");
			var spy = jasmine.createSpy("callback");

			// Act: bind a callback
			someEvents.registerOnce("namedEvent", spy);

			// and trigger twice
			anEvent.trigger("namedEvent");
			anEvent.trigger("namedEvent");

			expect(spy).toHaveBeenCalledTimes(1);
		});

		it("Event Category can bind dispose unbinds all events and there callbacks", function() {
			// Arrange: two events in a event handler
			var someEvents = events.eventCategory();
			var anEvent = someEvents.createEvent("namedEvent");
			var anotherEvent = someEvents.createEvent("namedEvent");

			// Act: bind two callbacks and trigger event
			var firstBinding = anEvent.register(function() {});
			var secondBinding = anEvent.register(function() {});
			var thirdBinding = anotherEvent.register(function() {});
			var fourthBinding = anotherEvent.register(function() {});

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

			events.at("c1").register("foo", function() {
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

	describe("deprecated", function() {
		/* eslint-disable no-console */
		var originalConsoleWarn;

		beforeEach(function() {
			console.warn = jasmine.createSpy("console.warn");
		});

		beforeAll(function() {
			originalConsoleWarn = console.warn;
		});

		afterAll(function() {
			console.warn = originalConsoleWarn;
		});

		it("on() method delegates to register", function() {
			// Arrange: an event
			var anEvent = events.event();
			var spy = jasmine.createSpy("register");

			anEvent.register = spy;
			anEvent.on("foo");

			expect(spy).toHaveBeenCalledWith("foo");
			expect(console.warn).toHaveBeenCalled();
		});

		it("'using an event as a function' delegates to register", function() {
			// Arrange: an event
			var anEvent = events.event();
			var spy = jasmine.createSpy("register");

			anEvent.register = spy;
			anEvent("foo");

			expect(spy).toHaveBeenCalledWith("foo");
			expect(console.warn).toHaveBeenCalled();
		});

		it("off() method delegates to unregister", function() {
			// Arrange: an event
			var anEvent = events.event();
			var spy = jasmine.createSpy("unregister");

			anEvent.unregister = spy;
			anEvent.off("foo");

			expect(spy).toHaveBeenCalledWith("foo");
			expect(console.warn).toHaveBeenCalled();
		});

		it("onceOn() method delegates to registerOnce", function() {
			// Arrange: an event
			var anEvent = events.event();
			var spy = jasmine.createSpy("registerOnce");

			anEvent.registerOnce = spy;
			anEvent.onceOn(spy);

			expect(spy).toHaveBeenCalled();
			expect(console.warn).toHaveBeenCalled();
		});

		it("on() category method delegates to register", function() {
			// Arrange: an event
			var someEvents = events.eventCategory();
			var spy = jasmine.createSpy("register");

			someEvents.register = spy;

			someEvents.on("namedEvent", "something else");

			expect(spy).toHaveBeenCalledWith("namedEvent", "something else");
			expect(console.warn).toHaveBeenCalled();
		});

		it("off() category method delegates to unregister", function() {
			// Arrange: an event
			var someEvents = events.eventCategory();
			var spy = jasmine.createSpy("unregister");

			someEvents.unregister = spy;

			someEvents.off("namedEvent", "something else");

			expect(spy).toHaveBeenCalledWith("namedEvent", "something else");
			expect(console.warn).toHaveBeenCalled();
		});

		it("onceOn() category method delegates to registerOnce", function() {
			// Arrange: an event
			var someEvents = events.eventCategory();
			var spy = jasmine.createSpy("registerOnce");

			someEvents.registerOnce = spy;

			someEvents.onceOn("namedEvent", "something else");

			expect(spy).toHaveBeenCalledWith("namedEvent", "something else");
			expect(console.warn).toHaveBeenCalled();
		});
	});
});
