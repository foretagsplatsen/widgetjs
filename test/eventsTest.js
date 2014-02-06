define(["widgetjs/events", "jquery", "chai"], function(manager, jquery, chai) {

    var assert = chai.assert;

    suite("events");

    test("singleton event manager", function() {
        assert.equal(manager, manager);
    });

    test("named events", function() {
        var triggered = false;

        manager.on('foo', function() { triggered = true; });
        assert.ok(!triggered, 'should only be executed once triggered');

        manager.trigger('bar');
        assert.ok(!triggered, 'should not be executed on other events');

        manager.at('2').trigger('foo');
        assert.ok(!triggered, 'should not be executed on event with same name in other category');

        manager.trigger('foo');
        assert.ok(triggered, 'callback should be executed when event triggered');
    });

    test("default event category", function() {
        var triggered = false;
        manager.on('foo', function() {triggered = true;});

        assert.ok(!triggered, 'should only be executed once triggered');

        manager.trigger('foo');
        assert.ok(triggered, 'should be when event triggered');
    });

    test("named event categories", function() {
        var triggered1 = false;
        var triggered2 = false;

        var firstFooEventBinding = manager.at('1').on('foo', function() {
            triggered1 = true;
        });

        var secondFooEventBinding = manager.at('2').on('foo', function() {
            triggered2 = true;
        });

        assert.ok(!triggered2 && !triggered1, 'should only be executed once triggered');

        manager.trigger('foo');
        assert.ok(!triggered1 && !triggered2, 'should not on event with same name in default category');


        manager.at('2').trigger('bar');
        assert.ok(!triggered1 && !triggered2, 'should not be executed on other events in same category');


        manager.at('2').trigger('foo');
        assert.ok(triggered2, 'should be executed on named event');
        assert.ok(!triggered1, 'other events in category should not be triggered');

         // clean-up
        firstFooEventBinding.unbind();
        secondFooEventBinding.unbind();
    });

    test("passing data", function() {
        var params;

        var fooEvent = manager.on('foo', function() {
            params = arguments;
        });

        manager.trigger('foo', {a: 1});
        assert.equal(params[0].a, 1, 'can pass single argument to callback');

        manager.trigger('foo', {a: 2}, {b: 3});
        assert.ok(params[0].a === 2 && params[1].b === 3, 'can pass multiple arguments to callback');

        // clean-up
        fooEvent.unbind();
    });

    test("mixin into any object", function() {
        var anyObject = {};
        jQuery.extend(anyObject, manager.eventhandler());

        // methods added to anyObject
        assert.ok(anyObject.on, 'object get on method');
        assert.ok(anyObject.onceOn, 'object get onceOn method');
        assert.ok(anyObject.off, 'object get off method');
        assert.ok(anyObject.trigger, 'object get trigger method');

        // a callback
        var val = 'notset';
        var aCallback = function(v) { val = v; };

        // attach a callback to a event
        var aBinding = anyObject.on('anEvent', aCallback);
        assert.ok(aBinding.isBound(), 'a binding from event to callback created.');

        assert.ok(val === 'notset', 'callback only executed once');

        // trigger
        anyObject.trigger('anEvent', 'triggered');
        assert.ok(val === 'triggered', 'callback triggered correcly');

        // turn off binding
        anyObject.off('anEvent', aBinding);

        // trigger again
        anyObject.trigger('anEvent', 'triggered again');
        assert.ok(val !== 'triggered again', 'callback not triggered since off');

        // once on another event
        anyObject.onceOn('anotherEvent', aCallback);

        anyObject.trigger('anotherEvent', 'triggered another');
        assert.ok(val === 'triggered another', 'callback triggered first time');

        anyObject.trigger('anotherEvent', 'triggered another again');
        assert.ok(val !== 'triggered another again', 'callback only triggered first time');
    });
});
