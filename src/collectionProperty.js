define(['./property'], function(property) {

	function collectionProperty(spec, my) {
		spec = spec || {};
		my = my || {};

        spec.base = []; //TODO: Hack

		var that = property(spec, my);

		// TODO; splice it
		my.value = spec.value || [];

		// Returns a copy for the value
		that.get = function() {
			var value = my.getValue();
			return value.slice();
		};

		that.forEach = function(iterator) {
			that.get().forEach(iterator);
		};


		// Returns a new instance of `collectionProperty`, that
		// listens for the collection changes and updates itself
		that.map = function(iterator) {
			var mapped = collectionProperty({
				value: that.get().map(iterator)
			});

			that.onChange(function(newValue) {
				mapped.set(newValue.map(iterator));
			});

			return mapped;
		};

        that.filter = function(iterator) {
            var filtered = collectionProperty({
                value: that.get().filter(iterator)
            });

            that.onChange(function(newValue) {
                filtered.set(newValue.filter(iterator));
            });

            return filtered;
        };


        that.push = function(item) {
			var value = that.get();
			value.push(item);
			that.set(value);
		};

		that.appendToBrush = function(brush) {
			brush.appendCollectionProperty(that);
		};

		return that;
	}

	return collectionProperty;
});
