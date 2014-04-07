define(['./widget', './inputs'], function(widget, inputs) {

    //TODO: Complex Properties, Clean-up fieldBase, etc- Validation, Submit, Get Values, Groups

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
        my.model = spec.model;
        my.fieldOptions = spec.fieldOptions || {};

        //
        // Public API
        //

        that.setModel = function (model) {
            my.model = model;
        };

        // Properties

        that.appendModelProperties = function(model) {
            model = model || my.model;
            for(var propertyName in model) {
                if(model[propertyName] && model[propertyName].appendToForm) {
                    model[propertyName].appendToForm(that, { name: propertyName});
                }
            }
        };

        my.appendPropertyInput = function(property, fieldFactory, options) {
            var spec = {
                property: property,
                name: options.name,
                label: property.label,
                validator: property.validator,
                options : property.options,
                optionLabel: property.optionLabel,
                optionValue: property.optionValue
            };

            // Overrides
            var overrides = my.fieldOptions[options.name];
            if(overrides) {
                fieldFactory = that[overrides.field] || fieldFactory; //TODO: put fields in a map?
                jQuery.extend(spec, overrides);
            }

            return fieldFactory(spec);
        };

        that.appendProperty = function(property, options) {
            return my.appendPropertyInput(property, that.input, options);
        };

        that.appendOptionsProperty = function(property, options) {
            return my.appendPropertyInput(property, that.select, options);
        };

        that.appendStringProperty = function(property, options) {
            return my.appendPropertyInput(property, that.input, options);
        };

        that.appendNumberProperty = function(property, options) {
            return my.appendPropertyInput(property, that.number, options);
        };

        that.appendPasswordProperty = function(property, options) {
            return my.appendPropertyInput(property, that.password, options);
        };

        that.appendBooleanProperty = function(property, options) {
            return my.appendPropertyInput(property, that.checkbox, options);
        };

        // Fields

        that.addField = function(field, options) {
            var property = options.property;
            var mutator = options.mutator;
            var accessor = options.accessor;
            var attribute = options.attribute;

            if(property) {
                mutator = property.set;
                accessor = property.get;

                property.onChange(function(newValue) {
                    field.setValue(newValue, true);
                });
            } else if(attribute) {
                var attr = modelAttribute({ attribute : attribute, model: my.model});
                mutator = attr.set;
                accessor = attr.get;
            }

            if(mutator) {
                field.on('change', function(newValue) {
                    mutator(newValue);
                });
            }

            if(accessor) {
                var value = accessor();
                field.setValue(value, true);
            }

            my.fields.push(field);
            return field;
        };

        // TODO: better solution?

        that.checkbox = function(options) {
            return that.addField(checkboxField(my.prepareFieldOptions(options)), options);
        };

        that.input = function(options) {
            var inputOptions = my.prepareFieldOptions(options);
            return that.addField(inputField(inputOptions), options);
        };

        that.password = function(options) {
            var fieldOptions = Object.create(options);
            fieldOptions.type = options.type || 'password';

            return that.addField(inputField(my.prepareFieldOptions(fieldOptions)), options);
        };

        that.number = function(options) {
            var fieldOptions = Object.create(options);
            fieldOptions.type = options.type || 'number';

            return that.addField(inputField(my.prepareFieldOptions(fieldOptions)), options);
        };

        that.select = function(options) {
            return that.addField(selectField(my.prepareFieldOptions(options)), options);
        };


        // Protected

        //TODO: crappy solution
        my.prepareFieldOptions = function(options) {
            return options;
        };

        my.findField = function(predicate) {
            for(var fieldIndex = 0; fieldIndex < my.fields.length; fieldIndex++) {
                if(predicate(my.fields[fieldIndex])) {
                    return my.fields[fieldIndex];
                }
            }
        };

        my.getFieldByName = function(name) {
            return my.findField(function(field) {
                return field.getName && field.getName() === name;
            });
        };

        //TODO: needed?
        my.getGroups = function() {
            return my.fields.reduce( function (groups, field) {
                var name = field && field.getGroup && field.getGroup();
                if(name) {
                    groups[name] = groups[name] || [];
                    groups[name].push(field);
                }
            }, {} );
        };

        that.renderContentOn = function(html) {
            var form = html.form();

            if (formClass) {
                form.addClass(formClass);
            }

            form.render(my.fields);
        };

        return that;
    };


    // BOOTSTRAP FORMS
    //TODO: Move to separate files

    function basicForm (spec, my) {
        spec = spec || {};
        my = my || {};

        var controlGroupClass = spec.controlGroupClass || 'form-group';
        var controlGroupLabelClass = spec.controlGroupLabelClass || '';

        var that = formWidget(spec, my);

        that.renderContentOn = function(html) {
            var form = html.form();

            if (spec.formClass) {
                form.addClass(spec.formClass);
            }

            form.render(my.fields.map(my.fieldRenderer));
        };

        my.fieldRenderer = function(field) {
            return function (html) {
                html.div().addClass(controlGroupClass).render(function (html) {
                    if (field.getLabel && field.getLabel()) {
                        html.label({ 'for': field.getName() }, field.getLabel()).addClass(controlGroupLabelClass);
                    }
                    html.render(field);
                });
            };
        };

        my.prepareFieldOptions = function(options) {
            var fieldOptions = Object.create(options);
            fieldOptions.inputClass = options.inputClass || 'form-control';

            return fieldOptions;
        };

        return that;
    }

    function horizontalForm (spec, my) {
        spec = spec || {};
        my = my || {};

        var controlGroupClass = spec.controlGroupClass || 'form-group';
        var controlGroupLabelClass = spec.controlGroupLabelClass || 'col-sm-2 control-label';
        var controlGroupFieldWrapperClass = spec.controlGroupFieldWrapperClass || 'col-sm-10';
        spec.formClass = spec.formClass || 'form-horizontal';

        var that = basicForm(spec, my);

        my.fieldRenderer = function(field) {
            return function (html) {
                html.div().addClass(controlGroupClass).render(function (html) {
                    if (field.getLabel && field.getLabel()) {
                        html.label({ 'for': field.getName() }, field.getLabel()).addClass(controlGroupLabelClass);
                    }
                    html.div({ 'class' : controlGroupFieldWrapperClass}, field);
                });
            };
        };
        return that;
    }

    function inlineForm (spec, my) {
        spec = spec || {};
        my = my || {};

        spec.controlGroupLabelClass = spec.controlGroupLabelClass || 'sr-only';
        spec.formClass = spec.formClass || 'form-inline';

        var that = basicForm(spec, my);
        return that;
    }

    formWidget.basicForm = basicForm;
    formWidget.horizontalForm = horizontalForm;
    formWidget.inlineForm = inlineForm;

    function formField(spec, my) {
        spec = spec || {};
        my = my || {};

        var that = widget(spec, my);

        var name = spec.name;
        var value = spec.value;
        var label = spec.label;
        var fieldId = spec.id || (that.getId() + '_field');

        // Protected API

        my.fieldId = fieldId;

        my.updateFieldValue = function() {
            that.update();
        };

        my.validate = function() {
            console.log('Validate', that.getValue());
        };

        // Public API

        that.getName = function() {
            return name || fieldId;
        };

        that.setValue = function(newValue, omitEvent) {
            var previousValue = value;
            value = newValue;
            my.updateFieldValue();

            if(omitEvent !== true) {
                that.trigger('change', value, previousValue);
            }
        };

        that.getValue = function() {
            return value;
        };

        that.getLabel = function() {
            return label;
        };

        return that;
    }


    function inputField(spec, my) {
        spec = spec || {};
        my = my || {};

        var that = formField(spec, my);

        var inputType = spec.type || 'text';
        var inputClass = spec.inputClass || '';
        var validateWhileTyping = spec.validateWhileTyping !== undefined ?
            spec.validateWhileTyping : true;

        // Protected API

        my.updateFieldValue = function() {
            jQuery('#' + my.fieldId).val(that.getValue());
        };

        my.updateFromFieldValue = function() {
            var fieldValue = jQuery('#' + my.fieldId).val();
            that.setValue(fieldValue);
        };

        that.renderContentOn = function(html) {
            var field = html.input({
                id: my.fieldId,
                name: that.getName(),
                type: inputType,
                value: that.getValue() || '',
                'class': inputClass
            });

            if (validateWhileTyping) {
                field.keyup(function() {
                    my.validate();
                });
            }

            field.blur(my.updateFromFieldValue);
            field.change(my.updateFromFieldValue);
        };

        return that;
    }


    function checkboxField(spec, my) {
        spec = spec || {};
        my = my || {};

        var that = formField(spec, my);

        var inputClass = spec.inputClass || '';

        // Protected API

        my.updateFieldValue = function() {
            jQuery('#' + my.fieldId).prop('checked', that.getValue());
        };

        that.renderContentOn = function(html) {
            var input = html.input({
                id: my.fieldId,
                name: that.getName(),
                type: 'checkbox',
                'class' : inputClass
            });

            if (that.getValue()) {
                input.asJQuery().prop('checked', true);
            }

            input.click(function() {
                var checked = jQuery(this).is(':checked');
                that.setValue(checked);
            });

            //html.label(input);

            return input;
        };

        return that;
    }

    function selectField(spec, my) {
        spec = spec || {};
        my = my || {};

        var that = formField(spec, my);

        var options = spec.options || [];
        var inputClass = spec.inputClass || '';

        // Sub widgets

        var select = inputs.select({
            items : options,
            selection: that.getValue(),
            optionLabel: spec.optionLabel,
            optionValue: spec.optionValue
        });

        select.onChange(function(selection) {
            if(!selection || !selection[0] || selection[0] === that.getValue()) {
                return;
            }

            that.setValue(selection[0]);
        });

        // Protected

        my.updateFieldValue = function() {
            select.selectItem(that.getValue());
        };

        // Render

        that.renderContentOn = function(html) {
            html.render(select);
        };

        return that;
    }

    function modelAttribute (spec) {
        spec = spec || {};

        var model = spec.model;
        var path = spec.attribute;

        if (typeof path === "string") {
            path = path.split('.');
        }

        var that = {};

        that.get = function() {
            var value = model;
            path.forEach(function (attr) {
                if (value !== null && value.hasOwnProperty(attr)) {
                    value = value[attr];
                }
                else {
                    value = null;
                }
            });

            return value;
        };

        that.set = function(val) {
            var node = model;
            for (var i = 0; i < path.length; i++) {
                var attr = path[i];
                if (i < path.length - 1) {
                    if (typeof node[attr] === 'undefined') {
                        node[attr] = {};
                    }
                }
                else {
                    node[attr] = val;
                }
                node = node[attr];
            }
        };

        return that;
    }


    return formWidget;
});