define(
    [
        './widget-extensions',
        './router',
        './events',
        './htmlCanvas'
    ],

    function (ext, router, events, htmlCanvas) {

         /*
          * A Widget uses an HTML canvas to render itself using renderContentOn()
         */
        var widget = function (spec, my) {
            my = my || {};
            spec = spec || {};

            var that = {};

            /* Unique id identifying the widget */
            var id = spec.id || idGenerator.newId();

            /* Mix in Events (See events.js)
             *
             * Trigger events using:
             * that.trigger('event_id', event_data)
             *
             * Listen for events:
             * that.on('event_id', function(event_data) { });
             *
             * or more commonly:
             * var w = widget();
             * w.on('event_id', function(event_data) { });
             */
            jQuery.extend(that, events.eventhandler());

            /*
             * Third party protected extensions added to my
             *
             * In your application include widget extensions:
             * define(['canvas/'widget-extensions], function(ext) { ... });
             *
             * add properties to ext that you need in all widgets.
             * ext.hello = function() { alert('hello world')};
             *
             * and use in all widgets:
             * my.hello();
             *
             */
            for (var i in ext) {
                my[i] = ext[i];
            }

            /*
             * Answer the (sub) widgets of the widget. Needed
             * to traverse widget tree.
             *
             * Override in concrete widgets!
             */
            that.widgets = function () {
                return [];
            };

            /*
             * Expose the id
             */
            that.getId = function() {
                return id;
            };

            that.id = function() {
                return id;
            };


            /*
             * Route / Controller extensions
             */

            my.linkTo = function (path) {
                return router.router.linkTo(path);
            };

            my.redirectTo = function (path) {
                router.router.redirectTo(path);
            };

            /*
             * Render extensions
            */

            that.appendTo = function (aJQuery) {
                that.renderOn(htmlCanvas(aJQuery));
            };

            that.replace = function(aJQuery) {
                var canvas = htmlCanvas(aJQuery);
                canvas.root.asJQuery().empty();
                that.renderOn(canvas);
            };

            /* that.appendToBrush makes it possible
               to append a widget to a brush eg.

                html.div(widget);
            */
            that.appendToBrush = function (aTagBrush) {
                that.appendTo(aTagBrush.asJQuery());
            };

            that.asJQuery = function() {
                return jQuery('#' + that.getId());
            };

            /*
             * Update: makes it possible to do widget.update() to make it re-render.
             *
             * renderOn() wrapps content rendered by widget (renderContentOn) inside a
             * root element (default a div).
             *
             * update() empties the root element and re-render content (renderContentOn)
             *
             *
             * If you decide to override renderOn() you should also override isRendered and update().
             * Also override asJQuery() if the root elements id is not the widget id.
             */

            that.isRendered = function() {
                return that.asJQuery().length > 0; // TODO: correct way to check if rendered? maybe rendered but no content?
            };

            /*
             * Render wrapper/root - a div as default
             */
            my.renderRoot = function(html) {
                return html.div().id(id);
            };

            /*
             * Renders the acctual content inside the wrapper div
             * Override in concrete widgets!
             */
            that.renderContentOn = function (html) {
            };

            /*
             * Wraps renderContentOn() in a root element.
             */
            that.renderOn = function (html) {
                my.renderRoot(html).render(that.renderContentOn);
            };

             /*
             * update() is a general purpose function that will re-render the widget
             * completely inside its root div.
             */
            that.update = function () {
                if(!that.isRendered()) {
                    return;
                }

                var rootCanvas = htmlCanvas(that.asJQuery());

                rootCanvas.root.asJQuery().empty();
                that.renderContentOn(rootCanvas);
            };

            return that;
        };


        /*
         * The idGenerator is responsible for creating unique ids. ids are used by widgets to
         * identify their root div.
         */

        var idGenerator = (function () {
            var that = {};
            var id = 0;

            that.newId = function () {
                id += 1;
                return id.toString();
            };

            return that;
        })();


        return widget;
    }
);
