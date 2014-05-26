define(['./optionSetWidget'],
    function (optionSetWidget) {

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

            var label = spec.label || '';

            // Protected

            my.getLabel = function () {
                return resultOrValue(label, that);
            };

            // Render

            that.renderOn = function (html) {
                html.optgroup({
                        id: that.getId(),
                        label: my.getLabel()
                    },
                    my.options
                );
            };

            return that;
        }

        return optionGroupWidget;

    }
);