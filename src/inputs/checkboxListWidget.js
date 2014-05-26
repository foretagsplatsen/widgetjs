define(['./selectionWidget', './checkboxWidget'],
    function (selectionWidget, checkboxWidget) {

        //TODO: Description
        function checkboxListWidget(spec, my) {
            spec = spec || {};
            my = my || {};

            var checkboxLabel = spec.checkboxLabel;
            var checkboxValue = spec.checkboxValue;

            spec.controlFactory = spec.controlFactory || createCheckbox;

            /** @typedef {widget} checkboxList */
            var that = selectionWidget(spec, my);

            // Protected API

            my.checkboxLabel = function (item) {
                if (!checkboxLabel) {
                    return item ? item : '';
                }

                return checkboxLabel(item);
            };

            my.checkboxValue = function (item) {
                if (!checkboxValue) {
                    return item ? item : '';
                }

                return checkboxValue(item);
            };

            // TODO: Listen for events and check stuff on/off

            // Render

            that.renderOn = function (html) {
                html.render(my.controls);
            };

            function createCheckbox(item) {
                return checkboxWidget({
                    data: item,
                    label: function () {
                        return my.checkboxLabel(item);
                    },
                    value: function () {
                        return my.checkboxValue(item);
                    },
                    isSelected: function () {
                        return my.isSelected(item);
                    }
                });
            }

            return that;
        }

        return checkboxListWidget;
    }
);