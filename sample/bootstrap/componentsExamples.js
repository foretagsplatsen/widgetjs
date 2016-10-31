define(["widgetjs/widgetjs", "lodash", "jquery", "prettify", "code"], function(widgetjs, lodash, jQuery, prettify, code) {

    var examples = {};

    examples.glyphicons = code({
        group: "Glyphicons",
        label: "Glyphicons",
        links: ["http://getbootstrap.com/components/#glyphicons",
            "http://getbootstrap.com/components/#glyphicons-examples"],
        example : function(html) {
            html.button({ type: "button",  klass: "btn btn-default btn-lg"},
                html.span({ klass: "glyphicon glyphicon-star"}
                )
            );
        }
    });

    examples.dropdowns = code({
        group: "Dropdowns",
        label: "Dropdowns",
        links: ["http://getbootstrap.com/components/#dropdowns",
            "http://getbootstrap.com/components/#dropdowns-example"],
        example : function(html) {
            html.div({ klass: "dropdown clearfix"},
                html.button({ klass: "btn dropdown-toggle sr-only",  type: "button",  id: "dropdownMenu1",  "data-toggle": "dropdown"},
                    html.span({ klass: "caret"})
                ),
                html.ul({ klass: "dropdown-menu",  role: "menu",  "aria-labelledby": "dropdownMenu1"},
                    html.li({ role: "presentation"},
                        html.a({ role: "menuitem",  tabindex: "-1",  href: "#"},"Action")
                    ),
                    html.li({ role: "presentation"},
                        html.a({ role: "menuitem",  tabindex: "-1",  href: "#"},"Another action")
                    ),
                    html.li({ role: "presentation"},
                        html.a({ role: "menuitem",  tabindex: "-1",  href: "#"}, "Something else here")
                    ),
                    html.li({ role: "presentation",  klass: "divider"}
                    ),
                    html.li({ role: "presentation"},
                        html.a({ role: "menuitem",  tabindex: "-1",  href: "#"},"Separated link")
                    )
                )
            );
        }
    });

    examples.dropdownHeaders = code({
        group: "Dropdowns",
        label: "Dropdown Headers",
        links: ["http://getbootstrap.com/components/#dropdowns",
            "http://getbootstrap.com/components/#dropdowns-headers"],
        example : function(html) {
            html.div({ klass: "dropdown clearfix"},
                html.button({ klass: "btn dropdown-toggle sr-only",  type: "button",  id: "dropdownMenu2",  "data-toggle": "dropdown"},
                    html.span({ klass: "caret"}
                    )
                ),
                html.ul({ klass: "dropdown-menu",  role: "menu",  "aria-labelledby": "dropdownMenu2"},
                    html.li({ role: "presentation",  klass: "dropdown-header"},
                        "Dropdown header"
                    ),
                    html.li({ role: "presentation"},
                        html.a({ role: "menuitem",  tabindex: "-1",  href: "#"},
                            "Action"
                        )
                    ),
                    html.li({ role: "presentation"},
                        html.a({ role: "menuitem",  tabindex: "-1",  href: "#"},
                            "Another action"
                        )
                    ),
                    html.li({ role: "presentation"},
                        html.a({ role: "menuitem",  tabindex: "-1",  href: "#"},
                            "Something else here"
                        )
                    ),
                    html.li({ role: "presentation",  klass: "divider"}
                    ),
                    html.li({ role: "presentation",  klass: "dropdown-header"},
                        "Dropdown header"
                    ),
                    html.li({ role: "presentation"},
                        html.a({ role: "menuitem",  tabindex: "-1",  href: "#"},
                            "Separated link"
                        )
                    )
                )
            );
        }
    });

    examples.buttonGroups = code({
        group: "Button groups",
        label: "Button groups",
        links: ["http://getbootstrap.com/components/#btn-groups"],
        example : function(html) {

            html.div(
                html.div({ klass: "btn-toolbar",  role: "toolbar"},
                    html.div({ klass: "btn-group btn-group-lg"},
                        html.button({ type: "button",  klass: "btn btn-default"}, "Left"),
                        html.button({ type: "button",  klass: "btn btn-default"}, "Middle"),
                        html.button({ type: "button",  klass: "btn btn-default"}, "Right")
                    )
                ),
                html.div({ klass: "btn-toolbar",  role: "toolbar"},
                    html.div({ klass: "btn-group"},
                        html.button({ type: "button",  klass: "btn btn-default"}, "Left"),
                        html.button({ type: "button",  klass: "btn btn-default"}, "Middle"),
                        html.button({ type: "button",  klass: "btn btn-default"}, "Right")
                    )
                ),
                html.div({ klass: "btn-toolbar",  role: "toolbar"},
                    html.div({ klass: "btn-group btn-group-sm"},
                        html.button({ type: "button",  klass: "btn btn-default"}, "Left"),
                        html.button({ type: "button",  klass: "btn btn-default"}, "Middle"),
                        html.button({ type: "button",  klass: "btn btn-default"}, "Right")
                    )
                ),
                html.div({ klass: "btn-toolbar",  role: "toolbar"},
                    html.div({ klass: "btn-group btn-group-xs"},
                        html.button({ type: "button",  klass: "btn btn-default"}, "Left"),
                        html.button({ type: "button",  klass: "btn btn-default"}, "Middle"),
                        html.button({ type: "button",  klass: "btn btn-default"}, "Right")
                    )
                )
            );
        }
    });

    examples.buttonGroupsNesting = code({
        group: "Button groups",
        label: "Nesting",
        links: ["http://getbootstrap.com/components/#btn-groups"],
        example : function(html) {
            html.div({ klass: "btn-group"},
                html.button({ type: "button",  klass: "btn btn-default"}, "1"),
                html.button({ type: "button",  klass: "btn btn-default"}, "2"),
                html.div({ klass: "btn-group"},
                    html.button({ id: "btnGroupDrop1",  type: "button",  klass: "btn btn-default dropdown-toggle",  "data-toggle": "dropdown"},
                        "Drop Down",
                        html.span({ klass: "caret"})
                    ),
                    html.ul({ klass: "dropdown-menu",  role: "menu",  "aria-labelledby": "btnGroupDrop1"},
                        html.li(
                            html.a({ href: "#"}, "Dropdown link")
                        ),
                        html.li(
                            html.a({ href: "#"}, "Dropdown link")
                        )
                    )
                )
            );
        }
    });

    examples.buttonGroupsJustified = code({
        group: "Button groups",
        label: "Justified",
        links: ["http://getbootstrap.com/components/#btn-groups-justified"],
        example : function(html) {
            html.div({ klass: "btn-group btn-group-justified"},
                html.div({ klass: "btn-group"},
                    html.button({ type: "button",  klass: "btn btn-default"},
                        "Left"
                    )
                ),
                html.div({ klass: "btn-group"},
                    html.button({ type: "button",  klass: "btn btn-default"},
                        "Middle"
                    )
                ),
                html.div({ klass: "btn-group"},
                    html.button({ type: "button",  klass: "btn btn-default"},
                        "Right"
                    )
                )
            );
        }
    });


    examples.buttonDropdowns = code({
        group: "Button dropdowns",
        label: "Button dropdowns",
        links: ["http://getbootstrap.com/components/#btn-dropdowns"],
        example : function(html) {
            // Single button dropdowns
            html.div({ klass: "btn-group"},
                html.button({ type: "button",  klass: "btn btn-info dropdown-toggle",  "data-toggle": "dropdown"},
                    "Info ",
                    html.span({ klass: "caret"}
                    )
                ),
                html.ul({ klass: "dropdown-menu",  role: "menu"},
                    html.li(
                        html.a({ href: "#"},
                            "Action"
                        )
                    ),
                    html.li(
                        html.a({ href: "#"},
                            "Another action"
                        )
                    ),
                    html.li(
                        html.a({ href: "#"},
                            "Something else here"
                        )
                    ),
                    html.li({ klass: "divider"}
                    ),
                    html.li(
                        html.a({ href: "#"},
                            "Separated link"
                        )
                    )
                )
            );

            html.br();

            // Split button

            html.div({ klass: "btn-group"},
                html.button({ type: "button",  klass: "btn btn-primary"},
                    "Primary"
                ),
                html.button({ type: "button",  klass: "btn btn-primary dropdown-toggle",  "data-toggle": "dropdown"},
                    html.span({ klass: "caret"}
                    ),
                    html.span({ klass: "sr-only"},
                        "Toggle Dropdown"
                    )
                ),
                html.ul({ klass: "dropdown-menu",  role: "menu"},
                    html.li(
                        html.a({ href: "#"},
                            "Action"
                        )
                    ),
                    html.li(
                        html.a({ href: "#"},
                            "Another action"
                        )
                    ),
                    html.li(
                        html.a({ href: "#"},
                            "Something else here"
                        )
                    ),
                    html.li({ klass: "divider"}
                    ),
                    html.li(
                        html.a({ href: "#"},
                            "Separated link"
                        )
                    )
                )
            );

        }
    });

    examples.inputGroups = code({
        group: "Input groups",
        label: "Input groups",
        links: ["http://getbootstrap.com/components/#input-groups"],
        example : function(html) {

            // Left/Right/Both
            html.div({ klass: "input-group"},
                html.span({ klass: "input-group-addon"}, "@"),
                html.input({ type: "text",  klass: "form-control",  placeholder: "Username"})
            );
            html.div({ klass: "input-group"},
                html.input({ type: "text",  klass: "form-control"}),
                html.span({ klass: "input-group-addon"}, ".00")
            );
            html.div({ klass: "input-group"},
                html.span({ klass: "input-group-addon"},"$"),
                html.input({ type: "text",  klass: "form-control"}),
                html.span({ klass: "input-group-addon"}, ".00")
            );

            // Sizes
            html.div({ klass: "input-group input-group-lg"},
                html.span({ klass: "input-group-addon"}, "@"),
                html.input({ type: "text",  klass: "form-control",  placeholder: "Username"})
            );
            html.div({ klass: "input-group"},
                html.span({ klass: "input-group-addon"}, "@"),
                html.input({ type: "text",  klass: "form-control",  placeholder: "Username"})
            );
            html.div({ klass: "input-group input-group-sm"},
                html.span({ klass: "input-group-addon"}, "@"),
                html.input({ type: "text",  klass: "form-control",  placeholder: "Username"})
            );
        }
    });

    examples.inputGroupsCheckBoxes = code({
        group: "Input groups",
        label: "Checkboxes and radio addons",
        links: ["http://getbootstrap.com/components/#input-groups-checkboxes-radios"],
        example : function(html) {
            html.div({ klass: "row"},
                html.div({ klass: "col-lg-6"},
                    html.div({ klass: "input-group"},
                        html.span({ klass: "input-group-addon"},
                            html.input({ type: "checkbox"})
                        ),
                        html.input({ type: "text",  klass: "form-control"})
                    )
                ),
                html.div({ klass: "col-lg-6"},
                    html.div({ klass: "input-group"},
                        html.span({ klass: "input-group-addon"},
                            html.input({ type: "radio"})
                        ),
                        html.input({ type: "text",  klass: "form-control"})
                    )
                )
            );
        }
    });

    examples.inputGroupsButtons = code({
        group: "Input groups",
        label: "Button addons",
        links: ["http://getbootstrap.com/components/#input-groups-buttons"],
        example : function(html) {
            // Button add-on
            html.div({ klass: "row"},
                html.div({ klass: "col-lg-6"},
                    html.div({ klass: "input-group"},
                        html.span({ klass: "input-group-btn"}),
                        html.button({ klass: "btn btn-default",  type: "button"},"Go!"),
                        html.input({ type: "text",  klass: "form-control"})
                    )
                ),
                html.div({ klass: "col-lg-6"},
                    html.div({ klass: "input-group"},
                        html.input({ type: "text",  klass: "form-control"}),
                        html.span({ klass: "input-group-btn"}),
                        html.button({ klass: "btn btn-default",  type: "button"}, "Go!")
                    )
                )
            );

            // Drop-Down

            html.div({ klass: "row"},
                html.div({ klass: "col-lg-6"},
                    html.div({ klass: "input-group"},
                        html.div({ klass: "input-group-btn"},
                            html.button({ type: "button",  klass: "btn btn-default dropdown-toggle",  "data-toggle": "dropdown"},
                                "Action ",
                                html.span({ klass: "caret"})
                            ),
                            html.ul({ klass: "dropdown-menu"},
                                html.li(html.a({ href: "#"}, "Action")),
                                html.li(html.a({ href: "#"}, "Another action")),
                                html.li(html.a({ href: "#"}, "Something else here")),
                                html.li({ klass: "divider"}),
                                html.li(html.a({ href: "#"},"Separated link")
                                )
                            )
                        ),
                        html.input({ type: "text",  klass: "form-control"})
                    )
                ),
                html.div({ klass: "col-lg-6"},
                    html.div({ klass: "input-group"},
                        html.input({ type: "text",  klass: "form-control"}),
                        html.div({ klass: "input-group-btn"},
                            html.button({ type: "button",  klass: "btn btn-default dropdown-toggle",  "data-toggle": "dropdown"},
                                "Action ",
                                html.span({ klass: "caret"})
                            ),
                            html.ul({ klass: "dropdown-menu pull-right"},
                                html.li(html.a({ href: "#"}, "Action")),
                                html.li(html.a({ href: "#"},"Another action")),
                                html.li(html.a({ href: "#"},"Something else here")),
                                html.li({ klass: "divider"}),
                                html.li(html.a({ href: "#"},"Separated link"))
                            )
                        )
                    )
                )
            );
        }
    });

    examples.navs = code({
        group: "Navs",
        label: "Navs",
        links: ["http://getbootstrap.com/components/#nav"],
        example : function(html) {
            // Tabs
            html.ul({ klass: "nav nav-tabs"},
                html.li({ klass: "active"},
                    html.a({ href: "#"}, "Home")
                ),
                html.li(html.a({ href: "#"},"Profile")),
                html.li(html.a({ href: "#"},"Messages"))
            );

            html.br();

            // Pills
            html.ul({ klass: "nav nav-pills"},
                html.li({ klass: "active"},
                    html.a({ href: "#"}, "Home")
                ),
                html.li(html.a({ href: "#"},"Profile")),
                html.li(html.a({ href: "#"},"Messages"))
            );

            html.br();

            // Pills stacked
            html.ul({ klass: "nav nav-pills nav-stacked"},
                html.li({ klass: "active"},
                    html.a({ href: "#"}, "Home")
                ),
                html.li(html.a({ href: "#"},"Profile")),
                html.li(html.a({ href: "#"},"Messages"))
            );

            html.br();

            // Justified
            html.ul({ klass: "nav nav-pills nav-justified"},
                html.li({ klass: "active"},
                    html.a({ href: "#"}, "Home")
                ),
                html.li(html.a({ href: "#"},"Profile")),
                html.li(html.a({ href: "#"},"Messages"))
            );
        }
    });

    examples.navsDropDown = code({
        group: "Navs",
        label: "Navs with dropdowns",
        links: ["http://getbootstrap.com/components/#nav-dropdowns"],
        example : function(html) {

            html.ul({ klass: "nav nav-pills"},
                html.li({ klass: "active"},
                    html.a({ href: "#"}, "Home")
                ),
                html.li(
                    html.a({ href: "#"}, "Help")
                ),
                html.li({ klass: "dropdown"},
                    html.a({ klass: "dropdown-toggle",  "data-toggle": "dropdown",  href: "#"},
                        "Dropdown",
                        html.span({ klass: "caret"})
                    ),
                    html.ul({ klass: "dropdown-menu",  role: "menu"},
                        html.li(
                            html.a({ href: "#"}, "Action")
                        ),
                        html.li(
                            html.a({ href: "#"}, "Another action")
                        ),
                        html.li(
                            html.a({ href: "#"}, "Something else here")
                        ),
                        html.li({ klass: "divider"}
                        ),
                        html.li( html.a({ href: "#"},"Separated link")
                        )
                    )
                )
            );
        }
    });


    examples.navbar = code({
        group: "Navbar",
        label: "navbar",
        links: ["http://getbootstrap.com/components/#navbar"],
        example : function(html) {

            html.nav({ klass: "navbar navbar-default",  role: "navigation"},
                html.div({ klass: "container-fluid"},
                    html.div({ klass: "navbar-header"},
                        html.button({ type: "button",  klass: "navbar-toggle",  "data-toggle": "collapse",  "data-target": "#bs-example-navbar-collapse-1"},
                            html.span({ klass: "sr-only"},
                                "Toggle navigation"
                            ),
                            html.span({ klass: "icon-bar"}
                            ),
                            html.span({ klass: "icon-bar"}
                            ),
                            html.span({ klass: "icon-bar"}
                            )
                        ),
                        html.a({ klass: "navbar-brand",  href: "#"},
                            "Brand"
                        )
                    ),
                    html.div({ klass: "collapse navbar-collapse",  id: "bs-example-navbar-collapse-1"},
                        html.ul({ klass: "nav navbar-nav"},
                            html.li({ klass: "active"},
                                html.a({ href: "#"},
                                    "Link"
                                )
                            ),
                            html.li(
                                html.a({ href: "#"},
                                    "Link"
                                )
                            ),
                            html.li({ klass: "dropdown"},
                                html.a({ href: "#",  klass: "dropdown-toggle",  "data-toggle": "dropdown"},
                                    "Dropdown ",
                                    html.b({ klass: "caret"}
                                    )
                                ),
                                html.ul({ klass: "dropdown-menu"},
                                    html.li(
                                        html.a({ href: "#"},
                                            "Action"
                                        )
                                    ),
                                    html.li(
                                        html.a({ href: "#"},
                                            "Another action"
                                        )
                                    ),
                                    html.li(
                                        html.a({ href: "#"},
                                            "Something else here"
                                        )
                                    ),
                                    html.li({ klass: "divider"}
                                    ),
                                    html.li(
                                        html.a({ href: "#"},
                                            "Separated link"
                                        )
                                    ),
                                    html.li({ klass: "divider"}
                                    ),
                                    html.li(
                                        html.a({ href: "#"},
                                            "One more separated link"
                                        )
                                    )
                                )
                            )
                        ),
                        html.form({ klass: "navbar-form navbar-left",  role: "search"},
                            html.div({ klass: "form-group"},
                                html.input({ type: "text",  klass: "form-control",  placeholder: "Search"})
                            ),
                            html.button({ type: "submit",  klass: "btn btn-default"},
                                "Submit"
                            )
                        ),
                        html.ul({ klass: "nav navbar-nav navbar-right"},
                            html.li(
                                html.a({ href: "#"},
                                    "Link"
                                )
                            ),
                            html.li({ klass: "dropdown"},
                                html.a({ href: "#",  klass: "dropdown-toggle",  "data-toggle": "dropdown"},
                                    "Dropdown ",
                                    html.b({ klass: "caret"}
                                    )
                                ),
                                html.ul({ klass: "dropdown-menu"},
                                    html.li(
                                        html.a({ href: "#"},
                                            "Action"
                                        )
                                    ),
                                    html.li(
                                        html.a({ href: "#"},
                                            "Another action"
                                        )
                                    ),
                                    html.li(
                                        html.a({ href: "#"},
                                            "Something else here"
                                        )
                                    ),
                                    html.li({ klass: "divider"}
                                    ),
                                    html.li(
                                        html.a({ href: "#"},
                                            "Separated link"
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            );
        }
    });

    examples.breadcrumb = code({
        group: "Breadcrumbs",
        label: "Breadcrumbs",
        links: ["http://getbootstrap.com/components/#breadcrumbs"],
        example : function(html) {
            html.div({ klass: "bs-example"},
                html.ol({ klass: "breadcrumb"},
                    html.li({ klass: "active"},
                        "Home"
                    )
                ),
                html.ol({ klass: "breadcrumb"},
                    html.li(
                        html.a({ href: "#"},
                            "Home"
                        )
                    ),
                    html.li({ klass: "active"},
                        "Library"
                    )
                ),
                html.ol({ klass: "breadcrumb",  style: "margin-bottom: 5px;"},
                    html.li(
                        html.a({ href: "#"},
                            "Home"
                        )
                    ),
                    html.li(
                        html.a({ href: "#"},
                            "Library"
                        )
                    ),
                    html.li({ klass: "active"},
                        "Data"
                    )
                )
            );
        }
    });

    examples.pagination = code({
        group: "Pagination",
        label: "Pagination",
        links: ["http://getbootstrap.com/components/#pagination"],
        example : function(html) {

            // Default pagination
            html.ul({ klass: "pagination"},
                html.li(
                    html.a({ href: "#"}, "&laquo;")
                ),
                html.li({ klass: "active"},
                    html.a({ href: "#"}, "1 ", html.span({ klass: "sr-only"}, "(current)"))
                ),
                html.li(
                    html.a({ href: "#"}, "2")
                ),
                html.li(
                    html.a({ href: "#"}, "3")
                ),
                html.li(
                    html.a({ href: "#"}, "4")
                ),
                html.li(
                    html.a({ href: "#"}, "5")
                ),
                html.li(
                    html.a({ href: "#"}, "&raquo;")
                )
            );

            // Pager
            html.ul({ klass: "pager"},
                html.li(
                    html.a({ href: "#"},
                        "Previous"
                    )
                ),
                html.li(
                    html.a({ href: "#"},
                        "Next"
                    )
                )
            );

            // Align links

            html.ul({ klass: "pager"},
                html.li({ klass: "previous disabled"},
                    html.a({ href: "#"},
                        "&larr; Older"
                    )
                ),
                html.li({ klass: "next"},
                    html.a({ href: "#"},
                        "Newer &rarr;"
                    )
                )
            );


        }
    });

    examples.labels = code({
        group: "Labels",
        label: "Labels",
        links: ["http://getbootstrap.com/components/#labels"],
        example : function(html) {
            // Variations
            html.span({ klass: "label label-default"},
                "Default"
            );
            html.span({ klass: "label label-primary"},
                "Primary"
            );
            html.span({ klass: "label label-success"},
                "Success"
            );
            html.span({ klass: "label label-info"},
                "Info"
            );
            html.span({ klass: "label label-warning"},
                "Warning"
            );
            html.span({ klass: "label label-danger"},
                "Danger"
            );

            html.br();

            // With headings
            html.div(
                html.h1(
                    "Example heading ",
                    html.span({ klass: "label label-default"},
                        "New"
                    )
                ),
                html.h2(
                    "Example heading ",
                    html.span({ klass: "label label-default"},
                        "New"
                    )
                ),
                html.h3(
                    "Example heading ",
                    html.span({ klass: "label label-default"},
                        "New"
                    )
                ),
                html.h4(
                    "Example heading ",
                    html.span({ klass: "label label-default"},
                        "New"
                    )
                ),
                html.h5(
                    "Example heading ",
                    html.span({ klass: "label label-default"},
                        "New"
                    )
                ),
                html.h6(
                    "Example heading ",
                    html.span({ klass: "label label-default"},
                        "New"
                    )
                )
            );


        }
    });

    examples.badges = code({
        group: "Badges",
        label: "Badges",
        links: ["http://getbootstrap.com/components/#badges"],
        example : function(html) {
            // Simple
            html.a({ href: "#"},
                "Inbox ",
                html.span({ klass: "badge"}, "42")
            );

            // Adapts to nav state
            html.div(
                html.ul({ klass: "nav nav-pills"},
                    html.li({ klass: "active"},
                        html.a({ href: "#"},
                            "Home ",
                            html.span({ klass: "badge"},
                                "42"
                            )
                        )
                    ),
                    html.li(
                        html.a({ href: "#"},
                            "Profile"
                        )
                    ),
                    html.li(
                        html.a({ href: "#"},
                            "Messages ",
                            html.span({ klass: "badge"},
                                "3"
                            )
                        )
                    )
                ),
                html.br(),
                html.ul({ klass: "nav nav-pills nav-stacked",  style: "max-width: 260px;"},
                    html.li({ klass: "active"},
                        html.a({ href: "#"},
                            html.span({ klass: "badge pull-right"},
                                "42"
                            )
                        )
                    ),
                    html.li(
                        html.a({ href: "#"},
                            "Profile"
                        )
                    ),
                    html.li(
                        html.a({ href: "#"},
                            html.span({ klass: "badge pull-right"},
                                "3"
                            )
                        )
                    )
                ),
                html.br(),
                html.button({ klass: "btn btn-primary",  type: "button"},
                    html.span({ klass: "badge"},
                        "4"
                    )
                )
            );

        }
    });

    examples.alerts = code({
        group: "Alerts",
        label: "Alerts",
        links: ["http://getbootstrap.com/components/#alerts"],
        example : function(html) {
            html.div({ klass: "bs-example"},
                html.div({ klass: "alert alert-success"},
                    html.strong(
                        "Well done!"
                    )
                ),
                html.div({ klass: "alert alert-info"},
                    html.strong(
                        "Heads up!"
                    )
                ),
                html.div({ klass: "alert alert-warning"},
                    html.strong(
                        "Warning!"
                    )
                ),
                html.div({ klass: "alert alert-danger"},
                    html.strong(
                        "Oh snap!"
                    )
                )
            );
        }
    });

    examples.alertsDismissable = code({
        group: "Alerts",
        label: "Dismissable alerts",
        links: ["http://getbootstrap.com/components/#alerts-dismissable"],
        example : function(html) {
            html.div({ klass: "alert alert-warning alert-dismissable"},
                html.button({ type: "button",  klass: "close",  "data-dismiss": "alert",  "aria-hidden": "true"},
                    "&times;"
                ),
                html.strong(
                    "Warning!"
                )
            );
        }
    });

    examples.alertsLinks = code({
        group: "Alerts",
        label: "Links in alerts",
        links: ["http://getbootstrap.com/components/#alerts-dismissable"],
        example : function(html) {
            html.div({ klass: "bs-example"},
                html.div({ klass: "alert alert-success"},
                    html.strong(
                        "Well done!"
                    ),
                    " You successfully read ",
                    html.a({ href: "#",  klass: "alert-link"},
                        "this important alert message"
                    )
                ),
                html.div({ klass: "alert alert-info"},
                    html.strong(
                        "Heads up!"
                    ),
                    " This ",
                    html.a({ href: "#",  klass: "alert-link"},
                        "alert needs your attention"
                    )
                ),
                html.div({ klass: "alert alert-warning"},
                    html.strong(
                        "Warning!"
                    ),
                    " Better check yourself, youre ",
                    html.a({ href: "#",  klass: "alert-link"},
                        "not looking too good"
                    )
                ),
                html.div({ klass: "alert alert-danger"},
                    html.strong(
                        "Oh snap!"
                    ),
                    " ",
                    html.a({ href: "#",  klass: "alert-link"},
                        "Change a few things up"
                    )
                )
            );
        }
    });

    examples.progress = code({
        group: "Progress bars",
        label: "Progress bars",
        links: ["http://getbootstrap.com/components/#progress"],
        example : function(html) {

            html.div({ klass: "bs-example"},
                html.div({ klass: "progress"},
                    html.div({ klass: "progress-bar progress-bar-success",  role: "progressbar", "aria-valuenow": "40",  "aria-valuemin": "0",  "aria-valuemax": "100",  style: "width: 40%"},
                        html.span({ klass: "sr-only"},
                            "40% Complete (success)"
                        )
                    )
                ),
                html.div({ klass: "progress"},
                    html.div({ klass: "progress-bar progress-bar-info",  role: "progressbar",  "aria-valuenow": "20",  "aria-valuemin": "0",  "aria-valuemax": "100",  style: "width: 20%"},
                        html.span({ klass: "sr-only"},
                            "20% Complete"
                        )
                    )
                ),
                html.div({ klass: "progress"},
                    html.div({ klass: "progress-bar progress-bar-warning",  role: "progressbar",  "aria-valuenow": "60",  "aria-valuemin": "0",  "aria-valuemax": "100",  style: "width: 60%"},
                        html.span({ klass: "sr-only"},
                            "60% Complete (warning)"
                        )
                    )
                ),
                html.div({ klass: "progress"},
                    html.div({ klass: "progress-bar progress-bar-danger",  role: "progressbar",  "aria-valuenow": "80",  "aria-valuemin": "0",  "aria-valuemax": "100",  style: "width: 80%"},
                        html.span({ klass: "sr-only"},
                            "80% Complete (danger)"
                        )
                    )
                )
            );
        }
    });

    examples.progressStacked = code({
        group: "Progress bars",
        label: "Stacked Progress bars",
        links: ["http://getbootstrap.com/components/#progress-stacked"],
        example : function(html) {
            html.div(
                html.div({ klass: "progress"},
                    html.div({ klass: "progress-bar progress-bar-success",  style: "width: 35%"},
                        html.span({ klass: "sr-only"},
                            "35% Complete (success)"
                        )
                    ),
                    html.div({ klass: "progress-bar progress-bar-warning",  style: "width: 20%"},
                        html.span({ klass: "sr-only"},
                            "20% Complete (warning)"
                        )
                    ),
                    html.div({ klass: "progress-bar progress-bar-danger",  style: "width: 10%"},
                        html.span({ klass: "sr-only"},
                            "10% Complete (danger)"
                        )
                    )
                )
            );
        }
    });

    examples.listGroup = code({
        group: "List group",
        label: "List group",
        links: ["http://getbootstrap.com/components/#list-group"],
        example : function(html) {
            // With badges

            html.ul({ klass: "list-group"},
                html.li({ klass: "list-group-item"},
                    html.span({ klass: "badge"}, "14"), "Item #1"
                ),
                html.li({ klass: "list-group-item"},
                    html.span({ klass: "badge"}, "2"), "Item #2"
                ),
                html.li({ klass: "list-group-item"},
                    html.span({ klass: "badge"}, "1") , "Item #3"
                )
            );

            html.br();

            // With links
            html.div({ klass: "list-group"},
                html.a({ href: "#",  klass: "list-group-item active"},
                    "Cras justo odio"
                ),
                html.a({ href: "#",  klass: "list-group-item"},
                    "Dapibus ac facilisis in"
                ),
                html.a({ href: "#",  klass: "list-group-item"},
                    "Morbi leo risus"
                ),
                html.a({ href: "#",  klass: "list-group-item"},
                    "Porta ac consectetur ac"
                ),
                html.a({ href: "#",  klass: "list-group-item"},
                    "Vestibulum at eros"
                )
            );

            // Contextual

            html.ul({ klass: "list-group"},
                html.li({ klass: "list-group-item list-group-item-success"},
                    "Dapibus ac facilisis in"
                ),
                html.li({ klass: "list-group-item list-group-item-info"},
                    "Cras sit amet nibh libero"
                ),
                html.li({ klass: "list-group-item list-group-item-warning"},
                    "Porta ac consectetur ac"
                ),
                html.li({ klass: "list-group-item list-group-item-danger"},
                    "Vestibulum at eros"
                )
            );

            // Custom content

            html.div({ klass: "list-group"},
                html.a({ href: "#",  klass: "list-group-item active"},
                    html.h4({ klass: "list-group-item-heading"},
                        "List group item heading"
                    ),
                    html.p({ klass: "list-group-item-text"},
                        "Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit."
                    )
                ),
                html.a({ href: "#",  klass: "list-group-item"},
                    html.h4({ klass: "list-group-item-heading"},
                        "List group item heading"
                    ),
                    html.p({ klass: "list-group-item-text"},
                        "Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit."
                    )
                ),
                html.a({ href: "#",  klass: "list-group-item"},
                    html.h4({ klass: "list-group-item-heading"},
                        "List group item heading"
                    ),
                    html.p({ klass: "list-group-item-text"},
                        "Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit."
                    )
                )
            );

        }
    });

    examples.panels = code({
        group: "Panels",
        label: "Panels",
        links: ["http://getbootstrap.com/components/#panels"],
        example : function(html) {
            // Default
            html.div({ klass: "panel panel-default"},
                html.div({ klass: "panel-body"},  "Basic panel example")
            );

            // with heading
            html.div({ klass: "panel panel-default"},
                html.div({ klass: "panel-heading"},
                    "Panel heading without title"
                ),
                html.div({ klass: "panel-body"},
                    "Panel content"
                )
            );

            // with footer

            html.div({ klass: "panel panel-default"},
                html.div({ klass: "panel-body"},
                    "Panel content"
                ),
                html.div({ klass: "panel-footer"},
                    "Panel footer"
                )
            );

            // contextual
            html.div({ klass: "panel panel-primary"},
                html.div({ klass: "panel-heading"},
                    html.h3({ klass: "panel-title"},
                        "Panel title"
                    )
                ),
                html.div({ klass: "panel-body"},
                    "Panel content"
                )
            );
        }
    });

    examples.panelsWithTables = code({
        group: "Panels",
        label: "Panels with tables",
        links: ["http://getbootstrap.com/components/#panels-tables"],
        example : function(html) {
            // with content

            html.div({ klass: "panel panel-default"},
                html.div({ klass: "panel-heading"},
                    "Panel heading"
                ),
                html.div({ klass: "panel-body"},
                    html.p(
                        "Some default panel content here. Nulla vitae elit libero, a pharetra augue. Aenean lacinia bibendum nulla sed consectetur. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Nullam id dolor id nibh ultricies vehicula ut id elit."
                    )
                ),
                html.table({ klass: "table"},
                    html.thead(
                        html.tr(
                            html.th(
                                "#"
                            ),
                            html.th(
                                "First Name"
                            ),
                            html.th(
                                "Last Name"
                            ),
                            html.th(
                                "Username"
                            )
                        )
                    ),
                    html.tbody(
                        html.tr(
                            html.td(
                                "1"
                            ),
                            html.td(
                                "Mark"
                            ),
                            html.td(
                                "Otto"
                            ),
                            html.td(
                                "@mdo"
                            )
                        ),
                        html.tr(
                            html.td(
                                "2"
                            ),
                            html.td(
                                "Jacob"
                            ),
                            html.td(
                                "Thornton"
                            ),
                            html.td(
                                "@fat"
                            )
                        ),
                        html.tr(
                            html.td(
                                "3"
                            ),
                            html.td(
                                "Larry"
                            ),
                            html.td(
                                "the Bird"
                            ),
                            html.td(
                                "@twitter"
                            )
                        )
                    )
                )
            );

            // with only table

            html.div({ klass: "panel panel-default"},
                html.div({ klass: "panel-heading"},
                    "Panel heading"
                ),
                html.table({ klass: "table"},
                    html.thead(
                        html.tr(
                            html.th(
                                "#"
                            ),
                            html.th(
                                "First Name"
                            ),
                            html.th(
                                "Last Name"
                            ),
                            html.th(
                                "Username"
                            )
                        )
                    ),
                    html.tbody(
                        html.tr(
                            html.td(
                                "1"
                            ),
                            html.td(
                                "Mark"
                            ),
                            html.td(
                                "Otto"
                            ),
                            html.td(
                                "@mdo"
                            )
                        ),
                        html.tr(
                            html.td(
                                "2"
                            ),
                            html.td(
                                "Jacob"
                            ),
                            html.td(
                                "Thornton"
                            ),
                            html.td(
                                "@fat"
                            )
                        ),
                        html.tr(
                            html.td(
                                "3"
                            ),
                            html.td(
                                "Larry"
                            ),
                            html.td(
                                "the Bird"
                            ),
                            html.td(
                                "@twitter"
                            )
                        )
                    )
                )
            );
        }
    });

    return examples;
});