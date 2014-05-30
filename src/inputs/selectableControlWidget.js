define(['./controlWidget', '../property'],
    function (controlWidget, property) {

        /**
         * Base for all selectable controls (eg. option, radioButton and checkbox)
         *
         * @example
         * var bmwOption = option({ label: 'Bayerische Motoren Werke ', value: 'bmw' });
         * var mercedesOption = option({ label: 'Mercedes-Benz', value: 'mercedes', isSelected: true });
         *
         * @param [spec] controlWidget spec
         * @param {string|function} spec.label - Text to display.
         * @param {boolean|function} [spec.iSelected=false] - Indicates that the option is selected.
         * @param [my={}]
         * @returns {selectableControlWidget}
         */
        function selectableControlWidget(spec, my) {
            spec = spec || {};
            my = my || {};

            /** @typedef {controlWidget} selectableControlWidget */
            var that = controlWidget(spec, my);

            // Variables

            my.label = property({ value: spec.label });

            // Public

            that.onSelect = my.events.createEvent('select');
            that.onDeselect = my.events.createEvent('deselect');

            my.value.onChange(function(newValue, oldValue) {
                that.trigger(newValue ? 'select' : 'deselect', newValue, that);
            });

            that.value = property.proxy({
                property: my.value,
                onChange: that.updateSelect
            });

            that.label = property.proxy({
                property: my.value,
                onChange: that.update
            });

            that.select = function () {
                that.value.set(true);
            };

            that.deselect = function () {
                that.value.set(false);
            };

            // Protected

            my.updateSelect = function () {
                that.update();
            };

            return that;
        }

        return selectableControlWidget;
    }
);