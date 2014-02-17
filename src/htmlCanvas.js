/**
 * @module widgetjs/htmlCanvas
 */

define(
	[
		'jquery',
		'widgetjs/tagBrush'
	],

	function (jQuery, tagBrush) {

		/**
		 * __htmlCanvas__ is a DSL that used to add elements to the DOM
		 * using a HTML looking syntax.
		 *
		 * The basic metaphor used is one of painting on a canvas
		 * using brushes. The canvas is the DOM and the brushes HTML
		 * `tags`.
		 *
		 * _NOTE:_ It has nothing to do with the HTML5 canvas tag
		 * `htmlCanvas` provides a HTML-looking-syntax interface for
		 * appending content to the The Document Object Model (DOM).
		 *
		 *
		 * The canvas is created on the first element matched by
		 * aJQuery (eg. `$('BODY')` above). A brush for that element is
		 * created and set as the root object.
		 *
		 * All other brushes (eg. `html.div()` above) are added to that
		 * root brush. Brushes added as children of a brush
		 * (eg. `html.h1('title')` above) are however added to their
		 * parent brush which gives us the ability to nest brushes and
		 * create a tree.
		 *
		 * @alias module:widgetjs/htmlCanvas
		 * @param aJQuery {object}
		 * @returns {htmlCanvas}
		 *
		 * @example
		 * // A htmlCanvas is created on a jQuery object:
		 * var html = htmlCanvas($('BODY'));
		 *
		 * // We write HTML using standard tags:
		 * html.h1('Hello World!');
		 *
		 * // and standard attributes:
		 * html.a('Google').id('id').href('http://www.google.se');
		 *
		 * // Attributes can also be set from an object literal:
		 * html.a({id: 'id', href: 'http://www.google.se'}, 'Google');
		 *
		 * // Callbacks can be attached to events:
		 * html.a('Click me!').click(function() { alert('Hello World!')});
		 *
		 * // Tags can be nested:
		 * html.div({'class' : 'outer_div'},
		 *	html.div({'class' : 'inner_div'},
		 *		html.span('Some text')
		 *	)
		 * );
		 *
		 * // Parts can be assigned to variables:
		 * var homeButton = html.a('Home').href('/');
		 * if(showAlert) {
		 *	homeButton.click(function() { alert('Hello'); });
		 * }
		 */
		var htmlCanvas = function (aJQuery) {

			/** @lends module:widgetjs/htmlCanvas# */
			var that = {};

			/** Array with available tag names */
			var tags = ('a abbr acronym address area article aside audio b bdi bdo big ' +
				'blockquote body br button canvas caption cite code col colgroup command ' +
				'datalist dd del details dfn div dl dt em embed fieldset figcaption figure ' +
				'footer form frame frameset h1 h2 h3 h4 h5 h6 hr head header hgroup html i ' +
				'iframe img input ins kbd keygen label legend li link map mark meta meter ' +
				'nav noscript object ol optgroup option output p param pre progress q rp rt' +
				'ruby samp script section select small source span strong style sub summary' +
				'sup table tbody td textarea tfoot th thead time title tr track tt ul var' +
				'video wbr').split(' ');


			//
			// Public API
			//

			/** 
			 * The root object. Its element is set to first element matched by `aJQuery`.
			 */
			that.root = tagBrush({ canvas: that, jQuery: aJQuery });

			/** 
			 * Creates a new tag brush and adds it to root brush. The element is a
			 * new element in parent brush element, created using the `tag` (eg. H1).
			 * @param tag {string}
			 * @param children {tagBrush[]}
			 * @returns {tagBrush}
			 */
			that.tag = function (tag, children) {
				var t = tagBrush({ canvas: that, tag: tag, children: children });
				that.root.addBrush(t);
				return t;
			};

			/**
			 * Tag brush functions are added dynamically on object creation.
			 * Each 'tag' in Supported HTML 'tags' is added as a public method on htmlCanvas
			 *
			 * @param tagName {string}
			 * @returns {tagBrush}
			 * 
			 * @example
			 * html.h1('hello');
			 * html.span('world');
			 */
			function createTagBrush(tagName) {
				return function () {
					var args = Array.prototype.slice.call(arguments);
					return that.tag(tagName, args);
				};
			}

			for (var tagIndex = 0; tagIndex < tags.length; tagIndex++) {
				that[tags[tagIndex]] = createTagBrush(tags[tagIndex]);
			}

			// Render anObject on the root tag brush. See `tagBrush.render()`
			that.render = function (anObject) {
				that.root.render(anObject);
			};

			return that;
		};

        // ### Exports
        // htmlCanvas

		return htmlCanvas;
	}
);
