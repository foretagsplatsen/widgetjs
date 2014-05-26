define(['./controlWidget', './optionWidget'],
    function (controlWidget, optionWidget) {

        /**
         * Base for inputs that hold a list of options.
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
         * options.getItems(); // => Array of items
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
         * @returns {optionSetWidget}
         */
        function optionSetWidget(spec, my) {
            spec = spec || {};
            my = my || {};

            /** @typedef {controlWidget} optionSetWidget */
            var that = controlWidget(spec, my);

            var optionAttributes = spec.optionAttributes;
            var optionStyle = spec.optionStyle;

            var optionLabel = spec.optionLabel;
            var optionValue = spec.optionValue;
            var optionFactory = spec.optionFactory || createOption;
            var options = spec.options || (spec.items || []).map(optionFactory);

            // Public

            that.getItems = function () {
                return my.options.map(function (option) {
                    return option.getData();
                });
            };

            that.setItems = function (newItems) {
                my.options = newItems.map(optionFactory);
                that.update();
            };

            that.getOptions = function () {
                return my.options.slice();
            };

            that.setOptions = function (someOptions) {
                my.setOptions(someOptions.slice());
                that.update();
            };

            that.clear = function () {
                my.options = [];
                that.update();
            };

            //TODO: get/Set value?

            // Protected

            my.options = options;

            // TODO: Why?
            my.isSelected = function (item) {
                return false;
            };

            my.optionLabel = function (item) {
                if (!optionLabel) {
                    return item ? item : '';
                }

                return optionLabel(item);
            };

            my.optionValue = function (item) {
                if (!optionValue) {
                    return item ? item : '';
                }

                return optionValue(item);
            };


            // Private

            function createOption(item) {
                return optionWidget({
                    data: item,
                    attributes: optionAttributes,
                    style: optionStyle,
                    label: function () {
                        return my.optionLabel(item);
                    },
                    value: function () {
                        return my.optionValue(item);
                    },
                    isSelected: function () {
                        return my.isSelected(item);
                    }
                });
            }

            return that;
        }

        return optionSetWidget;
    }
);