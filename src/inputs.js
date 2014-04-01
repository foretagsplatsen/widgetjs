define(['./widget'], function(widget) {

    //TODO: TESTS
    //TODO: PROPERTIES
    //TODO: documentation

    /**
     * A HTML OPTION - An item within a optionGroup, select or dataList
     *
     * NOTE: All parameters that take a function is called with item as argument
     *
     * @example
     * var bmwOption = option({ label: 'Bayerische Motoren Werke ', value: 'bmw' });
     * var mercedesOption = option({ label: 'Mercedes-Benz', value: 'mercedes', isSelected: true });
     *
     * @param {string|function} spec.label - Text to display.
     * @param {*|function} spec.value - Value set on value attribute.
     * @param [spec.item] - Model/Item attached to option
     * @param {bool|function} [spec.iSelected=false] - Indicates that the option is selected.
     * @param {bool|function} [spec.isDisabled=false] - If set browser grey out the option and it can not be selected from browser
     * @param [my={}]
     * @returns {optionWidget}
     */
    function optionWidget (spec, my) {
        spec = spec || {};
        my = my || {};

        /** @typedef {widget} optionWidget */
        var that = widget(spec, my);

        var isSelected = spec.isSelected;
        var isDisabled = spec.isDisabled;
        var label = spec.label;
        var value = spec.value;

        my.item = spec.item;

        my.attributes = spec.attributes || {};
        my.style = spec.style || {};

        // Public

        that.onSelect = my.events.createEvent('select');
        that.onDeselect = my.events.createEvent('deselect');

        that.getItem = function () {
            return my.item;
        };

        that.setItem = function(newItem) {
            my.item = newItem;
            that.trigger('change', that);
            that.update();
        };

        that.isSelected = function() {
            return my.isSelected();
        };

        that.select = function(force) {
            if(my.isSelected() && force !== undefined) {
                return;
            }

            isSelected = true;
            that.trigger('select', that);
            my.updateSelected();
        };

        that.deselect = function(force) {
            if(!my.isSelected() && force !== undefined) {
                return;
            }

            isSelected = false;
            that.trigger('deselect', that);
            my.updateSelected();
        };

        // Protected

        my.getValue = function() {
            if(!value) {
                return my.item;
            }

            return resultOrValue(value, my.item, that);
        };

        my.getLabel = function() {
            if(!label) {
                return my.item;
            }

            return resultOrValue(label, my.item, that);
        };

        my.isSelected = function () {
            return resultOrValue(isSelected, my.item, that);
        };

        my.isDisabled = function () {
            return resultOrValue(isDisabled, my.item, that);
        };

        // Protected

        my.updateSelected = function() {
            var isElementSelected = that.asJQuery().attr('selected');
            if(isElementSelected === isSelected) {
                return;
            }

            if(isSelected) {
                that.asJQuery().attr('selected', 'selected');
            } else {
                that.asJQuery().removeAttr('selected');
            }
        };

        // Render

        that.renderOn = function(html) {
            var el = html.option({
                    id: that.getId(),
                    value: my.getValue()
                },
                my.getLabel()
            );

            el.attr(my.attributes);
            el.style(my.style);

            if (my.isSelected()) {
                el.setAttribute('selected', 'selected');
            }
            if (my.isDisabled()) {
                el.setAttribute('disabled', 'disabled');
            }
        };

        return that;
    }

    /**
     * Base for inputs that holds a list of options.
     *
     * @example
     * var options = optionSet({ options: [
     *      option({ label: 'Bayerische Motoren Werke ', value: 'bmw' }),
     *      option({ label: 'Mercedes-Benz', value: 'mercedes', isSelected: true });
     * ]});
     *
     * @example
     * var optionsFromItems = optionSet({
     *      items: [
     *          { id: 'bmw', name: 'Bayerische Motoren Werke'},
     *          { id: 'mercedes', name: 'Mercedes-Benz''}
     *      ],
     *      optionLabel: function (item, option) {
     *          return option.name;
     *      },
     *      optionValue: function (item, option) {
     *          return option.id;
     *      }
     *  });
     *
     * @example
     * var options = optionSet();
     * options.setOptions([
     *      option({ label: 'Bayerische Motoren Werke ', value: 'bmw' }),
     *      option({ label: 'Mercedes-Benz', value: 'mercedes', isSelected: true });
     * ]);
     * options.getOptions(); // => Array of options
     * options.getItem(); // => Array of items
     *
     * @example
     * var optionsFromItems = optionSet({
     *      optionLabel: function (item, option) {
     *          return option.name;
     *      },
     *      optionValue: function (item, option) {
     *          return option.id;
     *      }
     *  });
     * options.setItems([
     *     { id: 'bmw', name: 'Bayerische Motoren Werke'},
     *     { id: 'mercedes', name: 'Mercedes-Benz''}
     * ]);
     * options.getOptions(); // => Array of options
     * options.getItem(); // => Array of items
     *
     * @param {Array.optionWidget|Array} [spec.options] - Option (or any widget that answer getItem())
     * @param {Array} [spec.items]
     * @param {function} [spec.optionFactory] - Function that generate option
     * @param {function} [spec.optionLabel] - Function that take item as argument and return a label
     * @param {function} [spec.optionValue] - Function that take item as argument and return value.
     *
     * @param [my={}]
     *
     * @returns {optionSet}
     */
    function optionSetWidget  (spec, my) {
        spec = spec || {};
        my = my || {};

        /** @typedef {widget} optionSetWidget */
        var that = widget(spec, my);

        var optionAttributes = spec.optionAttributes;
        var optionStyle = spec.optionStyle;

        var optionLabel = spec.optionLabel;
        var optionValue = spec.optionValue;
        var optionFactory = spec.optionFactory || createOption;
        var options = spec.options || (spec.items || []).map(optionFactory);

        // Public

        that.getItems = function() {
            return my.options.map(function(option) {
                return option.getItem();
            });
        };

        that.setItems = function(newItems) {
            my.options = newItems.map(optionFactory);
            that.update();
        };

        that.getOptions = function() {
            return my.options.slice();
        };

        that.setOptions = function(someOptions) {
            my.setOptions(someOptions.slice());
            that.update();
        };

        that.clear = function() {
            my.options = [];
            that.update();
        };

        // Protected

        my.options = options;

        my.isSelected = function(item) {
            return false;
        };

        my.optionLabel = function(item) {
            if(!optionLabel) {
                return item ? item : '';
            }

            return optionLabel(item);
        };

        my.optionValue = function(item) {
            if(!optionValue) {
                return item ? item : '';
            }

            return optionValue(item);
        };


        // Private

        function createOption(item) {
            return optionWidget({
                item: item,
                attributes: optionAttributes,
                style: optionStyle,
                label: function() {
                    return my.optionLabel(item);
                },
                value: function() {
                    return my.optionValue(item);
                },
                isSelected: function() {
                    return my.isSelected(item);
                }
            });
        }

        return that;
    }

    /**
     * A HTML OPTGROUP - A grouping of options within a select element
     *
     * @param my
     * @returns {optionGroupWidget}
     */
    function optionGroupWidget(spec, my) {
        spec = spec || {};
        my = my || {};

        /** @typedef {optionSetWidget} optionGroupWidget */
        var that = optionSetWidget(spec, my);

        var isDisabled = spec.isDisabled;
        var label = spec.label || '';

        // Protected

        my.getLabel = function() {
            return resultOrValue(label, that);
        };

        my.isDisabled = function() {
            return resultOrValue(isDisabled, that);
        };

        // Render

        that.renderOn = function(html) {
            html.optgroup({
                    id: that.getId(),
                    label: my.getLabel()
                },
                my.options
            );
        };

        return that;
    }


        // selectedOptions

    /**
     * A HTML SELECT element. Represents a control that presents a menu of options. The options within the menu are
     * represented by option elements, which can be grouped by optionGroup elements
     *
     * @param spec
     * @param my
     * @returns {optionSet}
     */
    function selectWidget (spec, my) {
        spec = spec || {};
        my = my || {};

        var that = optionSetWidget(spec, my);

        var name = spec.name;
        var isMultipleSelect = spec.isMultipleSelect;
        var selection = spec.selection;

        my.attributes = spec.attributes || {};
        my.style = spec.style || {};

        // Observe options
        if(my.options.onChange) {
            my.options.onChange(function() {
                // TODO: check if selected is still valid
                that.update();
            });
        }

        // Public API

        that.onChange = my.events.createEvent('change');

        that.getOptions = function() {
            return my.getAllOptions(); // including those in option groups
        };

        that.getItems = function() {
            return my.getAllOptions().map(function(option) {
                return option.getItem();
            });
        };

        that.getSelectedItems = function() {
            return that.getSelected().map(function(option) {
                return option.getItem();
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
                return option.getItem() === item;
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
            el.style(my.style);

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

    return {
        option: optionWidget,
        select: selectWidget,
        optionGroup: optionGroupWidget
    };
});