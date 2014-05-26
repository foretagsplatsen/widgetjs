define(['./selectWidget', './radioButtonWidget'],
    function (selectWidget, radioButtonWidget) {
        //TODO: Implement
        function radioButtonListWidget(spec, my) {
            spec = spec || {};
            my = my || {};

            var radioButtonLabel = spec.radioButtonLabel;
            var radioButtonValue = spec.radioButtonValue;

            spec.optionFactory = spec.optionFactory || createRadioButton;

            /** @typedef {selectWidget} radioButtonListWidget */
            var that = selectWidget(spec, my);


            // Protected API

            my.radioButtonLabel = function (item) {
                if (!radioButtonLabel) {
                    return item ? item : '';
                }

                return radioButtonLabel(item);
            };

            my.radioButtonValue = function (item) {
                if (!radioButtonValue) {
                    return item ? item : '';
                }

                return radioButtonValue(item);
            };

            // TODO: Listen for events and check stuff on/off

            // Render

            that.renderOn = function (html) {
                html.render(my.options);
            };

            function createRadioButton(item) {
                return radioButtonWidget({
                    data: item,
                    label: function () {
                        return my.radioButtonLabel(item);
                    },
                    value: function () {
                        return my.radioButtonValue(item);
                    },
                    isSelected: function () {
                        return my.isSelected(item);
                    }
                });
            }

            return that;
        }

        return radioButtonListWidget;
    }
);