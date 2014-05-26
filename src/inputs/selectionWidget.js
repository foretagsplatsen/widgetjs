define(['./controlWidget'],
    function (controlWidget) {
        /**
         * Base for all widgets where you can select one or more
         * items.
         *
         * @param spec
         * @param {(Object) => selectableControlWidget} spec.controlFactory
         * @param {selectableControlWidget[]} spec.controls
         * @param my
         * @returns {controlWidget}
         */
        function selectionWidget(spec, my) {
            spec = spec || {};
            my = my || {};

            /** @typedef {controlWidget} selectionWidget */
            var that = controlWidget(spec, my);

            var controlFactory = spec.controlFactory;
            my.controls = spec.controls || (spec.items || []).map(controlFactory);

            var isMultipleSelect = spec.isMultipleSelect;
            var selection = spec.selection;

            // Observe options if observable
            if (my.controls.onChange) {
                my.controls.onChange(function () {
                    that.update();
                });
            }

            // Public

            //TODO: get/Set value?

            that.getItems = function () {
                return my.controls.map(function (option) {
                    return option.getData();
                });
            };

            that.setItems = function (newItems) {
                my.controls = newItems.map(controlFactory);
                that.update();
            };

            that.getControls = function () {
                return my.controls.slice();
            };

            that.setControls = function (someControls) {
                my.setControls(someControls.slice());
                that.update();
            };

            that.getSelectedItems = function () {
                return that.getSelected().map(function (option) {
                    return option.getData();
                });
            };

            that.setSelectedItems = function (items) {
                var controls = items.map(my.getControlForItem);
                that.setSelected(controls);
            };

            that.getSelected = function () {
                return my.options.filter(function (option) {
                    return option.isSelected();
                });
            };

            that.setSelected = function (newSelection) {
                var currentSelection = that.getSelected();

                var controlsToDeselect = currentSelection.filter(function (currentlySelected) {
                    return !newSelection.some(function (newSelected) {
                        return currentlySelected.getId() === newSelected.getId();
                    });
                });

                var controlsToSelect = newSelection.filter(function (newSelected) {
                    return !currentSelection.some(function (currentlySelected) {
                        return newSelected.getId() == currentlySelected.getId();
                    });
                });

                controlsToDeselect.forEach(function (option) {
                    option.deselect();
                });

                controlsToSelect.forEach(function (option) {
                    option.select();
                });

                that.trigger('change', that.getSelectedItems(), currentSelection);
            };


            that.clear = function () {
                my.controls = [];
                that.update();
            };

            that.selectItem = function (item) {
                var controlToSelect = my.getOptionForItem(item);
                if (!controlToSelect) {
                    throw new Error('Item to select must exist in list of items');
                }

                var currentSelection = that.getSelected();
                if (!isMultipleSelect) {
                    currentSelection.forEach(function (option) {
                        option.deselect();
                    });
                }
                controlToSelect.select();

                that.trigger('change', that.getSelectedItems(), currentSelection);
            };

            // Protected API

            my.isSelected = function (item) {
                if (Array.isArray(selection)) {
                    return selection.indexOf(item) >= 0;
                }

                if (typeof selection === "function") {
                    return selection(item);
                }

                return item === selection;
            };

            my.getControlForItem = function (item) {
                var match = my.controls.filter(function (control) {
                    return control.getData() === item;
                });

                return match && match[0];
            };

            return that;
        }

        return selectionWidget;
    }
);