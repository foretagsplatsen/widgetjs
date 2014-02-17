// Events.js that lets us bind callbacks to named events. It also lets us group named events into categories.
//
// #### Usage:
//
// **As an event buss/dispatcher**. Eg. register and trigger a callback for a named event 'login' in the 'authentication' category:
//
//      events.at('authentication').on('login', function(userName) { alert('User ' + userName + ' signed in.');})
//
//      events.at('authentication').trigger('login', 'kalle');
//
//
// _Note:_ If no category is given the 'default' eventhandler is used. Eg.
//
//      events.on('xyz', function() { ... });
//
//      is equivalent to:
//
//      events.at('default').on('xyz', function() { ... });
//
// Events can also be **mixed into any object**, giving the object the ability to bind and trigger custom named events.
//
//      var obj = {};
//      jQuery.extend(obj, events.eventhandler());
//      obj.on('notification', function(msg) { alert(msg); });
//
//      obj.trigger('notification', 'tada!');
//
// _Note:_ that this will bypass the global eventManager, so local events should be used only
// when other objects aren't supposed to capture the events triggered locally.
//
//

define([], function () {

        // - - -

        // ### Event
        // Represents an event. Keeps a list of bindings/callbacks that can be added using **push()** and
        // removed using **remove()**. *trigger()* executes all callbacks one by one in registration order.
        var event = function () {
            var that = {};

            var bindings = [];

            // #### Public API

            // Add binding
            that.push = function (binding) {
                bindings.push(binding);
                binding.event = that;
            };

            // Remove binding
            that.remove = function (binding) {
                if (!binding || !binding.event) {
                    throw "not a binding for event";
                }

                for (var i = 0; i < bindings.length; i++) {
                    if (binding === bindings[i]) {
                        bindings.splice(i, 1);
                    }
                }
                binding.event = null;
            };

            // Trigger event by executing all callbacks one by one in registration order.
            // 'params' can be an object or an array, and will be passed as parameter to
            // the callback functions of each binding.
            that.trigger = function (params) {
                if (params.constructor !== Array) {
                    params = [params];
                }
                for (var i = 0; i < bindings.length; i++) {
                    bindings[i].trigger(params);
                }
            };

            return that;
        };

        // - - -

        // ### EventHandler
        // Keeps a list of named events. You may bind callbacks to an event with **on()**
        // or **onceOn()** and remove with **off()**. Use **trigger()** to execute all callbacks for an event.
        var eventHandler = function () {
            var that = {};

            // Map of events with name as key
            that.events = {};

            // Lazily makes sure that an event exists for 'name'.
            var ensureEventHolderFor = function (name) {
                if (!that.events[name]) {
                    that.events[name] = event();
                }
            };

            // #### Public API

            // Binds callback to a named event. The callback will be invoked whenever the event is fired.
            that.on = function (name, callback) {
                var binding = eventBinding({ callback: callback });
                ensureEventHolderFor(name);
                that.events[name].push(binding);
                return binding;
            };

            that.createEvent = function (name) {
                return function(callback) {
                    var binding = eventBinding({ callback: callback });
                    ensureEventHolderFor(name);
                    that.events[name].push(binding);
                    return binding;
                };
            };

            // Removed 'binding' attached to event.
            that.off = function (name, binding) {
                ensureEventHolderFor(name);
                that.events[name].remove(binding);
            };

            // Like **on()** except only triggered once then removed from the event.
            that.onceOn = function (name, callback) {
                ensureEventHolderFor(name);
                var onceEvent = eventBinding({
                    callback: function () {
                        that.events[name].remove(onceEvent);
                        callback.apply(that.events[name], arguments);
                    }
                });

                that.events[name].push(onceEvent);
                return onceEvent;
            };

            // Trigger all callbacks attached to event.
            // Any arguments to trigger is sent as arguments to callback.
            that.trigger = function (name) {
                var params = Array.prototype.slice.call(arguments, 1);
                if (that.events[name]) {
                    that.events[name].trigger(params);
                }
            };

            return that;
        };

        // - - -

        // ### Event Binding
        // Binds a callback to an event
        var eventBinding = function (spec) {
            spec = spec || {};
            var that = {};

            var callback = spec.callback;

            // #### Public API

            // Event
            that.event = spec.event;

            // True if bound to an event
            that.isBound = function () {
                return that.event;
            };

            // Remove itself from event, if bound.
            that.unbind = function () {
                if (that.isBound()) {
                    that.event.remove(that);
                }
            };

            // Trigger callback with supplied parameters
            that.trigger = function (params) {
                if (callback) {
                    callback.apply(this, params);
                }
            };

            return that;
        };


        // - - -

        // ### EventManager
        // Singleton object that keeps a list of named event categories/holders.
        var eventManager = (function () {
            var that = {};

            // Map of event handlers (categories of events) with (category) name as key
            var eventHandlers = {};

            // #### Public API

            // Register a new event handler with 'name'.
            that.register = function (name) {
                if (eventHandlers[name]) {
                    throw ('A event handler is already registered for ' + name);
                }
                eventHandlers[name] = eventHandler();

                return eventHandlers[name];
            };

            // Returns event handler by name. Creates a new handler if
            // not already registered.
            that.at = function (name) {
                if (!eventHandlers[name]) {
                    that.register(name);
                }

                return eventHandlers[name];
            };

            // Forward **on()**, **onceOn()**, **off()** and **trigger()** to the default event handler

            that.on = function (name, callback) {
                return that.at('default').on(name, callback);
            };

            that.onceOn = function (name, callback) {
                return that.at('default').onceOn(name, callback);
            };

            that.off = function (name, binding) {
                return that.at('default').off(name, binding);
            };

            that.trigger = function (name) {
                var params = Array.prototype.slice.call(arguments, 1);
                if (that.at('default').events[name]) {
                    that.at('default').events[name].trigger(params);
                }
            };

            // Expose event handler function (to be mixedin into objects and widgets)
            that.eventhandler = eventHandler;

            return that;
        })();


        // ### Default event handler
        // Ensure that 'default' category always exists.
        eventManager.register('default');

        // ### Exports
        // Singleton event manager
        return eventManager;
    });
