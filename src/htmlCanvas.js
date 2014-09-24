define(
	[
		'jquery',
		'./htmlTagBrush'
	],

	function (jQuery, tagBrush) {

		// Supported HTML 'tags'
		var tags = ('a abbr acronym address area article aside audio b bdi bdo big ' +
			'blockquote body br button canvas caption cite code col colgroup command ' +
			'datalist dd del details dfn div dl dt em embed fieldset figcaption figure ' +
			'footer form frame frameset h1 h2 h3 h4 h5 h6 hr head header hgroup html i ' +
			'iframe img input ins kbd keygen label legend li link map mark meta meter ' +
			'nav noscript object ol optgroup option output p param pre progress q rp rt' +
			'ruby samp script section select small source span strong style sub summary' +
			'sup table tbody td textarea tfoot th thead time title tr track tt ul var' +
			'video wbr').split(' ');

		/**
		 * htmlCanvas provides a DSL that we use to add elements to the DOM using a HTML looking syntax.
		 *
		 * The basic metaphor used is one of painting on a canvas using brushes. The canvas is the
		 * DOM and the brushes HTML 'tags'. Note that it have nothing to do with the HTML5 canvas tag
		 *
		 * @example
		 *		// A htmlCanvas is created on a jQuery object:
		 *		var html = htmlCanvas($('BODY'));
		 *
		 *		// We write HTML using standard tags:
		 *		html.h1('Hello World!');
		 *
		 *		// and standard attributes:
		 *		html.a('Google').id('id').href('http://www.google.se');
		 *
		 *		// Attributes can also be set from an object literal:
		 *		html.a({id: 'id', href: 'http://www.google.se'}, 'Google');
		 *
		 *		// Callbacks can be attached to events:
		 *		html.a('Click me!').click(function() { alert('Hello World!')});
		 *
		 *		// Tags can be nested:
		 *		html.div({'class' : 'outer_div'},
		 *			html.div({'class' : 'inner_div'},
		 *				html.span('Some text')
		 *			)
		 *		);
		 *
		 *		// Parts can be assigned to variables:
		 *		var homeButton = html.a('Home').href('/');
		 *		if(showAlert) {
		 *			homeButton.click(function() { alert('Hello'); });
		 *		}
		 *
		 *
		 * @param [aJQuery]		The canvas is created on the first element matched by aJQuery (eg. $('BODY') above). If no
		 *						jQuery is supplied the canvas will be created on a document fragment.
		 * @returns {htmlCanvas}
		 */
		var htmlCanvas = function (aJQuery) {

			// Render on fragment if no element/query supplied
			if(aJQuery === undefined) {
				var fragment = document.createDocumentFragment();
				aJQuery = jQuery(fragment);
			}

			/** @typedef {{}} htmlCanvas */
			var that = {};

			//
			// Public
			//

			/**
			 * The root object. It's element is set to first element matched by aJQuery
			 * @type {htmlTagBrush}
			 */
			that.root = tagBrush({ canvas: that, jQuery: aJQuery });

			/**
			 * Creates a brush that "paints" a tag of type tagName. Any children supplied
			 * will be appended as children to brush.
			 *
			 * @param {string} tagName Type of element (supported by document.createElement)
			 * @param {renderable[]} [children] Renderable objects to append as children of brush.
			 */
			that.tag = function (tagName, children) {
				var t = tagBrush({ canvas: that, tag: tagName, children: children });
				that.root.addBrush(t);
				return t;
			};

			/**
			 * Append an object to the root brush
			 *
			 * @param anObject
			 */
			that.render = function (anObject) {
				that.root.render(anObject);
			};

			//
			// Private
			//

			/**
			 * Creates a function that creates brushes that "paints" tag of type tagName.
			 *
			 * @param tagName
			 * @returns {Function}
			 */
			function createTagBrush(tagName) {
				return function () {
					var args = Array.prototype.slice.call(arguments);
					return that.tag(tagName, args);
				};
			}

			// Creates brush functions for all supported tags
			for (var tagIndex = 0; tagIndex < tags.length; tagIndex++) {
				that[tags[tagIndex]] = createTagBrush(tags[tagIndex]);
			}

			return that;
		};

		return htmlCanvas;
	}
);
