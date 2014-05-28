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

            //TODO: require controlFactory?
            //TODO: Validat input in general?

            /** @typedef {controlWidget} selectionWidget */
            var that = controlWidget(spec, my);

            //TODO: Document
            var widget = spec.widget;
            var controlFactory = spec.controlFactory || createControl;

            var selection = spec.selection;

            my.isMultipleSelect = spec.isMultipleSelect;

            my.controlAttributes = spec.controlAttributes;
            my.controlStyle = spec.controlStyle;
            my.controlLabel = spec.controlLabel;
            my.controlValue = spec.controlValue;
            my.controls = spec.controls || (spec.items || []).map(controlFactory);

            //TODO: Update after setItems / setControls

            // Observe options if observable
            if (my.controls.onChange) {
                my.controls.onChange(function () {
                    that.update();
                });
            }

            //TODO: Watch and trigger events

            // Public

            that.getItems = function () {
                return my.controls.map(function (control) {
                    return control.data.get();
                });
            };

            that.setItems = function (newItems) {
                my.setControls(newItems.map(controlFactory));
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
                    return option.data.get();
                });
            };

            that.setSelectedItems = function (items) {
                var controls = items.map(my.getControlForItem);
                that.setSelected(controls);
            };

            that.getSelected = function () {
                return my.controls.filter(function (control) {
                    return control.isSelected();
                });
            };

            that.setSelected = function (newSelection) {
                var currentSelection = that.getSelected();

                //TODO: Explain

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

                //TODO: Check if selection did change (for event loops)?

                that.trigger('change', that.getSelectedItems(), currentSelection);
            };


            that.clear = function () {
                my.controls = [];
                that.update();
            };

            //TODO: needed and working?
            that.selectItem = function (item) {
                var controlToSelect = my.getControlForItem(item);
                if (!controlToSelect) {
                    throw new Error('Item to select must exist in list of items');
                }

                var currentSelection = that.getSelected();
                if (!my.isMultipleSelect) {
                    currentSelection.forEach(function (option) {
                        option.deselect();
                    });
                }
                controlToSelect.select();

                //TODO: Check if selection did change (for event loops)?

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
                    return control.data.get() === item;
                });

                return match && match[0];
            };

            function createControl(item) {
                return widget({
                    data: item,
                    label: function () {
                        return my.resultOrValue(my.controlLabel, item, that);
                    },
                    value: function () {
                        return my.resultOrValue(my.controlValue, item, that);
                    },
                    isSelected: function () {
                        return my.resultOrValue(my.isSelected, item, that);
                    }
                });
            }

            // Render

            that.renderOn = function (html) {
                html.render(my.controls);
            };

            return that;
        }

        return selectionWidget;
    }
);