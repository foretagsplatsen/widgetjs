define(['./selectionWidget', './checkboxWidget'],
    function (selectionWidget, checkboxWidget) {

        /**
         * One or more checkboxes.
         *
         * @param [spec] selectionWidget spec
         * @param {function} [spec.checkboxLabel] alias for controlLabel
         * @param {function} [spec.checkboxValue] alias for controlValue
         * @param [my]
         * @returns {*}
         */
        function checkboxListWidget(spec, my) {
            spec = spec || {};
            my = my || {};

            //TODO: clean-up
            spec.controlLabel = spec.controlLabel || spec.checkboxLabel;
            spec.controlValue = spec.controlValue || spec.checkboxValue;
            spec.widget = checkboxWidget;

            /** @typedef {widget} checkboxList */
            var that = selectionWidget(spec, my);

            return that;
        }

        return checkboxListWidget;
    }
);