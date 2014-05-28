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
                if (isElementChecked === my.isSelected.get()) {
                    return;
                }

                if (my.isSelected.get()) {
                    that.asJQuery().attr('checked', 'checked');
                } else {
                    that.asJQuery().removeAttr('checked');
                }
            };

            // Render

            //TODO: Exactly the same render code as radio button except type checkbox

            that.renderContentOn = function (html) {
                var el = html.input({
                        type: 'checkbox',
                        name: my.name,
                        value: my.value.get()
                    }
                );

                html.render(my.label.get() || '');

                el.attr(my.attributes);
                el.css(my.style);

                el.click(function () {
                    var checked = jQuery(this).is(':checked');
                    //TODO: fire event or modify value? What value?
                    that.isSelected.set(checked);
                });

                if (my.isSelected.get()) {
                    el.setAttribute('checked', 'checked');
                }
            };

            return that;
        }

        return checkboxWidget;
    }
);