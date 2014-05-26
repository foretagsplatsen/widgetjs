define(['./selectableControlWidget'],
    function (selectableControlWidget) {
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
         * The Input Checkbox object represents an HTML <input> element
         * with type="checkbox".
         *
         * @param [spec] selectableControlWidget spec
         * @param [my]
         * @returns {checkboxWidget}
         */
        function checkboxWidget(spec, my) {
            spec = spec || {};
            my = my || {};

            /** @typedef {selectableControlWidget} checkboxWidget */
            var that = selectableControlWidget(spec, my);

            // Protected

            my.updateSelect = function () {
                var isElementChecked = that.asJQuery().attr('checked');
                if (isElementChecked === my.isSelected()) {
                    return;
                }

                if (my.isSelected()) {
                    that.asJQuery().attr('checked', 'checked');
                } else {
                    that.asJQuery().removeAttr('checked');
                }
            };

            // Render

            that.renderOn = function (html) {
                var el = html.input({
                        type: 'checkbox',
                        id: that.getId()
                    }
                );

                html.render(my.getLabel() || '');

                el.attr(my.attributes);
                el.css(my.style);

                el.click(function () {
                    var checked = jQuery(this).is(':checked');
                    that.toggle(checked);
                });

                if (my.isSelected()) {
                    el.setAttribute('checked', 'checked');
                }
            };

            return that;
        }

        return checkboxWidget;

    }
);