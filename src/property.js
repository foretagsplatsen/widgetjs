define(['./events'], function(events) {

    function valueContext (variable, validator) {
        var that = {};

        that.getValue = function() {
            return variable;
        };

        that.setValue = function(value) {
            variable = value;
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
        my.type = spec.type;
        my.validator = spec.validator;
        my.getter = spec.get;
        my.setter = spec.set;
        my.label = spec.label;
        my.events = events.eventhandler();
        my.changeEvent = my.events.createEvent('change');

        var that = {};

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
                my.setter.call(context, newValue);
                newValue = context.getValue();
            }

            my.value = newValue;
            my.events.trigger('change', newValue, oldValue);
        };

        // Public API

        that.get = my.getValue;

        that.set = my.setValue;

        that.type = my.type;

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

    return property;

});
