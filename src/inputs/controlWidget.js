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

            my.name = spec.name;
            my.attributes = spec.attributes || {};
            my.style = spec.style || {};

            my.data = property({
                value: spec.data,
                onChange: function() {
                    that.onChange.trigger(that);
                }
            });

            my.value = dataProperty({ value: spec.value});

            my.isDisabled = dataProperty({ value:  spec.isDisabled, default: false });

            // Public

            that.onChange = my.events.createEvent('change');

            that.data = property.proxy({
                property: my.data,
                onChange: that.update
            });

            that.value = property.proxy({
                property: my.value,
                onChange: that.update
            });

            that.isDisabled = property.proxy({
                property: my.isDisabled,
                onChange: that.update
            });

            // Protected

            my.dataProperty = dataProperty;

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

            my.dataVariable = function(value, defaultValue) {
                if (typeof value === 'undefined') {
                    return typeof defaultValue === 'undefined' ? my.data.get() : defaultValue;
                }

                if (typeof value === "function") {
                    return value.call(this, my.data.get(), that);
                }

                return value;
            };

            /**
             * Creates a property computed from the data property. The value can be either a function or
             * a value. Functions will be applied on data but values are returned as they are.
             *
             * @param options Same as property options
             * @param options.default A default value if value is undefined (otherwise my.data)
             *
             * @returns {property}
             */
            function dataProperty(options) {
                var propertyOptions = Object.create(options);

                propertyOptions.get = options.get || function(currentValue) {
                    return my.dataVariable(currentValue, options.default);
                };

                propertyOptions.onChange = options.onChange || function() {
                    that.onChange.trigger(that);
                };

                return property(propertyOptions);
            }

            return that;
        }

        return controlWidget;
    }
);
