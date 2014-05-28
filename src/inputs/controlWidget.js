define(['../widget', '../property'],
    function (widget, property) {

        /**
         * Base for all input controls. Controls must return a current value, trigger a change event when value is modified.
         * Controls can also have model data attached. Properties like value and isDisabled can then be functions that
         * take data as arguments.
         *
         * NOTE: All parameters that take a function is called with data as argument
         *
         * @param {*|function} spec.value - Initial Value.
         * @param [spec.data] - Data attached to control
         * @param {bool|function} [spec.isDisabled=false] - If set browser grey out the option and it can not be selected from browser
         * @param [my]
         * @returns {controlWidget}
         */
        function controlWidget(spec, my) {
            spec = spec || {};
            my = my || {};

            /** @typedef {widget} controlWidget */
            var that = widget(spec, my);

            // Variables

            var value = spec.value;
            var isDisabled = spec.isDisabled;

            my.name = spec.name;
            my.attributes = spec.attributes || {};
            my.style = spec.style || {};

            my.data = property({
                value: spec.data,
                onChange: function() {
                    that.onChange.trigger(that);
                }
            });

            // Public

            that.onChange = my.events.createEvent('change');

            that.data = property.proxy({
                property: my.data,
                onChange: function() {
                    that.update();
                }
            });

            that.getValue = function () {
                return my.getValue();
            };

            that.setValue = function (newValue) {
                my.setValue(newValue);
                that.update();
            };

            // Protected

            my.value = property({
                value: spec.value,
                onChange: function() {
                    that.onChange.trigger(that);
                }
            });


            my.getValue = function () {
                if (!value) {
                    return my.data.get();
                }

                return my.resultOrValue(value, my.data.get(), that);
            };

            my.setValue = function (newValue) {
                value = newValue;
                that.onChange.trigger(that);
            };

            my.isDisabled = function () {
                return my.resultOrValue(isDisabled, my.data, that);
            };

            /**
             * If first argument is a function it's executed with the rest of the arguments. If not
             * a function first argument is returned as value.
             *
             * @param arg
             * @returns {*}
             */
            my.resultOrValue = function(arg) {
                if (typeof arg === "function") {
                    var params = Array.prototype.slice.call(arguments, 1);
                    return arg.apply(this, params);
                }

                return arg;
            };

            return that;
        }

        return controlWidget;
    }
);
