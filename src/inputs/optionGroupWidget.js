define(['./selectionWidget', './optionWidget'],
    function (selectionWidget, optionWidget) {

        /**
         * A HTML OPTGROUP - A grouping of options within a select element
         *
         * @param my
         * @returns {optionGroupWidget}
         */
        function optionGroupWidget(spec, my) {
            spec = spec || {};
            my = my || {};

            spec.widget = spec.widget || optionWidget;

            /** @typedef {selectionWidget} optionGroupWidget */
            var that = selectionWidget(spec, my);

            var label = spec.label || '';

            // Protected

            my.getLabel = function () {
                return my.resultOrValue(label, that);
            };

            // Render

            that.renderOn = function (html) {
                html.optgroup({
                        id: that.getId(),
                        label: my.getLabel()
                    },
                    my.controls
                );
            };

            return that;
        }

        return optionGroupWidget;

    }
);