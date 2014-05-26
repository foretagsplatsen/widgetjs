define(['./optionSetWidget'],
    function (optionSetWidget) {
    // TODO: Function vs array selection
    // If selection is a function. Selected items will first be calculated
    // from function but when selection change the selection will be set to
    // an array. Good or anus? Maybe only trigger an event and not change selection
    // or only use selection on create to calculate the selected items?

    // TODO:

    /**
     * A HTML SELECT element. Represents a control that presents a menu of options.
     * The options within the menu are represented by option elements, which
     * can be grouped by optionGroup elements
     *
     * @param spec
     * @param my
     * @returns {selectWidget}
     */
    function selectWidget (spec, my) {
        spec = spec || {};
        my = my || {};

        /** @typedef {optionSetWidget} selectWidget */
        var that = optionSetWidget(spec, my);

        var isMultipleSelect = spec.isMultipleSelect;
        var selection = spec.selection;

        // Observe options if observable
        if(my.options.onChange) {
            my.options.onChange(function() {
                that.update();
            });
        }

        // Public API

        that.getOptions = function() {
            return my.getAllOptions(); // including those in option groups
        };

        that.getItems = function() {
            return my.getAllOptions().map(function(option) {
                return option.getData();
            });
        };

        that.getSelectedItems = function() {
            return that.getSelected().map(function(option) {
                return option.getData();
            });
        };

        that.setSelectedItems = function(items) {
            var options = items.map(my.getOptionForItem);
            that.setSelected(options);
        };

        that.getSelected = function() {
            return my.getAllOptions().filter(function(option) {
                return option.isSelected();
            });
        };

        that.setSelected = function(newSelection) {
            var currentSelection = that.getSelected();

            var optionsToDeselect = currentSelection.filter(function(currentlySelected) {
                return !newSelection.some(function(newSelected) {
                    return currentlySelected.getId() === newSelected.getId();
                });
            });

            var optionsToSelect = newSelection.filter(function(newSelected) {
                return !currentSelection.some(function(currentlySelected) {
                    return newSelected.getId() == currentlySelected.getId();
                });
            });

            optionsToDeselect.forEach(function(option) {
                option.deselect();
            });

            optionsToSelect.forEach(function(option) {
                option.select();
            });

            that.trigger('change', that.getSelectedItems(), currentSelection);
        };

        that.selectItem = function(item) {
            var optionToSelect = my.getOptionForItem(item);
            if(!optionToSelect) {
                throw new Error('Item to select must exist in list of items');
            }

            var currentSelection = that.getSelected();
            if(!isMultipleSelect) {
                currentSelection.forEach(function(option) {
                    option.deselect();
                });
            }
            optionToSelect.select();
            that.trigger('change', that.getSelectedItems(), currentSelection);
        };

        // Protected API

        my.getAllOptions = function() {
            return my.options.reduce(function(options, item) {
                // group
                if(item.getOptions) {
                    return options.concat(item.getOptions());
                }

                return options.concat([item]);
            },[]);
        };

        my.isSelected = function(item) {
            if(Array.isArray(selection)) {
                return selection.indexOf(item) > 0;
            }

            if(typeof selection === "function") {
                return selection(item);
            }

            return item === selection;
        };

        my.getOptionForItem = function(item) {
            var match = my.getAllOptions().filter(function(option) {
                return option.getData() === item;
            });

            return match && match[0];
        };

        // Render

        that.renderContentOn = function(html) {
            var el = html.select(my.options.get ? my.options.get() : my.options);

            if(name) {
                el.setAttribute('name', name);
            }

            if(isMultipleSelect) {
                el.setAttribute('multiple');
            }

            // Extra attributes/styles
            el.attr(my.attributes);
            el.css(my.style);

            el.change(function () {
                var identifiersOfSelectedOptions = Array.prototype.slice.call(this.selectedOptions)
                    .map(function(option) {
                        return option.id;
                    });

                var selected = my.options.filter(function(option) {
                    return identifiersOfSelectedOptions.indexOf(option.getId()) >= 0;
                });

                that.setSelected(selected);
            });
        };

        return that;
    }

    return selectWidget;
}
);