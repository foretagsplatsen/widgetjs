define(
	[
		"jquery"
	],

	function(jQuery) {

		/**
		 * @typedef {function} renderer
		 * @param {htmlCanvas} html
		 */

		/** @typedef {({}|string|renderer|widget|htmlTagBrush|*)} renderable */

		// Supported HTML 'tags'
		var tags = ("a abbr acronym address area article aside audio b bdi bdo big " +
			"blockquote body br button canvas caption cite code col colgroup command " +
			"datalist dd del details dfn div dl dt em embed fieldset figcaption figure " +
			"footer form frame frameset h1 h2 h3 h4 h5 h6 hr head header hgroup html i " +
			"iframe img input ins kbd keygen label legend li link map mark meta meter " +
			"nav noscript object ol optgroup option output p param pre progress q rp rt" +
			"ruby samp script section select small source span strong style sub summary" +
			"sup table tbody td textarea tfoot th thead time title tr track tt ul var" +
			"video wbr").split(" ");

		// Supported HTML events
		var attributes = "href for id media rel src style title type".split(" ");

		var omitSymbol = {};

		// Supported HTML attributes
		var events = ("blur focus focusin focusout load resize scroll unload " +
			"click dblclick mousedown mouseup mousemove mouseover " +
			"mouseout mouseenter mouseleave change select submit " +
			"keydown keypress keyup error dragstart dragenter dragover dragleave drop dragend").split(" ");

		/**
		 * htmlCanvas provides a DSL that we use to add elements to the DOM using a HTML looking syntax.
		 *
		 * The basic metaphor used is one of painting on a canvas using brushes. The canvas is the
		 * DOM and the brushes HTML "tags". Note that it have nothing to do with the HTML5 canvas tag
		 *
		 * @example
		 *		// A htmlCanvas is created on a jQuery object:
		 *		var html = htmlCanvas($("BODY"));
		 *
		 *		// We write HTML using standard tags:
		 *		html.h1("Hello World!");
		 *
		 *		// and standard attributes:
		 *		html.a({ id: "id", href: "http://www.google.se"}, "Google");
		 *
		 *		// Callbacks can be attached to events:
		 *		html.a({click: function() { alert("Hello World!")} "Click me!");
		 *
		 *		// Tags can be nested:
		 *		html.div({"class" : "outer_div"},
		 *			html.div({"class" : "inner_div"},
		 *				html.span("Some text")
		 *			)
		 *		);
		 *
		 *		// Parts can be assigned to variables:
		 *		var homeButton = html.a("Home").href("/");
		 *		if(showAlert) {
		 *			homeButton.click(function() { alert("Hello"); });
		 *		}
		 *
		 *
		 * @param {string|jQuery|htmlTagBrush} [rootElement] Element to  "paint" on. If not supplied a document fragment will be created
		 *
		 * @returns {htmlCanvas}
		 */
		function htmlCanvas(rootElement) {

			var root = htmlTagBrush({ element: rootElement });

			/** @typedef {{}} htmlCanvas */
			var that = {};

			//
			// Public
			//

			/**
			 * The root object that brushes will append elements to.
			 *
			 * @type {htmlTagBrush}
			 */
			that.root = root;

			/**
			 * Creates a brush that "paints" a tag of type tagName. Any children supplied
			 * will be appended as children to brush.
			 *
			 * @param {string} tagName Type of element (supported by document.createElement)
			 * @param {renderable[]} [children] Renderable objects to append as children of brush.
			 */
			that.tag = function(tagName, children) {
				var tagBrush = htmlTagBrush({ tag: tagName, children: children });
				root.appendBrush(tagBrush);
				return tagBrush;
			};

			/**
			 * Tags builders for each supported tag type.
			 *
			 * @example
			 *	html.h1("Title");
			 *	html.strong("Important stuff");
			 *	html.span(html.strong(userName), " signed in.")
			 */
			tags.forEach(function(tagName) {
				that[tagName] = function() {
					var args = Array.prototype.slice.call(arguments);
					return that.tag(tagName, args);
				};
			});

			/**
			 * Returns omit symbol that is used to omit a attribute pair
			 * and omit the object appended to brush.
			 *
			 * @returns {{}}
			 */
			that.omit = function() {
				return omitSymbol;
			};

			/**
			 * Append an object to the root brush
			 *
			 * @param anObject
			 */
			that.render = function() {
				var args = Array.prototype.slice.call(arguments);
				root.render(args);
			};

			/**
			 * Append an unescaped HTML string to the root brush
			 */
			that.raw = function(htmlString) {
				root.raw(htmlString);
			};

			/**
			 * Append an unescaped string replacing all spaces by
			 * non-breaking spaces
			 */
			that.renderNonBreaking = function(htmlString) {
				that.raw(htmlString.replace(/\s/g, "&nbsp;"));
			};

			return that;
		}

		/**
		 * A tag brush object represents a DOM element, built on a canvas. The element can
		 * be created from a "tag" or an element matched using "jQuery".
		 *
		 * Note: A brush is usually only created from `htmlCanvas` and it should only
		 * be used once.
		 *
		 * @param {{}} spec
		 * @param {string} [spec.tag] Name of tag to create (using document.createElement)
		 * @param {string|jQuery|widget|htmlTagBrush|*} [spec.element]
		 * @param {renderable[]} [spec.children]
		 *
		 * @returns {htmlTagBrush}
		 */
		function htmlTagBrush(spec) {

			/** @typedef {{}} htmlTagBrush */
			var that = {};

			/**
			 * Create a new element from tagName or get it from elements.
			 *
			 * @type {HTMLElement}
			 */
			var element = spec.tag ? createElement(spec.tag) : getElement(spec.element);
			if (!element) {
				throw new Error("htmlTagBrush requires an element");
			}

			//
			// Public
			//

			/**
			 * DOM element created by brush
			 *
			 * @returns {HTMLElement}
			 */
			that.element = function() {
				return element;
			};

			/**
			 * Appends child objects to brush. Can take a single or several arguments.
			 *
			 * @example
			 *	html.h1().render(
			 *		"hello",
			 *		html.span("world",
			 *			function(html) {
			 *				html.img().src("foo.img");
			 *				}
			 *			)
			 *		);
			 *
			 * @param {renderable[]} arguments Any renderable objects
			 * @returns {htmlTagBrush}
			 */
			that.render = function() {
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
			that.appendToBrush = function(aTagBrush) {
				aTagBrush.appendBrush(that);
			};

			/**
			 * Append brush as child.
			 *
			 * @param {htmlTagBrush} aTagBrush
			 */
			that.appendBrush = appendBrush;

			/**
			 * Set unescaped html contents.
			 *
			 * @param {string} htmlContents
			 */
			that.html = function(htmlContents) {
				that.asJQuery().html(htmlContents);
				return that;
			};

			/**
			 * Append an unescaped html contents.
			 *
			 * @param {string} htmlContents
			 */
			that.raw = function(htmlContents) {
				that.asJQuery().append(htmlContents);
				return that;
			};

			/**
			 * Append an unescaped string replacing all spaces by
			 * non-breaking spaces
			 */
			that.renderNonBreaking = function(htmlString) {
				that.raw(htmlString.replace(/\s/g, "&nbsp;"));
			};

			/**
			 * Bind callback to DOM event
			 *
			 * @usage
			 *		html.a("click me").on("click", function() {
			 *			alert("click");
			 *		});
			 *
			 * @param {string} eventType One or more DOM event types, such as "click" or "submit," or custom event names.
			 * @param {function} callback A function to execute each time the event is triggered.
			 * @returns {{}}
			 */
			that.on = function(eventType, callback) {
				that.asJQuery().bind(eventType, callback);
				return that;
			};

			/**
			 * Event functions for each supported event type.
			 *
			 * @example
			 *	aBrush.click(function() { .. });
			 *	aBrush.blur(function() { .. });
			 */
			events.forEach(function(eventType) {
				that[eventType] = function(callback) {
					return that.on(eventType, callback);
				};
			});

			/**
			 * Adds a new attribute or changes the value of an existing attribute on the specified element.
			 * @param key
			 * @param value
			 * @returns {{}}
			 */
			that.setAttribute = function(key, value) {
				// Omit attribute if value is omit
				if(value === omitSymbol) {
					return that;
				}

				element.setAttribute(key, value);
				return that;
			};

			/**
			 * Accessors for each supported attribute.
			 *
			 * @example
			 *	aBrush.id("id");
			 *	aBrush.src("javascript:0");
			 *	aBrush.href("#");
			 */
			attributes.forEach(function(attributeName) {
				that[attributeName] = function(value) {
					return that.setAttribute(attributeName, value);
				};
			});

			/**
			 * Set element style with key/value or object literal.
			 *
			 * @example
			 *		html.h1().css("display", "block");
			 *		html.h1().css({"display" : "block", "color" : "red"});
			 *
			 * @param {string|{}} key
			 * @param {string} value
			 * @returns {{}}
			 */
			that.css = function(key, value) {
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
			 *	html.h1().attr({id : "myid", "class" : "myclass"});
			 *
			 * @note
			 *	Use klass or "class" with quotation marks as key instead of class since its a reserved word.
			 *
			 * @param object
			 * @returns {{}}
			 */
			that.attr = function(object) {
				for (var key in object) {
					if (object.hasOwnProperty(key)) {
						// Attach functions
						if(typeof object[key] === "function") {
							that.on(key, object[key]);
						}

						else if (key === "klass") {
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
			that.addClass = function(className) {
				that.asJQuery().addClass(className);
				return that;
			};

			/**
			 * Removes className from class attribute
			 *
			 * @param {string} className
			 * @returns {htmlTagBrush}
			 */
			that.removeClass = function(className) {
				that.asJQuery().removeClass(className);
				return that;
			};

			/**
			 * Returns jQuery that match element.
			 * @returns {jQuery}
			 */
			that.asJQuery = function() {
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
			 * - map / object literal with attributes (eg. {id: "aId", "class" : "aClass"})
			 * - array of valid objects (see above)
			 *
			 * all other objects are appended using:
			 * `jQuery(element).append(object);`
			 *
			 * @param {renderable|renderable[]|{}} object
			 */
			function append(object) {
				if (typeof(object) === "undefined" || object === null) {
					throw new Error("cannot append null or undefined to brush");
				}

				// Ignore object if it"s a omit symbol
				if(object === omitSymbol) {
					return;
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
			 * text if element can"t have children.
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

			/**
			 * Append function by executing function with this element as canvas.
			 *
			 * @param {renderer} fn
			 */
			function appendFunction(fn) {
				var brushCanvas = htmlCanvas(that);
				fn(brushCanvas);
			}

			/**
			 * Element is set to first match if a jQuery was given.
			 *
			 * @param {string|jQuery|HTMLElement|widget|htmlTagBrush} [object]
			 * @returns {HTMLElement}
			 */
			function getElement(object) {

				// Create a fragment if no object
				if (typeof(object) === "undefined" || object === null) {
					return  jQuery(document.createDocumentFragment()).get(0);
				}

				// Any object that implements asJQuery eg. widget and tagBrush
				if(typeof object === "object" && object.asJQuery) {
					return object.asJQuery().get(0);
				}

				// Fall back on jQuery if a string containing a selector expression,
				// a DOM Element, an existing jQuery object or any other argument that
				// jQuery accept (http://api.jquery.com/jQuery/)
				return jQuery(object).get(0);
			}

			//
			// Init
			//

			/**
			 * Append children to support nesting
			 *
			 * @example
			 *		html.ul(html.li(html.a({href: "#"}, "home"));
			 */
			if(spec.children) {
				append(spec.children);
			}

			return that;
		}

		return htmlCanvas;
	}
);
