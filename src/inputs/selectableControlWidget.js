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

            my.label = my.dataProperty({ value: spec.label });

            my.isSelected = my.dataProperty({
                value: spec.isSelected,
                onChange: function() {
                    that.trigger('change', that, my.isSelected.get());
                    that.trigger(my.isSelected.get() ? 'select' : 'deselect',that, my.isSelected.get());
                }
            });

            // Public

            that.onSelect = my.events.createEvent('select');
            that.onDeselect = my.events.createEvent('deselect');

            that.isSelected = property.proxy({
                property: my.isSelected,
                onChange: function() {
                    my.updateSelect();
                }
            });

            that.select = function () {
                that.isSelected.set(true);
            };

            that.deselect = function () {
                that.isSelected.set(false);
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