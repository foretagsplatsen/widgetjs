define(['./selectionWidget', './optionWidget'],
    function (selectionWidget, optionWidget) {
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

        spec.widget = spec.widget || optionWidget;

        /** @typedef {optionSetWidget} selectWidget */
        var that = selectionWidget(spec, my);


        // Public API

        that.getOptions = function() {
            return my.getAllOptions(); // including those in option groups
        };

        that.getItems = function() {
            return my.getAllOptions().map(function(option) {
                return option.data.get();
            });
        };

        that.getSelected = function() {
            return my.getAllOptions().filter(function(option) {
                return option.isSelected.get();
            });
        };

        // Protected API

        my.getAllOptions = function() {
            return my.controls.reduce(function(options, item) {
                // group
                if(item.getOptions) {
                    return options.concat(item.getOptions());
                }

                return options.concat([item]);
            },[]);
        };

        // Render

        that.renderOn = function(html) {
            var el = html.select({id: that.getId()}, my.controls.get ? my.controls.get() : my.controls);

            if(name) {
                el.setAttribute('name', name);
            }

            if(my.isMultipleSelect) {
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

                var selected = my.controls.filter(function(option) {
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