define(['./widget', './inputs'], function(widget, inputs) {

    //TODO: Clean-up fieldBase, etc- Validation, Submit, Get Values, Groups

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
        my.exludeProperties= spec.exclude || [];
        my.includeProperties= spec.include;

        //
        // Public API
        //

        that.setModel = function (model) {
            //TODO: Append properties?
            my.model = model;
        };

        // Properties

        that.appendModelProperties = function(model) {
            model = model || my.model;

            // Get all properties in model including those in prototype chain
            var properties = [];
            for(var propertyName in model) {
                if(model[propertyName] && model[propertyName].appendToForm) {
                    properties.push(propertyName);
                }
            }

            // Filter
            var filteredProperties = properties.filter(function(propertyName) {
                return my.exludeProperties.indexOf(propertyName) === -1;
            }).filter(function(propertyName) {
                return my.includeProperties === undefined ||
                    my.includeProperties.indexOf(propertyName) >= 0;
            });

            // Append to form
            filteredProperties.forEach(function(propertyName) {
                model[propertyName].appendToForm(that, { name: propertyName});
            });
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

            my.fields.push(field);
            return field;
        };

        that.checkbox = function(options) {
            var preparedOptions = my.prepareFieldOptions(options);

            var checkbox = inputs.checkbox({
                data: preparedOptions.data,
                value: preparedOptions.value,
                name: preparedOptions.name,
                label: preparedOptions.label
            });

            //TODO: Monkey patch
            checkbox.setValue = function(value) {
                checkbox.isSelected.set(value);
            };

            return that.addField(checkbox, options);
        };

        that.input = function(options) {
            var preparedOptions = my.prepareFieldOptions(options);

            var textInput = inputs.input({
                data: preparedOptions.data,
                value: preparedOptions.value,
                name: preparedOptions.name,
                type: 'text',
                label: preparedOptions.label,
                'class': preparedOptions.inputClass //TODO: Why input class
            });

            return that.addField(textInput, options);
        };

        that.password = function(options) {
            var fieldOptions = Object.create(options);
            fieldOptions.type = options.type || 'password';

            return that.input(fieldOptions);
        };

        that.number = function(options) {
            var fieldOptions = Object.create(options);
            fieldOptions.type = options.type || 'number';

            return that.input(fieldOptions);
        };

        that.select = function(options) {
            var preparedOptions = my.prepareFieldOptions(options);

            var select = inputs.select({
                data: preparedOptions.data,
                value: preparedOptions.value,
                name: preparedOptions.name,
                //selection: value, //TODO: enough with value?
                items : preparedOptions.options,
                controlLabel: preparedOptions.optionLabel,
                controlValue: preparedOptions.optionValue
            });

            return that.addField(select, options);
        };


        // Protected

        my.prepareDataOption = function(options) {
            var property = options.property;

            if(options.mutator) {
                property = accesorProperty({
                    mutator: options.mutator,
                    accessor: options.accessor
                });
            }

            if(options.attribute) {
                property = modelAttribute({
                    attribute : options.attribute,
                    model: my.model
                });
            }

            options.data = options.data || property;

            return options;
        };

        my.prepareFieldOptions = function(options) {
            return my.prepareDataOption(options);
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
            options = my.prepareDataOption(options);

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


    function accesorProperty (spec) {
        spec = spec || {};

        var that = {};

        that.get = spec.accessor;
        that.set = spec.mutator;

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