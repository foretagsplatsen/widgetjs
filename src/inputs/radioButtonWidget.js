define(['./selectableControlWidget'],
    function (selectableControlWidget) {

        /**
         * A button in a radioButtonList
         *
         * @param spec
         * @param [my]
         * @returns {*}
         */
        function radioButtonWidget(spec, my) {
            spec = spec || {};
            my = my || {};

            /** @typedef {selectableControlWidget} radioButton */
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
                        type: 'radio',
                        name: my.name,
                        id: that.getId(),
                        value: my.getValue()
                    }
                );

                html.render(my.getLabel() || '');

                el.attr(my.attributes);
                el.css(my.style);

                if (my.isSelected()) {
                    el.setAttribute('checked', 'checked');
                }
            };

            return that;
        }

        return radioButtonWidget;
    }
);