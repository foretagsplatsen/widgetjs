define(['./selectionWidget', './radioButtonWidget'],
    function (selectionWidget, radioButtonWidget) {

        /**
         * One (two make more sense) or more radio buttons.
         *
         * @param [spec] selectionWidget spec
         * @param {function} [spec.radioButtonLabel] alias for controlLabel
         * @param {function} [spec.radioButtonValue] alias for controlValue
         * @param my
         * @returns {*}
         */
        function radioButtonListWidget(spec, my) {
            spec = spec || {};
            my = my || {};

            //TODO: clean-up
            spec.controlLabel = spec.controlLabel || spec.radioButtonLabel;
            spec.controlValue = spec.controlValue || spec.radioButtonValue;
            spec.widget = radioButtonWidget;

            /** @typedef {selectionWidget} radioButtonListWidget */
            var that = selectionWidget(spec, my);

            return that;
        }

        return radioButtonListWidget;
    }
);