define([], function () {

        /*
        * Event framework
        *
        * Events
        * ======
        *
        * Events are similar to signals. They are grouped by category, each category being
        * handled by a eventHandler, registered in the eventManager.
        *
        * Event handlers
        * ==============
        *
        * Each event handler is responsible for registering/triggering corresponding events.
        *
        * If no category is used (event directly created in eventManager.on()), then the
        * 'default' eventhandler is used.
        *
        * eventManager
        * ============
        *
        * Creates one and only one global event manager.
        * The event manager holds event handlers for each kinds of events.
        *
        * Local events
        * ============
        * For local events, the eventHandler function is exposed, so objects can use it.
        *
        * Example:
        * Object.merge(myObject, eventHandler());
        * myObject.on('something', function() {...});
        *
        * _Note:_ that this will bypass the global eventManager, so local events should be used only
        * when other objects aren't supposed to capture the events triggered locally.
        */

        var eventHandler = function () {

            var that = {};
            /*
            * The bindings object holds all events for this handler
            */
            that.bindings = {};

            /*
            * lazily makes sure that a eventHolder is set for 'eventString'
            */
            var ensureEventHolderFor = function (eventString) {
                if (!that.bindings[eventString]) {
                    that.bindings[eventString] = eventHolder();
                }
            };

            /*
            * Public API functions.
            */

            /*
            * Main public function. Register an event named 'eventString' with
            * an associated callback function.
            */
            that.on = function (eventString, callback) {
                var e = event({ callback: callback });
                ensureEventHolderFor(eventString);
                that.bindings[eventString].push(e);
                return e;
            };

            /*
            * Similar to jQuery once() function.
            * Works like on(), except that the event will only be triggered once,
            * then removed from the event holder.
            */
            that.onceOn = function (eventString, callback) {
                ensureEventHolderFor(eventString);
                var onceEvent = event({
                    callback: function () {
                        that.bindings[eventString].remove(onceEvent);
                        callback(arguments);
                    }
                });

                that.bindings[eventString].push(onceEvent);
                return onceEvent;
            };

            /*
            * Trigger an event named 'eventString'. All registered callbacks are
            * being evaluated one by one in registration order.
            */
            that.trigger = function (eventString) {
                var params = Array.prototype.slice.call(arguments, 1);
                if (that.bindings[eventString]) {
                    that.bindings[eventString].triggerEvents(params);
                }
            };

            return that;
        };


        /*
        * The eventHolder holds callbacks associated with one event string.
        * There is one eventHolder per event in each eventHandler.
        */
        var eventHolder = function () {

            var that = {};
            var events = [];

            that.push = function (event) {
                events.push(event);
                event.holder = this;
            };

            that.remove = function (event) {
                events.remove(event);
                event.holder = undefined;
            };

            /*
            * Trigger events.
            * 'params' can be an object or an array,
            * and will be passed as parameter of the callback functions of each
            * event object.
            */
            that.triggerEvents = function (params) {
                if (params.constructor !== Array) {
                    params = [params];
                }
                for (var i = 0; i < events.length; i++) {
                    events[i].trigger(params);
                }
            };

            return that;
        };

        /*
        * THE event object.
        * All it does is holding a callback function to be triggered later on.
        */
        var event = function (spec) {
            spec = spec || {};
            var that = {};
            var callback = spec.callback;

            that.holder = spec.holder;

            that.isBound = function () {
                return that.holder;
            };

            that.unbind = function () {
                if (that.isBound()) {
                    that.holder.remove(that);
                }
            };

            that.trigger = function (params) {
                if (callback) {
                    callback.apply(this, params);
                }
            };

            return that;
        };


        /*
        * The eventManager is a publicly accessible object.
        * There is only one such objec in the system at once.
        * It is the main object holding all global event handlers
        */
        var eventManager = (function () {

            var that = {};
            var eventHandlers = {};

            that.eventhandler = eventHandler;

            /*
            * Register a new event handler for a kind of events
            */
            that.register = function (string) {
                if (eventHandlers[string]) {
                    throw ('An eventHandler is already registered for ' + string);
                }
                eventHandlers[string] = eventHandler();
            };

            that.at = function (string) {
                if (!eventHandlers[string]) {
                    that.register(string);
                }
                return eventHandlers[string];
            };

            /*
            * Forward to the default event handler
            */

            that.trigger = function (eventString, params) {
                that.at('default').trigger(eventString, params);
            };

            that.on = function (eventString, callback) {
                return that.at('default').on(eventString, callback);
            };

            that.onceOn = function (eventString, callback) {
                return that.at('default').onceOn(eventString, callback);
            };

            return that;
        })();


        /*
        * Default event handler
        */
        eventManager.register('default');

        window.events = eventManager;

        return eventManager;
    });
