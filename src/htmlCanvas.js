/*
* HTML Canvas
* Copyright 2011 Nicolas Petton <nico@objectfusion.fr>
* This file is released under MIT.
* See the LICENSE file for more infos.
*
* A simple HTML Canvas library similar to Amber Smalltalk
*
*/

define(
	[
	'jquery'
	],

	function (jQuery) {

		/*
		* The HTML Canvas object.
		* An htmlCanvas is a stateless object that knows how to build tag brush objects;
		* and render other objects.
		*
		* a htmlCanvas should be created on a jQuery object.
		* tag brush functions are added dynamically on object creation.
		*/
		var htmlCanvas = function (aJQuery) {
			var jquery;
			if (typeof aJQuery === 'string') {
				jquery = jQuery(aJQuery);
			} else {
				jquery = aJQuery;
			}

			if (!jquery.get(0)) {
				throw "jquery match no element";
			}

			var that = {};
			var tags = ('a abbr acronym address area article aside audio b bdi bdo big ' +
				'blockquote body br button canvas caption cite code col colgroup command ' +
				'datalist dd del details dfn div dl dt em embed fieldset figcaption figure ' +
				'footer form frame frameset h1 h2 h3 h4 h5 h6 hr head header hgroup html i ' +
				'iframe img input ins kbd keygen label legend li link map mark meta meter ' +
				'nav noscript object ol optgroup option output p param pre progress q rp rt' +
				'ruby samp script section select small source span strong style sub summary' +
				'sup table tbody td textarea tfoot th thead time title tr track tt ul var' +
				'video wbr').split(' ');

			/*
			* The root object is a tagBrush on aJQuery.
			* It will be used to build all other tag brushes.
			*/
			that.root = tagBrush({ canvas: that, jQuery: jquery });


			/* Public API */
			that.tag = function (tag, children) {
				var t = tagBrush({ canvas: that, tag: tag, children: children });
				that.root.addBrush(t);
				return t;
			};

			

			/*
			* Create a function for each tag brush string.
			* Example:
			*
			* aHtmlCanvas.h1('hello');
			*/
			function createTagBrush(tagname) {
				return function () {
					var args = Array.prototype.slice.call(arguments);
					return that.tag(tagname, args);
				};
			}
			for (var tagIndex = 0; tagIndex < tags.length; tagIndex++) {
				that[tags[tagIndex]] = createTagBrush(tags[tagIndex]);
			}

			/*
			* Render anObject on the root tag brush. See tagBrush.render()
			*/
			that.render = function (obj) {
				that.root.render(obj);
			};

			return that;
		};


		/*
		* A tag brush object represents a DOM element, built on a canvas.
		* On object initialization, a DOM element will be created and put in the
		* 'element' private var.
		*
		* Each tag brush should be only used once.
		*/
		var tagBrush = function (spec) {
			var that = {};
			var canvas = spec.canvas;
			var attributes = 'href for id media rel src style title type'.split(' ');
			var events = ('blur focus focusin focusout load resize scroll unload ' +
				'click dblclick mousedown mouseup mousemove mouseover ' +
				'mouseout mouseenter mouseleave change select submit ' +
				'keydown keypress keyup error').split(' ');
			var element;


			/* DOM elements creation */

			function createElement(string) {
				return document.createElement(string);
			}

			/* Appending objects to the brush */

			/*
			* A tag brush knows how to append other objects.
			* Valid objects are:
			* - strings
			* - functions
			* - other brushes
			* - array of valid objects (see above)
			*/
			function append(object) {
				if(typeof(object) === 'undefined' || object === null) {
					throw 'cannot append null or undefined to brush';
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
				} else if (object.appendToBrush /* widget and appendToBrush implement appendToBrush() */) {
					object.appendToBrush(that);
				}
				// assume attributes if none of above
				else {
					that.attr(object);
				}
			}

			function appendBrush(aTagBrush) {
				appendChild(aTagBrush.element());
			}

			function appendString(string) {
				jQuery(element).append(string);
			}

			function appendFunction(fn) {
				var root = canvas.root;
				canvas.root = that;
				fn(canvas);
				canvas.root = root;
			}

			function appendChild(obj) {
				if (element.canHaveChildren !== false) {
					element.appendChild(obj);
				} else {
					element.text = element.text + obj.innerHTML;
				}
			}

			/* Public API */
			that.element = function () {
				return element;
			};

			/*
			* render objects. Can take a single or several arguments.
			* Usage example:
			*
			* html.h1().render(
			*		'hello',
			*       html.span('world'),
			*       function(html) {
			*			html.img().src('foo.img');
			*       }
			*   )
			*/

			that.render = function () {
				var args = Array.prototype.slice.call(arguments);
				for (var i = 0; i < args.length; i++) {
					append(args[i]);
				}
				return that;
			};

			that.appendToBrush = function(aTagBrush) {
				aTagBrush.addBrush(that);
			};

			// TODO: rename to that.appendBrush ?
			that.addBrush = appendBrush;

			// events are delegated to jQuery
			that.on = function (event, callback) {
				that.asJQuery().bind(event, callback);
				return that;
			};

			// Create a function for each event
			function createEvent(eventname) {
				return function (callback) {
					that.on(eventname, callback);
					return that;
				};
			}
			for (var eventIndex = 0; eventIndex < events.length; eventIndex++) {
				that[events[eventIndex]] = createEvent(events[eventIndex]);
			}

			// Create a function for each attribute
			function createAttrubute(attributename) {
				return function (value) {
					that.setAttribute(attributename, value);
					return that;
				};
			}
			for (var attributeIndex = 0; attributeIndex < attributes.length; attributeIndex++) {
				that[attributes[attributeIndex]] = createAttrubute(attributes[attributeIndex]);
			}

			that.setAttribute = function (key, value) {
				element.setAttribute(key, value);
				return that;
			};

			that.css = function (key, value) {
				if (typeof key === "string") {
					that.asJQuery().css(key, value);
				}
				// otherwise assume key is a map (object literal)
				else {
					that.asJQuery().css(key);
				}

				return that;
			};

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

			that.addClass = function (string) {
				that.asJQuery().addClass(string);
				return that;
			};

			that.removeClass = function (string) {
				that.asJQuery().removeClass(string);
				return that;
			};

			//TODO: needed?
			that.contents = function (obj) {
				that.asJQuery().empty().
				append(obj);
				return that;
			};

			that.asJQuery = function () {
				return jQuery(that.element());
			};


			/* TagBrush initialization */

			// TODO: only support one element?
			if (spec.jQuery) {
				element = spec.jQuery.get(0);
			} else {
				element = createElement(spec.tag);
			}

			// support for nesting eg. html.ul(html.li(html.a({href: '#'}, 'home'));
			if (spec.children) {
				for (var childIndex = 0; childIndex < spec.children.length; childIndex++) {
					append(spec.children[childIndex]);
				}
			}

			return that;
		};

		return htmlCanvas;
	}
);