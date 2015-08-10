define([], function() {

  function arrayGridSource(spec, my) {
    spec = spec || {};
    my = my || {};

    my.elements = spec.elements || spec.source || [];
    my.page = spec.page || 0; //TODO: we onbly need a more button
    my.pageSize = spec.pageSize;
    my.orderBy = createOrderBy(spec.orderBy);
    my.searchOn = createSearchOn(spec.searchOn);
    my.hasMore = true;

    var that = {};

    that.hasMore = function() {
      return my.hasMore;
    };

    that.setPageSize = function(pageSize) {
      my.pageSize = pageSize;
    };

    that.setOrderBy = function(newValue) {
      my.orderBy = createOrderBy(newValue);
      my.page = 0;
    };

    that.setSearchOn = function(newValue) {
      my.searchOn = createSearchOn(newValue);
      my.page = 0;
    };

    that.setSearch = function(searchString) {
      my.search = searchString;
      my.page = 0;
    };

    that.getCurrentElements = function() {
      var currentElements = my.elements.slice();

      if (my.searchOn) {
        currentElements = currentElements.filter(my.searchOn);
      }

      // Paging
			if(my.pageSize) {
	      var numItems = Math.min(my.pageSize * my.page, currentElements.length);
	      my.hasMore = numItems < currentElements.length;
	      currentElements = currentElements.slice(0, numItems);
			}

      if (my.orderBy) {
        currentElements.sort(my.orderBy);
      }

      return currentElements;
    };

    // getNextPage?
    that.getNextElements = function(callback) {
      my.page += 1;
      callback(that.getCurrentElements());
    };

    //
    // Private
    //

    function createOrderBy(newValue) {
      if (!newValue) {
        return undefined;
      } else if (typeof newValue === 'function') {
        return newValue;
      } else if (typeof newValue === 'string' && newValue.constructor === 'String') {
        return function(a, b) {
          return a[newValue] < b[newValue] ? -1 : (a[newValue] > b[newValue] ? 1 : 0);
        };
      } else {
        throw new Error('Invalid attribute');
      }
    }

    function createSearchOn(newValue) {
      if (!newValue) {
        return function(item) {
          if (item.match) { //TODO: check if function
            return !my.search || item.match(my.search);
          }

          return true;
        };
      } else if (typeof newValue === 'function') {
        return newValue;
      } else if (typeof newValue === 'string' && newValue.constructor === 'String') {
        return function(item) {

          //TODO: check type of item[newValue]
          //TODO: execute function if function

          return item[newValue].toLowerCase().indexOf(my.search) !== -1;
        };
      }
      //TODO: support string array
      else {
        throw new Error('Invalid attribute');
      }
    }

    return that;
  }

  arrayGridSource.validFor = function(source) {
    return typeof source === "object" && source.constructor === Array;
  };

  return arrayGridSource;
});
