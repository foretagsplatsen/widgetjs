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

define([],
    function () {

        /**
         * Keeps a list of bindings/callbacks that can be added using **push()** and
         * removed using **remove()**. *trigger()* executes all callbacks one by one in registration order.
         *
         * @param [spec] {Object}
         * @param [my] {Object}
         * @returns {event}
         */
        var event = function (spec, my) {
            my = my || {};

            var that = function(callback) {
                return bindCallback(callback);
            };

            var bindings = [];

            // #### Public API

            /**
             * Binds callback to event. The callback will be invoked whenever the event is fired.
             *
             * @param callback {function}
             * @returns {eventBinding}
             */
            that.on = function(callback) {
                return bindCallback(callback);
            };

            /**
             * Like on() except callback will only be fired once
             *
             * @param callback {function}
             * @returns {eventBinding}
             */
            that.onceOn = function(callback) {
                var onceBinding = eventBinding({
                    callback: function () {
                        my.remove(onceBinding);
                        callback.apply(that, arguments);
                    }
                });

                bindings.push(onceBinding);
                return onceBinding;
            };

            /**
             * Removed 'binding' attached to event.
             * @param name {String} Name of event
             * @param binding {eventBinding} Binding
             */
            that.off = function (binding) {
                my.remove(binding);
            };

            /**
             * Trigger event by executing all callbacks one by one in registration order.
             *
             * @param arguments {Object|Object[]} Arguments passed to callback of each binding
             */
            that.trigger = function () {
                var params = Array.prototype.slice.call(arguments);
                bindings.forEach(function(binding) {
                    binding.execute(params);
                });
            };

            /**
             * Unbind all callbacks bound to this event.
             */
            that.dispose = function() {
                bindings.slice().forEach(function(binding) {
                    binding.unbind();
                });
            };

            /**
             * @param binding {eventBinding}
             */
            my.push = function (binding) {
                bindings.push(binding);
                binding.bind(that);
            };

            /**
             * @param binding {eventBinding}
             */
            my.remove = function (binding) {
                bindings.splice(bindings.indexOf(binding), 1);
            };

            /**
             * Create and add callback binding to event
             *
             * @param callback
             * @returns {eventBinding}
             */
            function bindCallback(callback) {
                var binding = eventBinding({ callback: callback, event: that });
                bindings.push(binding);
                return binding;
            }

            return that;
        };

        /**
         * Keeps a list of events.
         *
         * @returns {{}}
         */
        var eventCategory = function () {
            var that = {};

            // Map of events with name as key
            var namedEvents = {};
            var events = [];

            /**
             * Lazily makes sure that an event exists for 'name'.
             *
             * @param name {String}
             * @returns {event} Also return the event
             */
            function ensureEventHolderFor(name) {
                if (!hasEventNamed(name)) {
                    addEvent(event(), name);
                }
                return namedEvents[name];
            }

            /**
             * Create a new event and if name i supplied adds it to event manager
             *
             * @param [name] {string} Name of event in eventHandler
             * @returns {event}
             */
            that.createEvent = function (name) {
                return addEvent(event(), name);
            };

            /**
             * Binds callback to a named event. The callback will be invoked whenever the event is fired.
             *
             * @param name {String}
             * @param callback {function}
             */
            that.on = function (name, callback) {
                return ensureEventHolderFor(name).on(callback);
            };

            /**
             * Removed 'binding' attached to event.
             * @param name {String} Name of event
             * @param binding {eventBinding} Binding
             */
            that.off = function (name, binding) {
                return ensureEventHolderFor(name).off(binding);
            };

            /**
             * Like on() except callback will only be fired once
             *
             * @param name
             * @param callback
             * @returns {*}
             */
            that.onceOn = function (name, callback) {
                return ensureEventHolderFor(name).onceOn(callback);
            };

            /**
             * Trigger all callbacks attached to event
             * @param name
             * @param arguments Any arguments to trigger is sent as arguments to callback.
             */
            that.trigger = function (name) {
                var params = Array.prototype.slice.call(arguments, 1);
                var event = ensureEventHolderFor(name);
                event.trigger.apply(that, params);
            };

            /**
             * Dispose all events.
             */
            that.dispose = function() {
                events.forEach(function(event) {
                    event.dispose();
                });

                namedEvents = {};
                events = [];
            };


            /**
             * Answers true if an event with name exists
             *
             * @param name {String}
             * @returns {boolean}
             */
            function hasEventNamed(name) {
                return namedEvents[name] !== undefined;
            }

            /**
             * @param event {event}
             * @param [name] {string}
             * @returns {event}
             */
            function addEvent(event, name) {
                events.push(event);
                if(name) {
                    namedEvents[name] = event;
                }
                return event;
            }

            return that;
        };

        /**
         * Binds a callback to an event
         *
         * @param spec.callback {function} Callback to execute on event
         * @param spec.event {event} Event to bind callback to

         * @returns {eventBinding}
         */
        var eventBinding = function (spec) {
            spec = spec || {};
            var that = {};

            var callback = spec.callback;
            var event = spec.event;

            /**
             * Is bound to an event
             * @returns {boolean}
             */
            that.isBound = function() {
                return event !== undefined;
            };

            /**
             * Remove itself from event, if bound.
             */
            that.unbind = function () {
                if (that.isBound()) {
                    event.off(that);
                    event = undefined;
                }
            };

            /**
             * @param anEvent
             */
            that.bind = function (anEvent) {
                that.unbind();
                if (anEvent) {
                    event = anEvent;
                }
            };

            /**
             * Executes connected callback
             * @param params
             */
            that.execute = function (params) {
                if (callback) {
                    callback.apply(that, params);
                }
            };

            return that;
        };

        /**
         * Singleton object that keeps a list of named event categories.
         */
        var eventManager = (function () {
            var that = {};

            // Map of event categories with (category) name as key
            var categories = {};

            /**
             * Register a new event category with 'name'.
             * @param name
             * @returns {eventCategory}
             */
            that.register = function (name) {
                if (categories[name]) {
                    throw ('A event category is already registered for ' + name);
                }
                categories[name] = eventCategory();

                return categories[name];
            };

            /**
             * Returns event category by name. Creates a new category if not already
             * registered.
             * @param name
             * @returns {*}
             */
            that.at = function (name) {
                if (!categories[name]) {
                    that.register(name);
                }

                return categories[name];
            };

            return that;
        })();

        // Exports Singleton event manager
        // but also expose event and event category

        eventManager.eventCategory = eventCategory;
        //@deprecated Spelling mistake
        eventManager.eventhandler = eventCategory;
        eventManager.event = event;

        return eventManager;
    });
