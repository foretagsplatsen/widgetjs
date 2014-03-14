define(['./events'], function(events) {

    function computedProperty(spec, my) {
        spec = spec || {};
        my = my || {};

        my.properties = spec.properties || [];
        my.fn = spec.fn || function() {};
        my.type = spec.type;
        my.label = spec.label;
        my.events = events.eventhandler();
        my.changeEvent = my.events.createEvent('change');
        my.options = spec.options || {};

        var that = {};

        my.properties.forEach(function(property) {
            property.onChange(function(val) {
                my.events.trigger('change', my.getValue());
            });
        });

        // Protected API

        my.getPropertyValues = function() {
            return my.properties.map(function(property) {
                return property && property.get ? property.get() : property;
            });
        };

        my.getValue = function() {
            return my.fn.apply(null, my.getPropertyValues());
        };


        // Public API

        that.get = my.getValue;

        that.type = my.type;

        that.options = my.options;

        that.label = my.label;

        that.onChange = my.changeEvent;

        that.validate = function() {
            my.properties.forEach(function(property) {
                property.validate();
            });
        };

        // Double-dispatch with the htmlCanvas' tagBrush
        that.appendToBrush = function(brush) {
            brush.appendProperty(that);
        };

        that.appendToForm = function(form) {
            form.appendProperty(that);
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

    return computedProperty;

});
