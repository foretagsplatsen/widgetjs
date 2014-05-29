define(['./selectableControlWidget'],
    function (selectableControlWidget) {
        /**
         * A HTML OPTION - An item within a optionGroup, select or dataList
         *
         * NOTE: All parameters that take a function is called with item as argument
         *
         * @example
         * var bmwOption = option({ label: 'Bayerische Motoren Werke ', value: 'bmw' });
         * var mercedesOption = option({ label: 'Mercedes-Benz', value: 'mercedes', isSelected: true });
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
                if (isElementSelected === my.isSelected.get()) {
                    return;
                }

                if (my.isSelected.get()) {
                    that.asJQuery().attr('selected', 'selected');
                } else {
                    that.asJQuery().removeAttr('selected');
                }
            };

            // Render

            that.renderOn = function (html) {
                var el = html.option({
                        id: that.getId(),
                        value: my.value.get()
                    },
                    my.label.get()
                );

                el.attr(my.attributes.get());
                el.css(my.style.get());

                if (my.isSelected.get()) {
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