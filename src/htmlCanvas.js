// htmlCanvas is a DSL that we use to add elements to the DOM using a HTML looking syntax.
//
// The basic metaphor used is one of painting on a canvas using brushes. The canvas is the
// DOM and the brushes HTML 'tags'.
//
// _NOTE:_ It has nothing to do with the HTML5 canvas tag
//
// _Usage:_
//
// A htmlCanvas is created on a jQuery object:
//
//		var html = htmlCanvas($('BODY'));
//
// We write HTML using standard tags:
//
//		html.h1('Hello World!');
//
//	and standard attributes:
//
//		html.a('Google').id('id').href('http://www.google.se');
//
//	Attributes can also be set from an object litteral:
//
//		html.a({id: 'id', href: 'http://www.google.se'}, 'Google');
//
//  Callbacks can be attached to events:
//
//		html.a('Click me!').click(function() { alert('Hello World!')});
//
//	Tags can be nested:
//
//		html.div({'class' : 'outer_div'},
//			html.div({'class' : 'inner_div'},
//				html.span('Some text')
//			)
//		);
//
// Parts can be assigned to variables:
//
//		var homeButton = html.a('Home').href('/');
//		if(showAlert) {
//			homeButton.click(function() { alert('Hello'); });
//		}
//

/*
* HTML Canvas
* Copyright 2011 Nicolas Petton <nico@objectfusion.fr>
* This file is released under MIT.
*/

define(
	[
		'jquery'
	],

	function (jQuery) {

		// - - -


		// ### htmlCanvas
		// htmlCanvas provides a HTML-looking-syntax interface for appending content to the The Document Object Model (DOM).
		//
		// _Usage_:
		//
		//		var html = htmlCanvas($('BODY'));
		//		html.div(html.h1('title'));
		//
		// The canvas is created on the first element matched by aJQuery (eg. $('BODY') above). A brush for that element is created
		// and set as the root object.
		//
		// All other brushes (eg. html.div() above) are added to that root brush. Brushes added as children of a
		// brush (eg. html.h1('title') above) are however added to their parent brush which gives us the ability to nest
		// brushes and create a tree.
		//
		var htmlCanvas = function (aJQuery) {
			var that = {};

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

			// #### Public API

			// The root object. It's element is set to first element matched by aJQuery
			that.root = tagBrush({ canvas: that, jQuery: aJQuery });

			// Creates a new tag brush and adds it to root brush. The element is a
			// new element in partent brush element, created using the 'tag' (eg. H1).
			that.tag = function (tag, children) {
				var t = tagBrush({ canvas: that, tag: tag, children: children });
				that.root.addBrush(t);
				return t;
			};

			// Tag brush functions are added dynamically on object creation.
			// Each 'tag' in Supported HTML 'tags' is added as a public method on htmlCanvas
			//
			// _Example:_
			//
			//		html.h1('hello');
			//		html.span('world');
			//
			function createTagBrush(tagname) {
				return function () {
					var args = Array.prototype.slice.call(arguments);
					return that.tag(tagname, args);
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

		// - - -


		// ### tagBrush
		// A tag brush object represents a DOM element, built on a canvas. The element can
		// be created from a 'tag' or an element matched using 'jQuery'.
		//
		// _Usage:_ create from 'tag'
		//
		//		var h1 = tagBrush({tag : 'h1', canvas : html});
		//
		// A h1 element is created and appended to ´canvas.root´.
		//
		// _Usage:_ create from matched jQuery
		//
		//		var h1 = tagBrush({jQuery : '#heading', canvas : html});
		//
		// A brush is created for first element that match jQuery.
		//
		// _Usage:_ create from with children
		//
		//		tagBrush({jQuery : '#heading', canvas : html, children : [headingBrush, bodyBrush, footerBrush]});
		//
		//	Children are appended to brush one-by-one.
		//
		// _Note:_ Each tag brush should be only used once.
		var tagBrush = function (spec) {
			var that = {};

			// Supported HTML events
			var attributes = 'href for id media rel src style title type'.split(' ');

			// Supported HTML attributes
			var events = ('blur focus focusin focusout load resize scroll unload ' +
				'click dblclick mousedown mouseup mousemove mouseover ' +
				'mouseout mouseenter mouseleave change select submit ' +
				'keydown keypress keyup error dragstart dragenter dragover dragleave drop dragend').split(' ');

			var jquery = spec.jQuery;
			var elementTagName = spec.tag;
			var children = spec.children;
			var canvas = spec.canvas;

			// DOM element - Is set on initilization to first DOM element matched by
			// 'jquery'. if no jQuery is given, element is created from tag name.
			var element;

			function createElement(tagName) {
				return document.createElement(tagName);
			}

			// Appends objects to the brush element. A tag brush knows how to append:
			//
			// - strings
			// - functions (that take a htmlCanvas as argument)
			// - other brushes and widgets (that implements `appendToBrush()`)
			// - map / object literal with attributes (eg. {id: 'aId', 'class' : 'aClass'})
			// - array of valid objects (see above)
			//
			// all other objects are appended using:
			// `jQuery(element).append(object);`
			//
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

			// Appends DOM node as child of element or concatenate with
			// text if element can't have children.
			function appendChild(child) {
				if (element.canHaveChildren !== false) {
					element.appendChild(child);
				} else {
					element.text = element.text + child.innerHTML;
				}
			}

			// Appends element of brush as last child of this element
			function appendBrush(aTagBrush) {
				appendChild(aTagBrush.element());
			}

			// Append text or HTML text to element
			function appendString(string) {
				jQuery(element).append(string);
			}

			// Append function by executing function with this element as canvas.
			function appendFunction(fn) {
				var root = canvas.root;
				canvas.root = that;
				fn(canvas);
				canvas.root = root;
			}


			// #### Public API

			// Returns DOM element created by brush.
			that.element = function () {
				return element;
			};

			// Renders objects using `append()`. Can take a single or several arguments.
			//
			// _Usage:_
			//
			//		html.h1().render(
			//			'hello',
			//			html.span('world',
			//				function(html) {
			//					html.img().src('foo.img');
			//				}
			//			)
			//		);
			that.render = function () {
				var args = Array.prototype.slice.call(arguments);
				for (var i = 0; i < args.length; i++) {
					append(args[i]);
				}
				return that;
			};

			// Implemention for `appendToBrush()` to allow a brush to be
            // appended to another brush.
            //
            // Basicly it allows us to do:
            //
            //		var h1Brush = html.span('test');
            //      html.div(h1Brush);
            //
			that.appendToBrush = function (aTagBrush) {
				aTagBrush.addBrush(that);
			};

			// Appends a property object
			that.appendProperty = function(property) {
				append(property.get());
				// Listen to value changes

				// TODO We should stop listening to changes when the brush
				// is removed, to make it GCed
				property.onChange(function(newValue) {
					that.asJQuery().empty();
					append(newValue);
				});
			};

			// Appends brush `element()` to this element.
			that.addBrush = appendBrush;

			// Events are delegated to jQuery
			//
			// _Usage:_
			//
			//		html.a('click me').on('click', function() {
			//			alert('click');
			//		});
			that.on = function (event, callback) {
				that.asJQuery().bind(event, callback);
				return that;
			};


			// Event functions are added dynamically on object creation.
			// Each supported event is added as a public method on brush
			//
			// _Example:_
			//
			//		aBrush.click(function() { .. });
			//		aBrush.blur(function() { .. });
			//		aBrush.load(function() { .. });
			//
			function createEvent(eventname) {
				return function (callback) {
					that.on(eventname, callback);
					return that;
				};
			}
			for (var eventIndex = 0; eventIndex < events.length; eventIndex++) {
				that[events[eventIndex]] = createEvent(events[eventIndex]);
			}

			// Attribute accessors are added dynamically on object creation.
			// Each supported attribute is added as a public method on brush
			//
			// _Example:_
			//
			//		aBrush.id('id');
			//		aBrush.src('javascript:0');
			//		aBrush.href('#');
			//
			function createAttrubute(attributename) {
				return function (value) {
					that.setAttribute(attributename, value);
					return that;
				};
			}
			for (var attributeIndex = 0; attributeIndex < attributes.length; attributeIndex++) {
				that[attributes[attributeIndex]] = createAttrubute(attributes[attributeIndex]);
			}

			// Sets element attribute with key to value
			that.setAttribute = function (key, value) {
				element.setAttribute(key, value);
				return that;
			};

			// Set element style with key/value or object literal.
			//
			// _Usage:_
			//
			//		html.h1().css('display', 'block');
			//		html.h1().css({'display' : 'block', 'color' : 'red'});
			//
			that.css = function (key, value) {
				if (typeof key === "string") {
					that.asJQuery().css(key, value);
				}
				else {
					that.asJQuery().css(key); // otherwise assume key is a map (object literal)
				}

				return that;
			};


			// Set attributes using object literal.
			//
			// _Usage:_
			//
			//		html.h1().attr({id : 'myid', 'class' : 'myclass'});
			//
			// _Note:_ Use klass or 'class' with quotation marks as key instead of class since its a reserved word.
			//
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

			// Appends className to class attribute
			that.addClass = function (className) {
				that.asJQuery().addClass(className);
				return that;
			};

			// Removes className from class attribute
			that.removeClass = function (className) {
				that.asJQuery().removeClass(className);
				return that;
			};

			// Returns jQuery that match element.
			that.asJQuery = function () {
				return jQuery(that.element());
			};

			// #### TagBrush initialization

			// Element is set to first match if a jQuery was given.
			if (jquery && typeof jquery === 'string') {
				jquery = jQuery(jquery);
			}
			if (jquery) {
				element = jquery.get(0);
				if (!element) {
					throw new Error('jQuery did not match an element');
				}
			}

			// If no jQuery was given, element is created
			// from tag name.
			else {
				element = createElement(elementTagName);
			}

			// Append children to support nesting. _Eg.:_
			//
			//		html.ul(html.li(html.a({href: '#'}, 'home'));
			if (children) {
				for (var childIndex = 0; childIndex < spec.children.length; childIndex++) {
					append(spec.children[childIndex]);
				}
			}

			return that;
		};


        // ### Exports
        // htmlCanvas

		return htmlCanvas;
	}
);
