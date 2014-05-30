define(['./selectableControlWidget'],
    function (selectableControlWidget) {
        /**
         * A HTML OPTION - An item within a optionGroup, select or dataList
         *
         * NOTE: All parameters that take a function is called with item as argument
         *
         * @example
         * var bmwOption = option({ label: 'Bayerische Motoren Werke ', value: 'bmw' });
         * var mercedesOption = option({ label: 'Mercedes-Benz', value: 'mercedes', value: true });
         *
         * @returns {optionWidget}
         */
        function optionWidget(spec, my) {
            spec = spec || {};
            my = my || {};

            /** @typedef {selectableControlWidget} optionWidget */
            var that = selectableControlWidget(spec, my);

            // Protected

            my.updateSelect = function () {
                var isElementSelected = that.asJQuery().attr('selected');
                if (isElementSelected === my.value.get()) {
                    return;
                }

                if (my.value.get()) {
                    that.asJQuery().attr('selected', 'selected');
                } else {
                    that.asJQuery().removeAttr('selected');
                }
            };

            // Render

            that.renderOn = function (html) {
                console.log(spec, my, that);
                var el = html.option({
                        id: that.getId()
                    },
                    my.label.get() || ''
                );

                el.attr(my.attributes.get());
                el.css(my.style.get());

                if (my.value.get()) {
                    el.setAttribute('selected', 'selected');
                }
                if (my.isDisabled.get()) {
                    el.setAttribute('disabled', 'disabled');
                }
            };

            return that;
        }

        return optionWidget;
    }
);