import router from "./router";
import events from "./events";
import htmlCanvas from "./htmlCanvas";
import jQuery from "jquery";
import {getCurrentWidget, withCurrentWidget} from "./currentWidget";
import {newId} from "./idGenerator";

/**
 * Base for all widgets. A widget can keep state in variables, contain logic and
 * render itself through `renderContentOn()`.
 *
 * @example
 *
 * class TitleWidget extends Widget {
 *   _initialize(spec) {
 *       this._title = spec.title || "Hello World";
 *   }
 *
 *   renderContentOn(html) {
 *     html.h1(title);
 *   }
 *
 * };
 *
 * let helloWorldWidget = new TitleWidget({title: "Hello Widget!"});
 *
 * $(document).ready(() => {
 *   helloWorldWidget.appendTo("BODY");
 * });
 *
 * Widgets can also be rendered on a HTML canvas (since widget
 * implements `appendToBrush()`). Eg.
 *
 *        html.div(helloWorldWidget)
 *
 * It is therefore easy to compose widgets from other widgets.
 *
 * @virtual
 *
 * @param {String} [spec.id] Unique id for widget. Also used for root
 *                           element when attached/rendered to DOM.
 *                           If not provided an ID will automatically
 *                           be generated and assigned.
 */
export default class Widget2 {
	constructor({id} = {}) {
		this._id = id || newId();

		// When within an update transaction, do not update the widget
		this._inUpdateTransaction = false;

		// Keep track of the renderer subwidgets
		this._children = [];

		// Events for widget
		this._events = events.eventCategory();
		this.onAttach = this._events.createEvent();
		this.onDetach = this._events.createEvent();

		// Expose events
		this.register = this._events.register;
		this.registerOnce = this._events.registerOnce;
		this.unregister = this._events.unregister;
		this.trigger = this._events.trigger;

		// Route / Controller extensions
		this._router = router.getRouter();

		this._linkTo = this._router.linkTo;
		this._linkToPath = this._router.linkToPath;
		this._linkToUrl = this._router.linkToUrl;

		this._redirectTo = this._router.redirectTo;
		this._redirectToPath = this._router.redirectToPath;
		this._redirectToUrl = this._router.redirectToUrl;

		this._redirectToLocationPath = this._router.redirectToLocationPath;

		this._getParameters = this._router.getParameters;
		this._getParameter = this._router.getParameter;
		this._setParameters = this._router.setParameters;

		this._initialize(...arguments);
		this._initializeSubwidgets(...arguments);
	}

	/**
	 * Hook evaluated at the beginning of initialization. Always
	 * implement initialization code in overrides of this method (or
	 * of `_initializeSubwidgets()`). In particular, don't override
	 * `constructor()`.
	 */
	_initialize(spec) {
	}

	/**
	 * Hook evaluated at the end of initialization.
	 */
	_initializeSubwidgets(spec) {
	}

	//
	// Public
	//

	/**
	 * Returns a unique id for the widget
	 *
	 * @returns {String}
	 */
	getId() {
		return this._id;
	}

	/**
	 * Performance tasks need for freeing/releasing/cleaning-up
	 * resources used by widget.
	 *
	 * Should always be executed before a widget is
	 * disposed. Especially if the widget registers events to avoid
	 * memory leaks.
	 *
	 * Most widgets should override `_dispose` instead of overriding
	 * this function.
	 *
	 */
	dispose() {
		this._children.forEach((child) => {
			child.dispose();
		});

		this._dispose();
		this._events.dispose();
	}

	/**
	 * Method to be performed when a root widget is detached from the
	 * DOM. The widget and all its children will call `_willDetach` in
	 * turn.
	 */
	willDetach() {
		this._children.forEach((child) => {
			child.willDetach();
		});

		this._willDetach();
		this.onDetach.trigger();
	}

	/**
	 * Renders the widget on a JQuery / DOM
	 *
	 * @example
	 * widget.appendTo("BODY");
	 *
	 * @param aJQuery
	 */
	appendTo(aJQuery) {
		this._withAttachHooks(() => {
			this._renderBasicOn(htmlCanvas(aJQuery));
		});
	}

	/**
	 * Does the same as `appendTo` except it first clears the elements
	 * matched by aJQuery
	 *
	 * @param aJQuery
	 */
	replace(aJQuery) {
		this._withAttachHooks(() => {
			let canvas = htmlCanvas(aJQuery);
			canvas.root.asJQuery().empty();
			this._renderBasicOn(canvas);
		});
	}

	/**
	 * Answers a jQuery matching the root DOM element. By default
	 * by selecting an element that have the same ID as the widget.
	 *
	 * See "renderOn".
	 */
	asJQuery() {
		return jQuery("#" + this.getId());
	}

	/**
	 * Answers true if widget has rendered content in DOM
	 *
	 * @returns {boolean}
	 */
	isRendered() {
		return this.asJQuery().length > 0;
	}

	/**
	 * Allows a widget to be appended to a brush. See "htmlCanvas".
	 *
	 * Basically it allows us to do:
	 *        html.div(widget);
	 */
	appendToBrush(aTagBrush) {
		this._withAttachHooks(() => {
			this._renderBasicOn(htmlCanvas(aTagBrush.asJQuery()));
		});
	}

	/**
	 * Trigger the `willAttach` event on the receiver and all
	 * rendered subwidgets.
	 */
	triggerWillAttach() {
		this._willAttach();
		this._children.forEach((widget) => {
			widget.triggerWillAttach();
		});
	}

	/**
	 * Trigger the `didAttach` hook on the receiver and all rendered
	 * subwidgets.
	 */
	triggerDidAttach() {
		this._didAttach();

		this._children.forEach((widget) => {
			widget.triggerDidAttach();
		});

		this.onAttach.trigger();
	}

	/**
	 * Evaluate `fn`, calling `willAttach` before and `didAttach` after
	 * the evaluation.
	 */
	_withAttachHooks(fn) {
		let inRenderingLoop = !!getCurrentWidget();

		if (!inRenderingLoop) {
			this.triggerWillAttach();
		}

		fn();

		if (!inRenderingLoop) {
			this.triggerDidAttach();
		}
	}

	/**
	 * Create and expose an event named `name`.
	 */
	_createEvent(name) {
		this[name] = this._events.createEvent();
	}

	/**
	 * Create and expose one event per string argument.
	 */
	_createEvents() {
		let names = Array.prototype.slice.apply(arguments);

		names.forEach(name => this._createEvent(name));
	}

	//
	// Protected
	//

	/**
	 * Exposes the internal ID generator. Generates new unique IDs to
	 * be used for sub-widgets, etc.
	 *
	 * @returns {String}
	 */
	_nextId() {
		return newId();
	}

	/**
	 * Widget specific dispose.
	 */
	_dispose() {
	}

	//
	// Render
	//

	/**
	 * Private rendering function.    This is the function
	 * internally called each time the widget is rendered, in
	 * `appendTo`, `replace` and `update`.
	 *
	 */
	_renderBasicOn(html) {
		this._withChildrenRegistration(() => {
			this.renderOn(html);
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
	 *        renderOn(html) {
	 *			html.ul({id: that.getId()}
	 *				html.li("BMW"),
	 *				html.li("Toyota")
	 *			);
	 *		};
	 *
	 *
	 * @param html
	 */
	renderOn(html) {
		// Renders widget by wrapping `renderContentOn()` in a root element.
		this._renderRootOn(html).render(this.renderContentOn.bind(this));
	}

	_withChildrenRegistration(fn) {
		let parent = getCurrentWidget();

		if (parent) {
			parent.registerChild(this);
		}

		withCurrentWidget(() => {
			this._children = [];
			fn();
		}, this);
	}

	registerChild(widget) {
		this._children.push(widget);
	}

	/**
	 * Renders a wrapper element (by default a "widgetjs-widget" tag) and
	 * sets the element ID to the ID of the widget so that it can be found by
	 * "asJQuery" eg. when we re-render using "update".
	 *
	 * @param html
	 * @returns {htmlBrush}
	 */
	_renderRootOn(html) {
		return html.tag("widgetjs-widget").id(this._id);
	}

	/**
	 * Overridden in concrete widgets to render widget to canvas/DOM.
	 *
	 * @example
	 *
	 *        renderContentOn(html) {
	 *			html.ul(
	 *				html.li("BMW"),
	 *				html.li("Toyota")
	 *			);
	 *		};
	 *
	 * @param {htmlCanvas} html
	 */
	renderContentOn(html) {
		throw new Error("Subclass responsibility");
	}

	/**
	 * Hook evaluated before the widget is attached (or reattached due
	 * to an update of rendering) to the DOM.
	 */
	_willAttach() {
	}

	/**
	 * Hook evaluated each time the widget is attached (or
	 * reattached due to an update of rendering) to the DOM.
	 */
	_didAttach() {
	}

	/**
	 * Hook evaluated when a widget is detached from the DOM.
	 */
	_willDetach() {
	}

	/**
	 * Hook evaluated before widget update.
	 */
	_willUpdate() {
	}

	/**
	 * Re-renders the widget and replace it in the DOM
	 */
	update() {
		if (this._inUpdateTransaction || !this.isRendered()) {
			return;
		}

		this._willUpdate();
		this._withAttachHooks(() => {
			// clear content of root
			this.asJQuery().empty();

			// re-render content on root
			let html = htmlCanvas(this.asJQuery());

			this._withChildrenRegistration(() => {
				this.renderContentOn(html);
			});
		});
	}

	withinTransaction(fn, onDone) {
		if (this._inUpdateTransaction) {
			fn();
		} else {
			try {
				this._inUpdateTransaction = true;
				fn();
			} finally {
				this._inUpdateTransaction = false;
				if (onDone) {
					onDone();
				}
			}
		}
	}

	/**
	 * Evaluate `fn`, ensuring that an update will be
	 * performed after evaluating the function. Nested calls
	 * to `withUpdate` or `update` will result in updating the
	 * widget only once.
	 */
	withUpdate(fn) {
		this.withinTransaction(fn, this.update.bind(this));
	}

	withNoUpdate(fn) {
		this.withinTransaction(fn);
	}
}
