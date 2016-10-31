define([
	"widgetjs/widget",
    "htmlparser"
], function(widget) {

    function isBlank(str) {
        return (!str || /^\s*$/.test(str));
    }

    function isBlankline(str) {
        return (/^\s*[\r\n]/).test(str);
    }

    var attributes = ("href for id media rel src style title type blur focus focusin focusout load resize scroll unload " +
        "click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit " +
        "keydown keypress keyup error dragstart dragenter dragover dragleave drop dragend").split(" ");

    function converterWidget() {
		var that = widget();

		that.renderContentOn = function(html) {
            html.h1("HTML");
            html.textarea({id: "html", cols: "60", rows: "20", style: "width: 100%"});

            html.button("Convert").click(function() {

                var markup = $("#html").val();

                var current = {
                    children: []
                };


                // Write Code

                var results = "";
                var level = 0;

                function indent() {
                    for(var indentIndex = 0; indentIndex < level; indentIndex += 1) {
                        results += "\t";
                    }
                }

                function newline() {
                    results += "\n";
                }

                function writeTagStart (tag) {
                    results += "html." + tag + "(";
                }

                function writeTagEnd () {
                    results += !current.parent ? ");" : ")";
                }

                function writeText (text) {
                    results += "\"" + text + "\"";
                }

                function writeSeparator () {
                    results += ", ";
                }

                function writeAttributes (attrs) {
                    if(attrs.length <= 0) {
                        return;
                    }

                    results += "{";
                    for (var i = 0; i < attrs.length; i++){
                        var name = attrs[i].name;
                        if(attributes.indexOf(name) < 0) {
                            name = "\"" + name + "\"";
                        }
                        if(name === "class") {
                            name = "klass";
                        }

                        results += " " + name + ": \"" + attrs[i].escaped + "\"";
                        if(i < attrs.length - 1) {
                            results += ", ";
                        }
                    }
                    results += "}";
                }


                // Parse markup
                HTMLParser(markup, {
                    start: function(tag, attrs, unary) {
                        // Separate if we have a sibling or parent have attrs
                        if(current.parent && (current.children.length > 0 || (current.attrs && current.attrs.length > 0))) {
                            writeSeparator();
                        }

                        var parent = current;
                        current = {
                            tag: tag,
                            attrs: attrs,
                            parent: parent,
                            children: []
                        };
                        parent.children.push(current);

                        newline();
                        indent();
                        writeTagStart(tag);
                        writeAttributes(attrs);

                        if(unary) {
                            current = current.parent;
                            writeTagEnd();
                        } else {
                            level++;
                        }
                    },
                    end: function(tag) {
                        level--;
                        current = current.parent;

                        newline();
                        indent();
                        writeTagEnd();

                    },
                    chars: function(str) {
                        var text = str.replace(/^\s+|\s+$/g, " "); // allow only one blank before/after
                        if(isBlankline(text) || isBlank(text)) {
                            return;
                        }

                        // If we have a sibling or parent have attrs
                        if(current.children.length > 1 || (current.attrs && current.attrs.length > 0)) {
                            writeSeparator();
                        }

                        current.children.push(text.trim());

                        newline();
                        indent();
                        writeText(text);
                    }
                });

                $("#code").val(results);

                return false;
            });

            html.h1("Code");
            html.textarea({id: "code", cols: "60", rows: "20", style: "width: 100%"});
        };


		return that;
	}

	return converterWidget;
});
