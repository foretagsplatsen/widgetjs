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

            my.label = my.dataProperty({ value: spec.label });

            // Render

            that.renderOn = function (html) {
                html.optgroup({
                        id: that.getId(),
                        label: my.label.get()
                    },
                    my.controls
                );
            };

            return that;
        }

        return optionGroupWidget;

    }
);