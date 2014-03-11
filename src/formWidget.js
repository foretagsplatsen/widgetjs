define(['widgetjs/widget'], function(widget) {

    /**
     * Base for all forms
     *
     * @param spec
     * @param my
     * @returns {*}
     */
    var formWidget = function(spec, my) {
        my = my || {};
        spec = spec || {};

        var formClass = spec.formClass || spec.klass;

        var that = widget(spec, my);

        my.fields = [];

        my.registerField = function (field) {
            my.fields.push(field);
            return field;
        };

        that.appendProperty = function(property) {
            // TODO: move into property
            if(property.type === 'boolean') {
                that.checkbox({ value: property.get() });
            } else if(property.type === 'password') {
                that.password({ value: property.get() });
            } else if(property.type === 'number') {
                that.number({ value: property.get() });
            } else if(property.type === 'options') {
                that.select({ value: property.get(), options: property.options });
            } else {
                that.input({ value: property.get() });
            }
        };

        that.addField = function(field, options) {
            my.registerField(field);
            return field;
        };

        that.setModel = function (model) {
            for(var propertyName in model) {
                if(model[propertyName] && model[propertyName].appendToForm) {
                    model[propertyName].appendToForm(that);
                }
            }
        };

        that.renderContentOn = function(html) {
            var form = html.form();

            if (formClass) {
                form.addClass(spec.klass);
            }

            form.render(my.fields);
        };

        that.checkbox = function(options) {
            return that.addField(checkboxField(options), options);
        };

        that.input = function(options) {
            return that.addField(inputField(options), options);
        };

        that.password = function(options) {
            var fieldOptions = Object.create(options);
            fieldOptions.type = options.type || 'password';

            return that.addField(inputField(fieldOptions), options);
        };

        that.number = function(options) {
            var fieldOptions = Object.create(options);
            fieldOptions.type = options.type || 'number';

            return that.addField(inputField(fieldOptions), options);
        };

        that.select = function(options) {
            return that.addField(selectField(options), options);
        };

        // Init
        if(spec.model) {
            that.setModel(spec.model);
        }

        return that;
    };

    function inputField(spec, my) {
        spec = spec || {};
        my = my || {};

        var that = widget(spec, my);

        var id = spec.id || (that.getId() + '_input');
        var value = spec.value;
        var type = spec.type || 'text';
        var validateWhileTyping = spec.validateWhileTyping !== undefined ? spec.validateWhileTyping : true;

        my.getFieldValue = function() {
            return jQuery(id).val();
        };

        my.setFieldValue = function(val) {
            jQuery(id).val(val);
            that.trigger('change', val, that);
        };

        my.updateFieldValue = function() {
            my.setFieldValue(my.getFieldValue ());
        };

        my.validate = function() {

        };

        that.renderContentOn = function(html) {
            var field = html.input({
                id: id,
                type: type,
                value: value || ''
            });

            if (validateWhileTyping) {
                field.keyup(function() {
                    my.validate();
                });
            }

            field.blur(my.updateFieldValue);
            field.change(my.updateFieldValue);
        };

        return that;
    }


    function checkboxField(spec, my) {
        spec = spec || {};
        my = my || {};

        var that = widget(spec, my);

        var id = spec.id || spec.attribute || (that.getId() + '_input');
        var value = spec.value || spec.defaultValue;

        my.getFieldValue = function() {
            return jQuery(id).val();
        };

        my.setFieldValue = function(val) {
            jQuery(id).val(val);
            that.trigger('change', val, that);
        };

        my.updateFieldValue = function() {
            that.setFieldValue(my.getFieldValue ());
        };

        my.validate = function() {

        };


        that.renderContentOn = function(html) {
            var input = html.input({
                id: id,
                type: 'checkbox'
            });

            var label = html.label(input);

            if (value) {
                input.asJQuery().prop('checked', true);
            }

            return input;
        };

        return that;
    }

    function selectField(spec, my) {
        spec = spec || {};
        my = my || {};

        var that = widget(spec, my);

        var id = spec.id || spec.attribute || (that.getId() + '_input');
        var value = spec.value || spec.defaultValue;
        var options = spec.options || [];

        my.getFieldValue = function() {
            return jQuery(id).val();
        };

        my.setFieldValue = function(val) {
            jQuery(id).val(val);
            that.trigger('change', val, that);
        };

        my.updateFieldValue = function() {
            that.setFieldValue(my.getFieldValue ());
        };

        my.validate = function() {

        };

        that.renderContentOn = function(html) {
            var select = html.select({ id: id}, options.map(function(item) {
                var option = html.option(item);
                option.setAttribute('value', item);

                if (item === value) {
                    option.setAttribute('selected', 'selected');
                }

                return option;
            }));

            select.change(function() {
                var value = jQuery(this).val();
                that.trigger('change', value, that);
            });
        };

        return that;
    }


    return formWidget;
});