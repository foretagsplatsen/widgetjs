define([
	"widgetjs/widgetjs",
	"styleExamples",
	"componentsExamples",
	"javascriptExamples",
	"bootstrap"
], function(widgetjs, styleExamples, componentsExamples, javascriptExamples) {

    function uniqueValues(value, index, self) {
        return self.indexOf(value) === index;
    }

    var bootstrapBrowserApp = widgetjs.widget.subclass(function(that, my) {

        var searchFilter = "";

        // Examples can exist in other groups but will then be sorted last
        var groupOrder = ["Grid", "Typography", "Code", "Tables", "Forms", "Buttons", "Images", "Responsive utilities"];
        function groupSort (a, b) {
            var aIndex = groupOrder.indexOf(a);
            var bIndex = groupOrder.indexOf(b);

            // order alphabetically if not in groupOrder
            if(aIndex < 0 && bIndex < 0) {
                return a === b ? 0 : a > b ? 1 : -1;
            }

            if(aIndex < 0) {
                return 1;
            }

            if(bIndex < 0) {
                return -1;
            }

            return aIndex - bIndex;
        }

        // Examples
        var styles = Object.keys(styleExamples).map(function(key) {
            return styleExamples[key];
        });

        var components = Object.keys(componentsExamples).map(function(key) {
            return componentsExamples[key];
        });

        var scripts = Object.keys(javascriptExamples).map(function(key) {
            return javascriptExamples[key];
        });

        var examples = styles.concat(components).concat(scripts);

        // Filtered examples
        function getExamples () {
            if(searchFilter && searchFilter.trim().length > 0) {
                var tokens = searchFilter.trim().toLowerCase().split("\\s+");
                return examples.filter(function(example) {
                    return example.match(tokens);
                });
            }

            return examples;
        }

        // Groups from filtered examples
        function getGroups() {
            return getExamples().map(function(example) {
                return example.group;
            }).filter(uniqueValues).sort(groupSort);
        }

        function getExamplesInGroup (group) {
            return getExamples().filter(function(example) {
                return example.group === group;
            });
        }

        that.renderContentOn = function(html) {
            html.div({"class" : "container-fluid"},
                html.div({"class" : "col-sm-3 col-md-2 sidebar"},
                    html.h3("BOOTSTRAP"),
                    html.br(),

                    html.div({ "class" : "input-group"},
                        html.input({ id: "searchField", type: "text",  klass: "form-control", autofocus: "autofocus", value: searchFilter})
                            .keyup(function(event){
                                if(event.keyCode == 13){
                                    searchFilter = jQuery("#searchField").val();
                                    that.update();
                                }
                            }
                        ),
                        html.span({ klass: "input-group-btn"},
                            html.button({ klass: "btn btn-default",  type: "button"}, "Search").click(function() {
                                searchFilter = jQuery("#searchField").val();
                                that.update();
                            })
                        )
                    ),

                    html.br(),

                    html.div({klass: "examples-nav-sidebar"},
                        html.ul({ id: "examples-nav", klass: "nav nav-sidebar"},
                            getGroups().map(function(group) {
                                return html.li(html.a({href: "#" + getGroupIdentifier(group) }, group)).click(function(e) {
                                    e.preventDefault();
                                    var target = jQuery(e.target.hash);
                                    jQuery("BODY").animate({ scrollTop: target.offset().top }, 600, function() {
                                        window.location.hash = e.target.hash;
                                    });
                                });
                            })
                        )
                    ),

                    html.label(
                        html.input({type: "checkbox", checked : "checked"}).click(function(){
                            var showCode = jQuery(this).get(0).checked;
                            examples.forEach(function(example) {
                                example.toggleCode(showCode);
                            });
                            refreshScrollspy();
                        }), " Show code"
                    )
                ),

                html.div({"class" : "col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main" },
                    that.renderStylesOn
                )
            );

            jQuery("BODY").scrollspy({ target: ".examples-nav-sidebar", offset : 20 });
            refreshScrollspy();
        };

        function refreshScrollspy () {
			jQuery("[data-spy=\"scroll\"]").each(function() {
                jQuery(this).scrollspy("refresh");
            });
        }

        that.renderStylesOn = function(html) {
            getGroups().forEach(function(group) {
                html.h1({ id: getGroupIdentifier(group), "class": "page-header" }, group);
                html.render(getExamplesInGroup(group));
            });
        };

        function getGroupIdentifier (group) {
            return group.replace(/ /g,"_");
        }
    });

    return bootstrapBrowserApp;
});
