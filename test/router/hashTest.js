define([
	'widgetjs/router/hash',
    'chai'
], function (hash, chai) {

        var assert = chai.assert;

        // Helpers

		function delayedSteps() {
			var steps = Array.prototype.slice.call(arguments);

			function next() {
				if (steps.length === 0) {
					return;
				}
				var fn = steps.shift();
				setTimeout(function () {
					next(fn.apply(next, arguments));
				}, 10);
			}

			next();
		}

		function setHash(aHash) {
			window.location.hash = aHash;
			window.open(window.location, '_self', true);
			jQuery(window).trigger( 'hashchange');
		}

		var my, hashLocation;

		suite("hash");

        beforeEach(function() {
				window.location.hash = '';

				my = {};
				hashLocation = hash({}, my);
	    });

        afterEach(function() {
            if(hashLocation) {
                hashLocation.stop();
            }
            window.location.hash = '';
		});

		test("hash defaults", function () {
			// Assert that defaults are correct
			assert.equal(my.currentHash, undefined, 'current hash is undefined');
			assert.equal(my.history.length, 0, 'history is empty');
		});

		test("start() initilize hash", function () {
			// Arrange: set a location hash
			window.location.hash = '#!/test';

			// Act: start listening
			hashLocation.start();

			// Assert that hash is current location and history is set
			assert.equal(my.currentHash, '#!/test', 'current hash is window location hash');
			assert.equal(my.history.length, 1, 'history have one entry');
			assert.equal(my.history[0], my.currentHash, 'history entry is current hash');
		});

		test("start() resets hash", function () {
			// Arrange: add some history
			hashLocation.start();
			setHash('#!/a');
			setHash('#!/b');

			// Act: restart hash
			hashLocation.start();

			// Assert that hash was reset,
			assert.equal(my.history.length, 1, 'history have one entry');
			assert.equal(my.history[0], my.currentHash, 'history entry is current hash');
		});

		if(!($.browser.msie  && parseInt($.browser.version, 10) === 7)) {
			test("triggers changed event when URL is changed", function (done) {
				// Arrange: listen for url changes
				var capturedUrls = [];
				hashLocation.on('changed', function(url) {
					capturedUrls.push(url.toString());
					if(capturedUrls.length === 3) {
						done();
					}
				});

				// Act: start listening for changes and change URL 3 times
				hashLocation.start();
				setHash('#!/a');
				setHash('#!/b');
				setHash('#!/c');

				// Assert that event was triggered for each url
				assert.deepEqual(capturedUrls, ['a', 'b', 'c'], 'Event triggered');
			});
		}

		test("getUrl() returns location.hash minus hash-bang", function () {
			// Arrange: set a location hash
			window.location.hash = '#!/test';

			// Act: get current URL
			hashLocation.start();
			var currentUrl = hashLocation.getUrl();

			// Assert that URL is location hash minus hash-bang
			assert.equal(currentUrl.toString(), 'test', 'URL is location hash minus hash-bang');
		});

		test("setUrl() adds hash-bang", function () {
			// Act: set url
			hashLocation.start();
			hashLocation.setUrl('test');

			// Assert that current hash is set correctly
			assert.equal(my.currentHash, '#!/test', 'Hash-bang is added to location hash');
		});

		test("linkToUrl() return link for href:s", function () {
			// Act: create link to URL
			var link = hashLocation.linkToUrl('someurl');

			// Assert that URL have hash-bang
			assert.equal(link, '#!/someurl', 'Hash-bang is added to URL');
		});

		test("setUrl() triggers change", function (done) {
            var anotherHashLocation = hash();

			// Arrange: listen for url changes
			var capturedUrl;
            anotherHashLocation.on('changed', function(url) {
				capturedUrl = url;
				done();
			});

			// Act: set URL
            anotherHashLocation.start();
            anotherHashLocation.setUrl('test');

			// Assert that 'change' callback was executed with url
			assert.equal(capturedUrl, 'test', 'Parameter in "changed event" is URL');

            anotherHashLocation.stop();
		});

		test("back()", function (done) {
			delayedSteps(
				function () {
					hashLocation.stop();
					window.location.hash = ''; // start hash
					hashLocation.start();
				},
				function () {
					hashLocation.setUrl('a');
				},
				function () {
					hashLocation.setUrl('b');
				},
				function () {
					assert.equal(hashLocation.getUrl().toString(), 'b', 'location is last url');
				},
				function () {
					hashLocation.back();
				},
				function () {
					assert.equal(hashLocation.getUrl().toString(), 'a', 'back sets url to previous url');
				},
				function () {
					hashLocation.back();
				},
				function () {
					assert.equal(hashLocation.getUrl().toString(), '', 'back set to start url');
				},
				function () {
					hashLocation.back();
				},
				function () {
					assert.equal(hashLocation.getUrl().toString(), '', 'can not back furter than start');
				},
				function () {
					hashLocation.back('fallback');
				},
				function () {
					assert.equal(hashLocation.getUrl().toString(), 'fallback', 'but can give a fallback url');
				},
				function () {
					done();
				}
			);
		});



});