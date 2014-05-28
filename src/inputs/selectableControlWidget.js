define(['./controlWidget'],
    function (controlWidget) {

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

            var isSelected = spec.isSelected;
            var label = spec.label;

            // Public

            that.onSelect = my.events.createEvent('select');
            that.onDeselect = my.events.createEvent('deselect');

            //TODO: Change that.onChange = that.onSelect.or.that.onDeselect

            that.isSelected = function () {
                return my.isSelected();
            };

            that.setIsSelected = function (newState, force) {
                //TODO: reusable?
                // Only update if value changed
                var newStateValue = my.resultOrValue(newState, my.data.get(), that);
                if (newStateValue === my.isSelected() && force !== undefined) {
                    return;
                }

                isSelected = newState;

                that.trigger('change', that, my.isSelected());
                that.trigger(my.isSelected() ? 'select' : 'deselect',that, my.isSelected());

                my.updateSelect();
            };

            that.select = function (force) {
                that.setIsSelected(true, force);
            };

            that.deselect = function (force) {
                that.setIsSelected(false, force);
            };

            // Protected

            my.getLabel = function () {
                if (!label) {
                    return my.data.get();
                }

                return my.resultOrValue(label, my.data.get(), that);
            };

            my.isSelected = function () {
                return my.resultOrValue(isSelected, my.data.get(), that);
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