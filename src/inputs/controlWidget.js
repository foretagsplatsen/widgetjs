define(['../widget'],
    function (widget) {

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

            my.data = spec.data;
            my.name = spec.name;

            my.attributes = spec.attributes || {};
            my.style = spec.style || {};


            // Public

            that.onChange = my.events.createEvent('change');

            // TODO: Should we use properties instead?

            that.getData = function () {
                return my.data;
            };

            that.setData = function (data) {
                my.data = data;
                that.onChange.trigger(that);
                that.update();
            };

            that.getValue = function () {
                return my.getValue();
            };

            that.setValue = function (newValue) {
                my.setValue(newValue);
                that.update();
            };

            // Protected

            my.getValue = function () {
                if (!value) {
                    return my.data;
                }

                return my.resultOrValue(value, my.data, that);
            };

            my.setValue = function (newValue) {
                value = newValue;
                //TODO: Should event be triggered here or on that?
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
