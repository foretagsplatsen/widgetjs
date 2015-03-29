define([
	'./sources/arrayGridSource'
], function(arrayGridSource) {

	var sources = [arrayGridSource];

	/**
	 * `sourceBuilder` is a small helper used to find the correct grid source class
	 * for the provided source
	 */
	function sourceBuilder() {
		var that = {};

		that.for = function(options) {
			var source = options.source;
			var match;
			sources.forEach(function(each) {
				if (each.validFor(source)) {
					match = each;
				}
			});

			if (match) {
				return match(options);
			} else {
				throw new Error('No matching class found for the provided class');
			}
		};

		return that;
	}

	return sourceBuilder().for;
});