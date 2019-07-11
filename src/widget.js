import klassified from "klassified";
import widgetExtensions from "./widget-extensions";
import router from "./router";
import events from "./events";
import htmlCanvas from "./htmlCanvas";
import jQuery from "jquery";
import {getCurrentWidget, withCurrentWidget} from "./currentWidget";
import {newId} from "./idGenerator";

/**
 * Base for all widgets. A widget can keep state in variables, contain logic and
 * render itself using `renderOn()`.
 *
 * @example
 *
 *        var titleWidget = function(spec) {
 *			var that = widget(spec);
 *
 *			var title = spec.title || "Hello World";
 *
 *			that.renderContentOn = function(html) {
 *				html.h1(title)
 *			}
 *
 *			return that;
 *		};
 *
 *        var helloWorldWidget = titleWidget({title: "Hello Widget!"});
 *
 *        $(document).ready(function() {
 *			helloWorldWidget.appendTo("BODY");
 *		});
 *
 * Widgets can also be rendered on a HTML canvas (since widget implements `appendToBrush()`). Eg.
 *
 *        html.div(helloWorldWidget)
 *
 * It is therefor easy to compose widgets from other widgets.
 *
 * @virtual
 *
 * @param {Object} spec
 * @param {String} [spec.id] Unique id for widget. Also used for root element when attached/rendered to DOM.
 *                           If not provided an ID will automatically be generated and assigned.
 * @param {Object} [my]
 *
 * @returns {widget}
 */
var widget = klassified.object.subclass(function(that, my) {

	/**
	 * Keep track of the rendered subwidgets
	 */
	var children;
	var id;

	my.initialize = function(spec) {
		my.super(spec);
		id = spec.id || newId();
		// When within an update transaction, do not update the widget
		my.inUpdateTransaction = false;
		children = [];
	};

	/**
	 * Hook evaluated at the end of widget initialization and
	 * before any rendering.
	 */
	my.initializeSubwidgets = function(spec) {};

	my.postInitialize = function(spec) {
		my.initializeSubwidgets(spec);
	};

	/** Events for widget */
	my.events = events.eventCategory();

	that.onAttach = my.events.createEvent();
	that.onDetach = my.events.createEvent();

	//
	// Public
	//

	/**
	 * Returns a unique id for the widget
	 *
	 * @returns {String}
	 */
	that.getId = function() {
		return id;
	};

	that.id = that.getId; //TODO: deprecated

	/**
	 * Performance tasks need for freeing/releasing/cleaning-up resources used by widget.
	 *
	 * Should always be executed before a widget is disposed. Especially
	 * if the widget register events to avoid memory leaks.
	 *
	 * Most widgets should override `my.dispose` instead of overriding
	 * this function.
	 *
	 */
	that.dispose = function() {
		children.forEach(function(child) {
			child.dispose();
		});
		my.dispose();

		my.events.dispose();
	};

	/**
	 * Method to be performed when a root widget is detached from the
	 * DOM. The widegt and all its children will call `my.willDetach` in
	 * turn.
	 */
	that.willDetach = function() {
		children.forEach(function(child) {
			child.willDetach();
		});
		my.willDetach();
		that.onDetach.trigger();
	};

	/**
	 * Renders the widget on a JQuery / DOM
	 *
	 * @example
	 * widget.appendTo("BODY");
	 *
	 * @param aJQuery
	 */
	that.appendTo = function(aJQuery) {
		my.withAttachHooks(function() {
			renderBasicOn(htmlCanvas(aJQuery));
		});
	};

	/**
	 * Does the same as appendTo except it first clear the
	 * elements matched by aJQuery
	 *
	 * @param aJQuery
	 */
	that.replace = function(aJQuery) {
		my.withAttachHooks(function() {
			var canvas = htmlCanvas(aJQuery);
			canvas.root.asJQuery().empty();
			renderBasicOn(canvas);
		});
	};

	/**
	 * Answers a jQuery that match the root DOM element. By default
	 * by selecting an element that have the same ID as the widget.
	 *
	 * See "renderOn"
	 *
	 * @returns {*}
	 */
	that.asJQuery = function() {
		return jQuery("#" + that.getId());
	};

	/**
	 * Answers true if if widget have rendered content in DOM
	 *
	 * @returns {boolean}
	 */
	that.isRendered = function() {
		return that.asJQuery().length > 0;
	};

	/**
	 * Implementation for `appendToBrush()` to allow a widget to be
	 * appended to a brush. See "htmlCanvas".
	 *
	 * Basically it allows us to do:
	 *        html.div(widget);
	 *
	 * @param aTagBrush
	 */
	that.appendToBrush = function(aTagBrush) {
		my.withAttachHooks(function() {
			renderBasicOn(htmlCanvas(aTagBrush.asJQuery()));
		});
	};

	/**
	 * Trigger the `willAttach` event on the receiver and all
	 * rendered subwidgets.
	 */
	that.triggerWillAttach = function() {
		my.willAttach();
		children.forEach(function(widget) {
			widget.triggerWillAttach();
		});
	};

	/**
	 * Trigger the `didAttach` event on the receiver and all
	 * rendered subwidgets.
	 */
	that.triggerDidAttach = function() {
		my.didAttach();
		children.forEach(function(widget) {
			widget.triggerDidAttach();
		});
		that.onAttach.trigger();
	};

	/**
	 * Evaluate `fn`, calling `willAttach` before and `didAttach` after
	 * the evaluation.
	 */
	my.withAttachHooks = function(fn) {
		var inRendering = inRenderingLoop();
		if (!inRendering) {
			that.triggerWillAttach();
		}
		fn();
		if (!inRendering) {
			that.triggerDidAttach();
		}
	};

	/**
	 * Create and expose an event named `name`.
	 */
	my.createEvent = function(name) {
		that[name] = my.events.createEvent();
	};

	/**
	 * Create and expose one event per string argument.
	 */
	my.createEvents = function() {
		var names = Array.prototype.slice.apply(arguments);
		names.forEach(my.createEvent);
	};

	// deprecated, please use the ones below instead
	that.on = my.events.on;
	that.onceOn = my.events.onceOn;
	that.off = my.events.off;

	// Expose events
	that.register = my.events.register;
	that.registerOnce = my.events.registerOnce;
	that.unregister = my.events.unregister;
	that.trigger = my.events.trigger;

	//
	// Protected
	//

	/**
	 * Exposes the internal ID generator. Generates new unique IDs to be used
	 * for sub-widgets, etc.
	 *
	 * @returns {String}
	 */
	my.nextId = function() {
		return newId();
	};

	/**
	 * Widget specific dispose.
	 */
	my.dispose = function() {};

	// Route / Controller extensions

	my.router = router.getRouter();

	my.linkTo = my.router.linkTo;
	my.linkToPath = my.router.linkToPath;
	my.linkToUrl = my.router.linkToUrl;

	my.redirectTo = my.router.redirectTo;
	my.redirectToPath = my.router.redirectToPath;
	my.redirectToUrl = my.router.redirectToUrl;

	my.redirectToLocationPath = my.router.redirectToLocationPath;

	my.getParameters = my.router.getParameters;
	my.getParameter = my.router.getParameter;
	my.setParameters = my.router.setParameters;

	//
	// Render
	//

	/**
	 * Private rendering function.    This is the function
	 * internally called each time the widget is rendered, in
	 * `appendTo`, `replace` and `update`.
	 *
	 */
	function renderBasicOn(html) {
		my.withChildrenRegistration(function() {
			that.renderOn(html);
		});
	}

	/**
	 * Main entry point for rendering. For convenience "renderOn" will    wrap the content
	 * rendered by "renderContentOn" in a root element (renderRootOn) that will be matched
	 * by asJQuery.
	 *
	 * Usually concrete widgets override "renderContentOn" to render it content. Widgets
	 * can override "renderOn" but must then make sure that it can be matched by "asJQuery".
	 *
	 * One way to do that is to make sure to have only one root element and setting the ID of
	 * that element to the ID of the widget.
	 *
	 * @example
	 *
	 *        that.renderOn = function(html) {
	 *			html.ul({id: that.getId()}
	 *				html.li("BMW"),
	 *				html.li("Toyota")
	 *			);
	 *		};
	 *
	 *
	 * @param html
	 */
	that.renderOn = function(html) {
		// Renders widget by wrapping `renderContentOn()` in a root element.
		my.renderRootOn(html).render(that.renderContentOn);
	};

	my.withChildrenRegistration = function(fn) {
		var parent = getCurrentWidget();
		if (parent) {
			parent.registerChild(that);
		}
		withCurrentWidget(function() {
			children = [];
			fn();
		}, that);
	};

	that.registerChild = function(widget) {
		children.push(widget);
	};

	/**
	 * Renders a wrapper element (by default a "widgetjs-widget" tag) and
	 * set the element ID to the ID of the widget so that it can be found by
	 * "asJQuery" eg. when we re-render using "update".
	 *
	 * @param html
	 * @returns {htmlBrush}
	 */
	my.renderRootOn = function(html) {
		return html.tag("widgetjs-widget").id(id);
	};

	/**
	 * Overridden in concrete widgets to render widget to canvas/DOM.
	 *
	 * @example
	 *
	 *        that.renderContentOn = function(html) {
	 *			html.ul(
	 *				html.li("BMW"),
	 *				html.li("Toyota")
	 *			);
	 *		};
	 *
	 * @param {htmlCanvas} html
	 */
	that.renderContentOn = function(html) {
		return my.subclassResponsibility();
	};

	/**
	 * Hook evaluated before the widget is attached (or reattached due
	 * to an update of rendering) to the DOM.
	 */
	my.willAttach = function() {};

	/**
	 * Hook evaluated each time the widget is attached (or
	 * reattached due to an update of rendering) to the DOM.
	 */
	my.didAttach = function() {};

	/**
	 * Hook evaluated when a widget is detached from the DOM.
	 */
	my.willDetach = function() {};

	/**
	 * Hook evaluated before widget update.
	 */
	my.willUpdate = function() {};

	/**
	 * Re-renders the widget and replace it in the DOM
	 */
	that.update = function() {
		if (my.inUpdateTransaction || !that.isRendered()) {
			return;
		}

		my.willUpdate();
		my.withAttachHooks(function() {
			// clear content of root
			that.asJQuery().empty();

			// re-render content on root
			var html = htmlCanvas(that.asJQuery());
			my.withChildrenRegistration(function() {
				that.renderContentOn(html);
			});
		});
	};

	that.withinTransaction = function(fn, onDone) {
		if (my.inUpdateTransaction) {
			fn();
		} else {
			try {
				my.inUpdateTransaction = true;
				fn();
			}
			finally {
				my.inUpdateTransaction = false;
				if (onDone) {
					onDone();
				}
			}
		}
	};

	/**
	 * Evaluate `fn`, ensuring that an update will be
	 * performed after evaluating the function. Nested calls
	 * to `withUpdate` or `update` will result in updating the
	 * widget only once.
	 */
	that.withUpdate = function(fn) {
		that.withinTransaction(fn, that.update);
	};

	that.withNoUpdate = function(fn) {
		that.withinTransaction(fn);
	};

	// Third party protected extensions** added to `my`.
	// See widget-extensions.js
	for (var extProperty in widgetExtensions) {
		if (Object.prototype.hasOwnProperty.call(widgetExtensions, extProperty)) {
			my[extProperty] = widgetExtensions[extProperty];
		}
	}

	return that;
});

/**
 * Return true if the parent widget is rendering the receiver.
 */
function inRenderingLoop() {
	return !!getCurrentWidget();
}

export default widget;
