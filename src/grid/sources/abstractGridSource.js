define([], function() {

	/**
	 * `abstractGridSource` is
	 */
	function abstractGridSource(spec, my) {
		spec = spec || {};
		my = my || {};

		var that = {};

		my.source = spec.source;
		my.page = spec.page || 0;
		my.pageSize = spec.pageSize || 10;
		my.orderBy = spec.orderBy;
		my.searchableString = spec.searchableString || function(item) {
			return item.toString();
		};

		my.search = "";

		my.hasMore = true;

		//
		// Public
		//

		that.hasMore = function() {
			return my.hasMore;
		};

		that.setPageSize = function(pageSize) {
			my.pageSize = pageSize;
		};

		that.setOrderBy = function(newValue) {
			my.orderBy = newValue;
		};

		that.setSearch = function(newValue) {
			search = newValue;
		};

		that.getNextElements = function(callback) {
			// callback us a function with two arguments
			//
			//     function(elements) {}
			//
			// with:
			//
			// - `elements` is an array of new elements
			//
			// Do not forget to increase `my.page`!
		};

		return that;
	}

	abstractGridSource.validFor = function(source) {
		return false;
	};

	return abstractGridSource;
});