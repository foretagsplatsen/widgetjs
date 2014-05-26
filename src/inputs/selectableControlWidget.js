define(['./controlWidget'],
    function (controlWidget) {

        /**
         * If first argument is a function it's executed with the rest of the arguments. If not
         * a function first argument is returned as value.
         *
         * @param arg
         * @returns {*}
         */
        function resultOrValue(arg) {
            if (typeof arg === "function") {
                var params = Array.prototype.slice.call(arguments, 1);
                return arg.apply(this, params);
            }

            return arg;
        }

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

            var isSelected = spec.isSelected;
            var label = spec.label;

            // Public

            that.onSelect = my.events.createEvent('select');
            that.onDeselect = my.events.createEvent('deselect');

            that.isSelected = function () {
                return my.isSelected();
            };

            that.select = function (force) {
                that.toggle(true, force);
            };

            that.deselect = function (force) {
                that.toggle(false, force);
            };

            //TODO: Rename setIsSelected
            that.toggle = function (newState, force) {
                var newStateValue = resultOrValue(newState, my.data, that);
                if (newStateValue === my.isSelected() && force !== undefined) {
                    return;
                }

                isSelected = newState;

                that.trigger('change', that, my.isSelected());
                that.trigger(my.isSelected() ? 'select' : 'deselect',
                    that, my.isSelected());

                my.updateSelect();
            };

            // Protected

            my.getLabel = function () {
                if (!label) {
                    return my.data;
                }

                return resultOrValue(label, my.data, that);
            };

            my.isSelected = function () {
                return resultOrValue(isSelected, my.data, that);
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