define(['./selectableControlWidget'],
    function (selectableControlWidget) {

        /**
         * Checkboxes let a user select ZERO or MORE options of a limited number of choices.
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

            //TODO: Exactly the same render code as radio button except type checkbox

            that.renderOn = function (html) {
                var el = html.input({
                        type: 'checkbox',
                        id: that.getId(),
                        name: my.name,
                        value: my.getValue()
                    }
                );

                html.render(my.getLabel() || '');

                el.attr(my.attributes);
                el.css(my.style);

                el.click(function () {
                    var checked = jQuery(this).is(':checked');
                    //TODO: fire event or modify value? What value?
                    that.setIsSelected(checked);
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