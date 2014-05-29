define(['./controlWidget'],
    function (controlWidget) {

        function inputWidget(spec, my) {
            spec = spec || {};
            my = my || {};

            /** @typedef {widget} controlWidget */
            var that = controlWidget(spec, my);

            // Variables

            my.type = spec.type || 'text';
            my.label = my.dataProperty({ value: spec.label });

            // Protected

            that.getLabel = my.label.get; //TODO: needed by form

            my.domValueChanged = function() {
                var fieldValue = that.asJQuery().val();
                my.data.set(fieldValue);
            };

            // Render

            that.renderOn = function(html) {
                var field = html.input({
                    id: that.getId(),
                    name: my.name.get(),
                    type: my.type,
                    value: my.data.get() || '', //TODO: should be value?
                    'class' : my.class.get() || ''
                });

                field.attr(my.attributes.get());
                field.css(my.style.get());

                field.blur(my.domValueChanged);
                field.change(my.domValueChanged);
            };

            return that;
        }

        return inputWidget;
    }
);
