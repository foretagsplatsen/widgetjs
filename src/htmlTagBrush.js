define(
	[
		'jquery'
	],

	function (jQuery) {

		/**
		 * @typedef {function} renderer
		 * @param {htmlCanvas} html
		 */

		/** @typedef {({}|string|renderer|widget|htmlTagBrush|*)} renderable */

		// Supported HTML events
		var attributes = 'href for id media rel src style title type'.split(' ');

		// Supported HTML attributes
		var events = ('blur focus focusin focusout load resize scroll unload ' +
			'click dblclick mousedown mouseup mousemove mouseover ' +
			'mouseout mouseenter mouseleave change select submit ' +
			'keydown keypress keyup error dragstart dragenter dragover dragleave drop dragend').split(' ');

		/**
		 * A tag brush object represents a DOM element, built on a canvas. The element can
		 * be created from a 'tag' or an element matched using 'jQuery'.
		 *
		 * Note: A brush is usually only created from `htmlCanvas` and it should only
		 * be used once.
		 *
		 * @param {{}} spec
		 * @param {string} [spec.tag] Name of tag to create (using document.createElement)
		 * @param {string|*} [spec.jQuery]
		 * @param {htmlCanvas} [spec.canvas]
		 * @param {renderable[]} [spec.children]
		 *
		 * @returns {htmlTagBrush}
		 */
		var htmlTagBrush = function (spec) {

			/** @typedef {{}} htmlTagBrush */
			var that = {};

			var jquery = spec.jQuery;
			var elementTagName = spec.tag;
			var children = spec.children;
			var canvas = spec.canvas;

			/**
			 * DOM element is set on initialization to first DOM element matched by
			 * 'jquery'. If no jQuery is given, element is created from tag name.
			 *
			 * @type {HTMLElement}
			 */
			var element;

			//
			// Public
			//

			/**
			 * DOM element created by brush
			 * @returns {HTMLElement}
			 */
			that.element = function () {
				return element;
			};

			/**
			 * Appends child objects to brush. Can take a single or several arguments.
			 *
			 * @example
			 *	html.h1().render(
			 *		'hello',
			 *		html.span('world',
			 *			function(html) {
			 *				html.img().src('foo.img');
			 *				}
			 *			)
			 *		);
			 *
			 * @param {renderable[]} arguments Any renderable objects
			 * @returns {htmlTagBrush}
			 */
			that.render = function () {
				var args = Array.prototype.slice.call(arguments);
				for (var i = 0; i < args.length; i++) {
					append(args[i]);
				}
				return that;
			};

			/**
			 * Implementation for `appendToBrush()` to allow a brush to be
			 * appended to another brush.
			 *
			 * @param {htmlTagBrush} aTagBrush
			 */
			that.appendToBrush = function (aTagBrush) {
				aTagBrush.addBrush(that);
			};

			/**
			 * Append brush as child.
			 *
			 * @param {htmlTagBrush} aTagBrush
			 */
			that.addBrush = appendBrush;

			/**
			 * Set unescaped html contents.
			 *
			 * @param {string} htmlContents
			 */
			that.html = function (htmlContents) {
				that.asJQuery().html(htmlContents);
			};

			/**
			 * Bind callback to DOM event
			 *
			 * @usage
			 *		html.a('click me').on('click', function() {
			 *			alert('click');
			 *		});
			 *
			 * @param {string} eventType One or more DOM event types, such as "click" or "submit," or custom event names.
			 * @param {function} callback A function to execute each time the event is triggered.
			 * @returns {{}}
			 */
			that.on = function (eventType, callback) {
				that.asJQuery().bind(eventType, callback);
				return that;
			};

			// Event functions for each supported event type.
			//
			// Example:
			//
			//	aBrush.click(function() { .. });
			//	aBrush.blur(function() { .. });
			//	aBrush.load(function() { .. });
			//
			events.forEach(function(eventType) {
				that[eventType] = function (callback) {
					return that.on(eventType, callback);
				};
			});

			/**
			 * Adds a new attribute or changes the value of an existing attribute on the specified element.
			 * @param key
			 * @param value
			 * @returns {{}}
			 */
			that.setAttribute = function (key, value) {
				element.setAttribute(key, value);
				return that;
			};

			// Accessors for each supported attribute.
			//
			// Example:
			//
			//	aBrush.id('id');
			//	aBrush.src('javascript:0');
			//	aBrush.href('#');
			//
			attributes.forEach(function(attributeName) {
				that[attributeName] = function (value) {
					return that.setAttribute(attributeName, value);
				};
			});

			/**
			 * Set element style with key/value or object literal.
			 *
			 * @example
			 *		html.h1().css('display', 'block');
			 *		html.h1().css({'display' : 'block', 'color' : 'red'});
			 *
			 * @param {string|{}} key
			 * @param {string} value
			 * @returns {{}}
			 */
			that.css = function (key, value) {
				if (typeof key === "string") {
					that.asJQuery().css(key, value);
				}
				else {
					that.asJQuery().css(key); // otherwise assume key is a map (object literal)
				}

				return that;
			};

			/**
			 * Set attributes using object literal.
			 *
			 * @example
			 *	html.h1().attr({id : 'myid', 'class' : 'myclass'});
			 *
			 * @note
			 *	Use klass or 'class' with quotation marks as key instead of class since its a reserved word.
			 *
			 * @param object
			 * @returns {{}}
			 */
			that.attr = function (object) {
				for (var key in object) {
					if (object.hasOwnProperty(key)) {
						if (key === 'klass') {
							that.addClass(object[key]);
						} else {
							that.setAttribute(key, object[key]);
						}
					}
				}

				return that;
			};

			/**
			 * Appends className to class attribute
			 * @param className
			 * @returns {htmlTagBrush}
			 */
			that.addClass = function (className) {
				that.asJQuery().addClass(className);
				return that;
			};

			//

			/**
			 * Removes className from class attribute
			 *
			 * @param {string} className
			 * @returns {htmlTagBrush}
			 */
			that.removeClass = function (className) {
				that.asJQuery().removeClass(className);
				return that;
			};

			/**
			 * Returns jQuery that match element.
			 * @returns {jQuery}
			 */
			that.asJQuery = function () {
				return jQuery(that.element());
			};

			//
			// Private
			//

			/**
			 * Creates a new element from tagName
			 *
			 * @param {string} tagName
			 * @returns {Element}
			 */
			function createElement(tagName) {
				return document.createElement(tagName);
			}

			/**
			 * Appends object as child to brush. A tag brush knows how to append:
			 *
			 * - strings
			 * - functions (that take a htmlCanvas as argument)
			 * - other brushes and widgets (that implements `appendToBrush()`)
			 * - map / object literal with attributes (eg. {id: 'aId', 'class' : 'aClass'})
			 * - array of valid objects (see above)
			 *
			 * all other objects are appended using:
			 * `jQuery(element).append(object);`
			 *
			 * @param {renderable|renderable[]|{}} object
			 */
			function append(object) {
				if (typeof(object) === 'undefined' || object === null) {
					throw new Error('cannot append null or undefined to brush');
				}

				if (typeof object === "object" && object.constructor === Array) {
					for (var i = 0; i < object.length; i++) {
						append(object[i]);
					}
				}
				else if (typeof object === "string") {
					appendString(object);
				} else if (typeof object === "function") {
					appendFunction(object);
				} else if (typeof object === "object" &&
					object.appendToBrush /* eg. widget and tagBrush implement appendToBrush */) {
					object.appendToBrush(that); // double dispatch
				}
				else if (typeof object === "object") {
					that.attr(object); // assume attributes if none of above
				} else {
					jQuery(element).append(object); // default to jquery
				}
			}

			/**
			 * Appends DOM node as last child of element or concatenate with
			 * text if element can't have children.
			 *
			 * @param {string|HTMLElement} child
			 */
			function appendChild(child) {
				if (element.canHaveChildren !== false) {
					element.appendChild(child);
				} else {
					element.text = element.text + child.innerHTML;
				}
			}

			/**
			 * Appends element of brush
			 *
			 * @param {htmlTagBrush} aTagBrush
			 */
			function appendBrush(aTagBrush) {
				appendChild(aTagBrush.element());
			}

			/**
			 * Append text as child. `string` is escaped
			 *
			 * @param {string} string
			 */
			function appendString(string) {
				jQuery(element).append(document.createTextNode(string));
			}

			//

			/**
			 * Append function by executing function with this element as canvas.
			 *
			 * @param {renderer} fn
			 */
			function appendFunction(fn) {
				var root = canvas.root;
				canvas.root = that;
				fn(canvas);
				canvas.root = root;
			}

			//
			// Init
			//

			// Element is set to first match if a jQuery was given.
			// If no jQuery was given, element is created from tag name.
			if (jquery && typeof jquery === 'string') {
				jquery = jQuery(jquery);
			}
			if (jquery) {
				element = jquery.get(0);
				if (!element) {
					throw new Error('jQuery did not match an element');
				}
			} else {
				element = createElement(elementTagName);
			}

			// Append children to support nesting. Eg.:
			//		html.ul(html.li(html.a({href: '#'}, 'home'));
			if (children) {
				for (var childIndex = 0; childIndex < spec.children.length; childIndex++) {
					append(spec.children[childIndex]);
				}
			}

			return that;
		};

		return htmlTagBrush;
	}
);
