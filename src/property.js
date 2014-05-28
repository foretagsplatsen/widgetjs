define(['./events'], function(events) {

    function valueContext (variable, validator) {
        var that = {};

        that.getValue = function() {
            return variable;
        };

        that.isValid = function(value) {
            try {
                validator(value);
                return true;
            } catch (e) {
                return false;
            }
        };

        return that;
    }

    function property(spec, my) {
        spec = spec || {};
        my = my || {};

        my.value = spec.value;
        my.options = spec.options;
        my.type = spec.type;
        my.validator = spec.validator;
        my.getter = spec.get;
        my.setter = spec.set;
        my.label = spec.label;
        my.optionLabel = spec.optionLabel;
        my.optionValue = spec.optionValue;
        my.events = events.eventhandler();

        my.changeEvent = my.events.createEvent('change');

        if(spec.onChange) {
            my.changeEvent.on(spec.onChange);
        }

        var that = spec.base || {};

        // Protected API

        my.getValue = function() {
            if(my.getter) {
                var context = valueContext(my.value, my.validator);
                return my.getter.call(context);
            }

            return my.value;
        };

        my.setValue = function(newValue) {
            var oldValue = my.getValue();
            if(my.setter) {
				var context = valueContext(my.value, my.validator);
                newValue = my.setter.call(context, newValue);
            }

            my.value = newValue;
            my.changeEvent.trigger(newValue, oldValue);
        };

        // Public API

        that.get = my.getValue;

        that.set = my.setValue;

        that.type = my.type;

        that.options = my.options;

        that.optionLabel = my.optionLabel;
        that.optionValue = my.optionValue;

        that.label = my.label;

        that.onChange = my.changeEvent;

        that.validate = function() {
            if(my.validator) {
                my.validator(my.value);
            }
        };

		// Double-dispatch with the htmlCanvas' tagBrush
		that.appendToBrush = function(brush) {
			brush.appendProperty(that);
		};

        that.appendToForm = function(form, options) {
            if(my.options) {
                form.appendOptionsProperty(that, options);
            } else {
                that.appendPropertyToForm(form, options);
            }
        };

        that.appendPropertyToForm = function(form, options) {
            form.appendProperty(that, options);
        };

        that.isValid = function() {
            try {
                that.validate();
                return true;
            } catch (e) {
                return false;
            }
        };

        return that;
    }

    function stringProperty (spec, my) {
        spec = spec || {};
        my = my || {};

        var that = property(spec, my);

        that.appendPropertyToForm = function(form, options) {
            form.appendStringProperty(that, options);
        };

        return that;
    }

    function numberProperty (spec, my) {
        spec = spec || {};
        my = my || {};

        var that = property(spec, my);

        that.appendPropertyToForm = function(form, options) {
            form.appendNumberProperty(that, options);
        };

        return that;
    }

    function passwordProperty (spec, my) {
        spec = spec || {};
        my = my || {};

        var that = property(spec, my);

        that.appendPropertyToForm = function(form, options) {
            form.appendPasswordProperty(that, options);
        };

        return that;
    }

    function booleanProperty (spec, my) {
        spec = spec || {};
        my = my || {};

        var that = property(spec, my);

        that.appendPropertyToForm = function(form, options) {
            form.appendBooleanProperty(that, options);
        };

        return that;
    }

    function objectProperty (spec, my) {
        spec = spec || {};
        my = my || {};

        var that = property(spec, my);

        that.appendPropertyToForm = function(form, options) {
            //TODO: Wrapp in Group?
            form.appendModelProperties(my.value, options);
        };

        return that;
    }

    function proxyProperty (spec, my) {
        spec = spec || {};
        my = my || {};

        my.property = spec.property;
        spec.get = spec.get || my.property.get;
        spec.set = spec.set || my.property.set;

        var that = property(spec, my);

        return that;
    }

    property.bool = booleanProperty;
    property.number = numberProperty;
    property.password = passwordProperty;
    property.string = stringProperty;
    property.object = objectProperty;
    property.proxy = proxyProperty;

    return property;
});
