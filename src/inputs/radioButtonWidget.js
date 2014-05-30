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
                if (isElementChecked === my.value.get()) {
                    return;
                }

                if (my.value.get()) {
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
                        name: my.name.get()
                    }
                );

                html.render(my.label.get() || '');

                el.attr(my.attributes.get());
                el.css(my.style.get());

                el.click(function () {
                    var checked = jQuery(this).is(':checked');
                    that.value.set(checked);
                });

                if (my.value.get()) {
                    el.setAttribute('checked', 'checked');
                }
            };

            return that;
        }

        return radioButtonWidget;
    }
);