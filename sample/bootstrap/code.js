define([
	"widgetjs/widgetjs",
	"lodash",
	"jquery",
	"prettify"
], function(widgetjs, lodash, jQuery, prettify) {

    jQuery.fn.prettify = function() { this.html(prettify.prettyPrintOne(this.html())); };

    var code = widgetjs.widget.subclass(function(that, my) {

		var label;
		var group;
		var example;
		var tags;
		var links;
		var showCode;
		var showTags;
		var showLinks;

		my.initialize = function(spec) {
			label = spec.label;
			group = spec.group;
			example = spec.example;
			tags = spec.tags || [];
			links = spec.links || [];
			showCode = spec.showCode === undefined ? true : spec.showCode;
			showTags = spec.showTags === undefined ? true : spec.showTags;
			showLinks = spec.showLinks === undefined ? true : spec.showLinks;

			that.group = group;
			that.label = label;
		};

        that.toggleCode = function(state) {
            showCode = state;
            that.update();
        };

        that.match = function(tokens) {
            var code = my.getCode();
            return tokens.every(function(token) {
                return label.toLowerCase().indexOf(token) >= 0 ||
                    group.toLowerCase().indexOf(token) >= 0 ||
                    tags.indexOf(token) >= 0 ||
                    code.toLowerCase().indexOf(token) >= 0;
            });
        };

        my.getCode = function() {
            var lines = example.toString().split("\n");
            lines.splice(0,1);
            lines.splice(lines.length - 1,1);

            // Find extra indent
            var minIndent = Math.min.apply(0,
                lines.filter(function(line) {
                    return line.trim().length !== 0;
                }).map(function(line) {
                        var match = line.match(/(\s)*/);
                        return match ? match[0].length : 0;
                    })
            );

            // Remove extra indent
            if(minIndent > 0) {
                lines = lines.map(function(line) {
                    return line.replace(RegExp("^(\\s){" + minIndent + "}", "g"), "");
                });
            }

            return lines.join("\n");
        };

        my.renderCodeOn = function(html) {
            if(!showCode) {
                return;
            }

            var codeBlock = html.pre({"class" : "prettyprint lang-js"}, my.getCode());
            codeBlock.asJQuery().prettify();
        };

        my.renderExampleOn = function(html) {
            html.div({"class" : "bs-example"}, example) ;
        };

        that.renderContentOn = function(html) {
            html.div(
                html.h3(label),
                my.renderCodeOn,
                my.renderExampleOn
            );

            if(showTags) {
                html.ul({"class" : "list-inline"}, tags.map(function(tag) { return html.li(tag);}));
            }

            if(showLinks) {
                html.ul({"class" : "list-unstyled"}, links.map(function(link) { return html.li(html.a({href: link, target: "_new"}, link));}));
            }
        };
    });

    return code;
});
