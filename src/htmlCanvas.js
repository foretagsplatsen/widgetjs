import jQuery from "jquery";

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

// Supported HTML attributes
var attributes = "href for id media rel src style title type".split(" ");

var omitSymbol = {};

// Supported HTML events
var events = ("blur focus focusin focusout load resize scroll unload " +
	"click dblclick mousedown mouseup mousemove mouseover " +
	"mouseout mouseenter mouseleave change input select submit " +
	"keydown keypress keyup error dragstart dragenter dragover dragleave drop dragend").split(" ");

function HtmlCanvasConstructor(rootElement) {
	/**
	 * The root object that brushes will append elements to.
	 *
	 * @type {htmlTagBrush}
	 */
	this.root = htmlTagBrush({ element: rootElement });
}

/**
 * Creates a brush that "paints" a tag of type tagName. Any children supplied
 * will be appended as children to brush.
 *
 * @param {string} tagName Type of element (supported by document.createElement)
 * @param {renderable[]} [children] Renderable objects to append as children of brush.
 */
HtmlCanvasConstructor.prototype.tag = function(tagName, children) {
	var tagBrush = htmlTagBrush({ tag: tagName, children: children });
	this.root.appendBrush(tagBrush);
	return tagBrush;
};

/**
 * Tags builders for each supported tag type.
 *
 * @example
 *    html.h1("Title");
 *    html.strong("Important stuff");
 *    html.span(html.strong(userName), " signed in.")
 */
tags.forEach(function(tagName) {
	HtmlCanvasConstructor.prototype[tagName] = function() {
		var args = Array.prototype.slice.call(arguments);
		return this.tag(tagName, args);
	};
});

/**
 * Returns omit symbol that is used to omit a attribute pair
 * and omit the object appended to brush.
 *
 * @returns {{}}
 */
HtmlCanvasConstructor.prototype.omit = function() {
	return omitSymbol;
};

/**
 * Append an object to the root brush
 *
 * @param anObject
 */
HtmlCanvasConstructor.prototype.render = function() {
	var args = Array.prototype.slice.call(arguments);
	this.root.render(args);
};

/**
 * Append an unescaped HTML string to the root brush
 */
HtmlCanvasConstructor.prototype.raw = function(htmlString) {
	this.root.raw(htmlString);
};

/**
 * Append an unescaped string replacing all spaces by
 * non-breaking spaces
 */
HtmlCanvasConstructor.prototype.renderNonBreaking = function(htmlString) {
	this.raw(htmlString.replace(/\s/g, "&nbsp;"));
};

/**
 * htmlCanvas provides a DSL that we use to add elements to the DOM using a HTML looking syntax.
 *
 * The basic metaphor used is one of painting on a canvas using brushes. The canvas is the
 * DOM and the brushes HTML "tags". Note that it have nothing to do with the HTML5 canvas tag
 *
 * @example
 *        // A htmlCanvas is created on a jQuery object:
 *        var html = htmlCanvas($("BODY"));
 *
 *        // We write HTML using standard tags:
 *        html.h1("Hello World!");
 *
 *        // and standard attributes:
 *        html.a({ id: "id", href: "http://www.google.se"}, "Google");
 *
 *        // Callbacks can be attached to events:
 *        html.a({click: function() { alert("Hello World!")} "Click me!");
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
 * @param {string|jQuery|htmlTagBrush} [rootElement] Element to "paint" on. If not supplied a document fragment will be created
 *
 * @returns {htmlCanvas}
 */
function htmlCanvas(rootElement) {
	/** @typedef {{}} htmlCanvas */
	return new HtmlCanvasConstructor(rootElement);
}

function TagBrushConstructor(spec) {
	/**
	 * Create a new element from tagName or get it from elements.
	 *
	 * @type {HTMLElement}
	 */
	this.element = spec.tag ? this.createElement(spec.tag) : this.getElement(spec.element);
	if (!this.element) {
		throw new Error("htmlTagBrush requires an element");
	}

	/**
	 * Append children to support nesting
	 *
	 * @example
	 *		html.ul(html.li(html.a({href: "#"}, "home"));
	 */
	if (spec.children) {
		this.append(spec.children);
	}
}

var elementCache = {};

/**
 * Creates a new element from tagName
 *
 * @param {string} tagName
 * @returns {Element}
 */
TagBrushConstructor.prototype.createElement = function(tagName) {
	if (!elementCache[tagName]) {
		elementCache[tagName] = document.createElement(tagName);
	}
	return elementCache[tagName].cloneNode(false);
};

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
TagBrushConstructor.prototype.append = function(object) {
	if (object.appendToBrush) {
		object.appendToBrush(this);
		return;
	}

	// Assume attributes
	if (typeof object === "object") {
		this.attr(object);
		return;
	}

	throw new Error("Unsupported data type");
};

omitSymbol.appendToBrush = function(brush) {};

String.prototype.appendToBrush = function(brush) {
	brush.appendString(this);
};

Function.prototype.appendToBrush = function(brush) {
	brush.appendFunction(this);
};

Number.prototype.appendToBrush = function(brush) {
	this.toString().appendToBrush(brush);
};

Array.prototype.appendToBrush = function(brush) {
	var length = this.length;
	for (var i = length - 1; i >= 0; i--) {
		brush.append(this[length - i - 1]);
	}
};

/**
 * Appends DOM node as last child of element or concatenate with
 * text if element can"t have children.
 *
 * @param {string|HTMLElement} child
 */
TagBrushConstructor.prototype.appendChild = function(child) {
	if (this.element.canHaveChildren !== false) {
		this.element.appendChild(child);
	} else {
		this.element.text = this.element.text + child.innerHTML;
	}
};

/**
 * Appends element of brush
 *
 * @param {htmlTagBrush} aTagBrush
 */
TagBrushConstructor.prototype.appendBrush = function(aTagBrush) {
	this.appendChild(aTagBrush.element);
};

/**
 * Append text as child. `string` is escaped
 *
 * @param {string} string
 */
TagBrushConstructor.prototype.appendString = function(string) {
	jQuery(this.element).append(document.createTextNode(string));
};

/**
 * Append function by executing function with this element as canvas.
 *
 * @param {renderer} fn
 */
TagBrushConstructor.prototype.appendFunction = function(fn) {
	fn(new HtmlCanvasConstructor(this));
};

/**
 * Element is set to first match if a jQuery was given.
 *
 * @param {string|jQuery|HTMLElement|widget|htmlTagBrush} [object]
 * @returns {HTMLElement}
 */
TagBrushConstructor.prototype.getElement = function(object) {

	// Create a fragment if no object
	if (object === undefined || object === null) {
		return document.createDocumentFragment();
	}

	// Any object that implements asJQuery eg. widget and tagBrush
	if (typeof object === "object" && object.asJQuery) {
		return object.asJQuery().get(0);
	}

	// Fall back on jQuery if a string containing a selector expression,
	// a DOM Element, an existing jQuery object or any other argument that
	// jQuery accept (http://api.jquery.com/jQuery/)
	return jQuery(object).get(0);
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
TagBrushConstructor.prototype.render = function() {
	var args = Array.prototype.slice.call(arguments);
	for (var i = 0; i < args.length; i++) {
		this.append(args[i]);
	}
	return this;
};

/**
 * Implementation for `appendToBrush()` to allow a brush to be
 * appended to another brush.
 *
 * @param {htmlTagBrush} aTagBrush
 */
TagBrushConstructor.prototype.appendToBrush = function(aTagBrush) {
	aTagBrush.appendBrush(this);
};

/**
 * Set unescaped html contents.
 *
 * @param {string} htmlContents
 */
TagBrushConstructor.prototype.html = function(htmlContents) {
	this.asJQuery().html(htmlContents);
	return this;
};

/**
 * Append an unescaped html contents.
 *
 * @param {string} htmlContents
 */
TagBrushConstructor.prototype.raw = function(htmlContents) {
	this.asJQuery().append(htmlContents);
	return this;
};

/**
 * Append an unescaped string replacing all spaces by
 * non-breaking spaces
 */
TagBrushConstructor.prototype.renderNonBreaking = function(htmlString) {
	this.raw(htmlString.replace(/\s/g, "&nbsp;"));
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
TagBrushConstructor.prototype.on = function(eventType, callback) {
	this.asJQuery().bind(eventType, callback);
	return this;
};

/**
 * Event functions for each supported event type.
 *
 * @example
 *	aBrush.click(function() { .. });
 *	aBrush.blur(function() { .. });
 */
events.forEach(function(eventType) {
	TagBrushConstructor.prototype[eventType] = function(callback) {
		return this.on(eventType, callback);
	};
});

/**
 * Adds a new attribute or changes the value of an existing attribute on the specified element.
 * @param key
 * @param value
 * @returns {{}}
 */
TagBrushConstructor.prototype.setAttribute = function(key, value) {
	// Omit attribute if value is omit
	if (value === omitSymbol) {
		return this;
	}

	this.element.setAttribute(key, value);
	return this;
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
	TagBrushConstructor.prototype[attributeName] = function(value) {
		return this.setAttribute(attributeName, value);
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
TagBrushConstructor.prototype.css = function(key, value) {
	if (typeof key === "string") {
		this.asJQuery().css(key, value);
	}
	else {
		this.asJQuery().css(key); // otherwise assume key is a map (object literal)
	}

	return this;
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
TagBrushConstructor.prototype.attr = function(object) {
	for (var key in object) {
		if (Object.prototype.hasOwnProperty.call(object, key)) {
			// Attach functions
			if (typeof object[key] === "function") {
				this.on(key, object[key]);
			}

			else if (key === "klass") {
				this.element.className = object[key];
			} else {
				this.setAttribute(key, object[key]);
			}
		}
	}
	return this;
};

/**
 * Appends className to class attribute
 * @param className
 * @returns {htmlTagBrush}
 */
TagBrushConstructor.prototype.addClass = function(className) {
	this.asJQuery().addClass(className);
	return this;
};

/**
 * Removes className from class attribute
 *
 * @param {string} className
 * @returns {htmlTagBrush}
 */
TagBrushConstructor.prototype.removeClass = function(className) {
	this.asJQuery().removeClass(className);
	return this;
};

/**
 * Returns jQuery that match element.
 * @returns {jQuery}
 */
TagBrushConstructor.prototype.asJQuery = function() {
	return jQuery(this.element);
};

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
	return new TagBrushConstructor(spec);
}

export default htmlCanvas;
