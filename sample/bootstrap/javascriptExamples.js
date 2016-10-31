define(["widgetjs/widgetjs", "lodash", "jquery", "prettify", "code", "bootstrap"], function(widgetjs, lodash, jQuery, prettify, code) {

    var examples = {};

    examples.modals = code({
        group: "Modals",
        label: "Modals",
        links: ["http://getbootstrap.com/javascript/#modals"],
        example : function(html) {
            // Modal
            html.div({"class": "clearfix bs-example-modal"},
                html.div({ klass: "modal"},
                    html.div({ klass: "modal-dialog"},
                        html.div({ klass: "modal-content"},
                            html.div({ klass: "modal-header"},
                                html.button({ type: "button",  klass: "close",  "data-dismiss": "modal",  "aria-hidden": "true"},
                                    "&times;"
                                ),
                                html.h4({ klass: "modal-title"},
                                    "Modal title"
                                )
                            ),
                            html.div({ klass: "modal-body"},
                                html.p(
                                    "One fine body&hellip;"
                                )
                            ),
                            html.div({ klass: "modal-footer"},
                                html.button({ type: "button",  klass: "btn btn-default",  "data-dismiss": "modal"},
                                    "Close"
                                ),
                                html.button({ type: "button",  klass: "btn btn-primary"},
                                    "Save changes"
                                )
                            )
                        )
                    )
                )
            );
        }
    });

    examples.modalsDemo = code({
        group: "Modals",
        label: "Live Demo",
        links: ["http://getbootstrap.com/javascript/#modals"],
        example : function(html) {
            // Modal
            html.div({ id: "myModal", klass: "modal fade"},
                html.div({ klass: "modal-dialog"},
                    html.div({ klass: "modal-content"},
                        html.div({ klass: "modal-header"},
                            html.button({ type: "button",  klass: "close",  "data-dismiss": "modal",  "aria-hidden": "true"},
                                "&times;"
                            ),
                            html.h4({ klass: "modal-title"},
                                "Modal title"
                            )
                        ),
                        html.div({ klass: "modal-body"},
                            html.p(
                                "One fine body&hellip;"
                            )
                        ),
                        html.div({ klass: "modal-footer"},
                            html.button({ type: "button",  klass: "btn btn-default",  "data-dismiss": "modal"},
                                "Close"
                            ),
                            html.button({ type: "button",  klass: "btn btn-primary"},
                                "Save changes"
                            )
                        )
                    )
                )
            );

            html.button({ klass: "btn btn-primary btn-lg",  "data-toggle": "modal",  "data-target": "#myModal"}, "Show modal");

        }
    });

    examples.toolTips = code({
        group: "Tooltips",
        label: "Live Demo",
        links: ["http://getbootstrap.com/javascript/#tooltips"],
        example : function(html) {
            // TOOLTIPS
            html.div({ klass: "tooltip-demo"},
                html.div({ klass: "bs-example-tooltips"},
                    html.button({ type: "button",  klass: "btn btn-default",  "data-toggle": "tooltip",  "data-placement": "left",  title: "",  "data-original-title": "Tooltip on left"},
                        "Tooltip on left"
                    ),
                    html.button({ type: "button",  klass: "btn btn-default",  "data-toggle": "tooltip",  "data-placement": "top",  title: "",  "data-original-title": "Tooltip on top"},
                        "Tooltip on top"
                    ),
                    html.button({ type: "button",  klass: "btn btn-default",  "data-toggle": "tooltip",  "data-placement": "bottom",  title: "",  "data-original-title": "Tooltip on bottom"},
                        "Tooltip on bottom"
                    ),
                    html.button({ type: "button",  klass: "btn btn-default",  "data-toggle": "tooltip",  "data-placement": "right",  title: "",  "data-original-title": "Tooltip on right"},
                        "Tooltip on right"
                    )
                )
            );

            jQuery(".bs-example-tooltips").tooltip();
        }
    });

    examples.popovers = code({
        group: "Popovers",
        label: "Popovers",
        links: ["http://getbootstrap.com/javascript/#popovers"],
        example : function(html) {
            // Popovers
            html.div({ klass: "bs-example-popovers"},
                html.button({ type: "button",  klass: "btn btn-default",  "data-container": "body",  "data-toggle": "popover",  "data-placement": "left",  "data-content": "Vivamus sagittis lacus vel augue laoreet rutrum faucibus.",  "data-original-title": "",  title: ""},
                    "Left"
                ),
                html.button({ type: "button",  klass: "btn btn-default",  "data-container": "body",  "data-toggle": "popover",  "data-placement": "top",  "data-content": "Vivamus sagittis lacus vel augue laoreet rutrum faucibus.",  "data-original-title": "",  title: ""},
                    "Top"
                ),
                html.button({ type: "button",  klass: "btn btn-default",  "data-container": "body",  "data-toggle": "popover",  "data-placement": "bottom",  "data-content": "Vivamus sagittis lacus vel augue laoreet rutrum faucibus.",  "data-original-title": "",  title: ""},
                    "Bottom"
                ),
                html.button({ type: "button",  klass: "btn btn-default",  "data-container": "body",  "data-toggle": "popover",  "data-placement": "right",  "data-content": "Vivamus sagittis lacus vel augue laoreet rutrum faucibus.",  "data-original-title": "",  title: ""},
                    "Right"
                )
            );

            jQuery(".bs-example-popovers button").popover();
        }
    });

    examples.buttonsCheckbox = code({
        group: "Buttons",
        label: "Checkbox",
        links: ["http://getbootstrap.com/javascript/#buttons"],
        example : function(html) {
            html.div({  style: "padding-bottom: 24px;"},
                html.div({ klass: "btn-group",  "data-toggle": "buttons"},
                    html.label({ klass: "btn btn-primary"},
                        html.input({ type: "checkbox"}),
                        "Option 1"
                    ),
                    html.label({ klass: "btn btn-primary"},
                        html.input({ type: "checkbox"}),
                        "Option 2"
                    ),
                    html.label({ klass: "btn btn-primary"},
                        html.input({ type: "checkbox"}),
                        "Option 3"
                    )
                )
            );
        }
    });

    examples.buttonsRadio= code({
        group: "Buttons",
        label: "Radio",
        links: ["http://getbootstrap.com/javascript/#buttons"],
        example : function(html) {
            html.div({ style: "padding-bottom: 24px;"},
                html.div({ klass: "btn-group",  "data-toggle": "buttons"},
                    html.label({ klass: "btn btn-primary"},
                        html.input({ type: "radio"}),
                        "Option 1"
                    ),
                    html.label({ klass: "btn btn-primary"},
                        html.input({ type: "radio"}),
                        "Option 2"
                    ),
                    html.label({ klass: "btn btn-primary"},
                        html.input({ type: "radio"}),
                        "Option 3"
                    )
                )
            );
        }
    });

    examples.collapse = code({
        group: "Collapse",
        label: "Collapse",
        links: ["http://getbootstrap.com/javascript/#collapse"],
        example : function(html) {
            html.div({ klass: "panel-group",  id: "accordion"},
                html.div({ klass: "panel panel-default"},
                    html.div({ klass: "panel-heading"},
                        html.h4({ klass: "panel-title"},
                            html.a({ "data-toggle": "collapse",  "data-parent": "#accordion",  href: "#collapseOne"},
                                "Heading #1"
                            )
                        )
                    ),
                    html.div({ id: "collapseOne",  klass: "panel-collapse collapse in"},
                        html.div({ klass: "panel-body"},
                            "Content"
                        )
                    )
                ),
                html.div({ klass: "panel panel-default"},
                    html.div({ klass: "panel-heading"},
                        html.h4({ klass: "panel-title"},
                            html.a({ "data-toggle": "collapse",  "data-parent": "#accordion",  href: "#collapseTwo"},
                                "Heading #2"
                            )
                        )
                    ),
                    html.div({ id: "collapseTwo",  klass: "panel-collapse collapse"},
                        html.div({ klass: "panel-body"},
                            "Content"
                        )
                    )
                ),
                html.div({ klass: "panel panel-default"},
                    html.div({ klass: "panel-heading"},
                        html.h4({ klass: "panel-title"},
                            html.a({ "data-toggle": "collapse",  "data-parent": "#accordion",  href: "#collapseThree"},
                                "Heading #2"
                            )
                        )
                    ),
                    html.div({ id: "collapseThree",  klass: "panel-collapse collapse"},
                        html.div({ klass: "panel-body"},
                            "Content"
                        )
                    )
                )
            );
        }
    });

    return examples;

});