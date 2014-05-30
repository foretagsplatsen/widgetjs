define(['../widget', '../property'],
    function (widget, property) {

        /**
         * Base for all input controls.
         *
         * @param {*} spec.value - Initial Value.
         * @param {bool} [spec.isDisabled=false]
         * @param {string} [spec.name='']
         * @param {string} [spec.attributes={}]
         * @param {string} [spec.class={}]
         * @param {string} [spec.style={}]

         * @param [my]
         *
         * @returns {controlWidget}
         */
        function controlWidget(spec, my) {
            spec = spec || {};
            my = my || {};

            /** @typedef {widget} controlWidget */
            var that = widget(spec, my);

            // Variables

            my.value = property({
                value: spec.value,
                onChange: function() {
                    that.onChange.trigger(my.value.get(), that);
                }
            });
            my.name = property({ value: spec.name, default: '' });
            my.attributes = property({ value: spec.attributes, default: {}});
            my.class = property({ value: spec.class, default: {} });
            my.style = property({ value: spec.style, default: {} });
            my.isDisabled = property({ value:  spec.isDisabled, default: false });

            // Public

            that.onChange = my.events.createEvent('change');

            that.value = property.proxy({
                property: my.value,
                onChange: that.update
            });

            that.isDisabled = property.proxy({
                property: my.isDisabled,
                onChange: that.update
            });


            return that;
        }

        return controlWidget;
    }
);
