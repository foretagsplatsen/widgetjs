define(['./selectableControlWidget'],
    function (selectableControlWidget) {

        /**
         * A button in a radioButtonList.Radio buttons let a user select
         * ONLY ONE of a limited number of choice.
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

            //TODO: Exactly the same render code as checkbox button except checkbox

            that.renderContentOn = function (html) {
                var el = html.input({
                        type: 'radio',
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

        return radioButtonWidget;
    }
);