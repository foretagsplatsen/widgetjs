define([
	'./abstractGridSource'
], function(abstractGridSource) {

	/**
	 * `arrayGridSource` is
	 */
	function arrayGridSource(spec, my) {
		spec = spec || {};
		my = my || {};

		var that = abstractGridSource(spec, my);

		my.orderedSource = my.source;

		//
		// Public
		//

		that.setOrderBy = function(newValue) {
			if (newValue) {
				if (typeof newValue === 'function') {
					my.orderBy = newValue;
				} else if (typeof newValue === 'string' && newValue.constructor === 'String') {
					my.orderBy = function(a, b) {
						return a[newValue] < b[newValue] ? -1 : (a[newValue] > b[newValue] ? 1 : 0);
					};
				} else {

					throw new Error('Invalid attribute');
				}

			} else {
				my.orderBy = newValue;
			}

			my.orderedSource = my.source.sort(my.orderBy);
			my.page = 0;
		};

		that.setSearch = function(newValue) {
			my.search = newValue.toLowerCase();

			if (newValue) {
				my.orderedSource = my.orderedSource.filter(function(item) {
					if(my.searchOn) {
						//TODO: check if function
						var match = my.searchOn(item);
						if(match) {
							return match(my.search);
						}
					}

					return my.searchableString(item).toLowerCase().indexOf(my.search) !== -1;
				});

			} else {
				my.orderedSource = my.source.sort(my.orderBy);

			}

			my.page = 0;
		};

		that.getNextElements = function(callback) {
			var from = my.pageSize * my.page;
			var to = from + my.pageSize;
			to = Math.min(to, my.orderedSource.length);
			var elements = my.orderedSource.slice(from, to);
			my.hasMore = to < my.orderedSource.length;

			my.page += 1;
			callback(elements);
		};

		if (my.orderBy) {
			that.setOrderBy(my.orderBy);
		}

		return that;
	}

	arrayGridSource.validFor = function(source) {
		return typeof source === "object" && source.constructor === Array;
	};

	return arrayGridSource;
});