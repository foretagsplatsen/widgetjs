define(["widgetjs/widgetjs", "lodash", "jquery", "prettify", "code"], function(widgetjs, lodash, jQuery, prettify, code) {

    var examples = {};

    examples.form = code({
        group: "Forms",
        label: "Form",
        links: ["http://getbootstrap.com/css/#forms-example"],
        example : function(html) {
            html.form({ role: "form"},
                html.div({ klass: "form-group"},
                    html.label({ for: "exampleInputEmail1"}, "Email address"),
                    html.input({ type: "email",  klass: "form-control",  id: "exampleInputEmail1",  placeholder: "Enter email"})
                ),
                html.div({ klass: "form-group"},
                    html.label({ for: "exampleInputPassword1"}, "Password"),
                    html.input({ type: "password",  klass: "form-control",  id: "exampleInputPassword1",  placeholder: "Password"})
                ),
                html.div({ klass: "form-group"},
                    html.label({ for: "exampleInputFile"}, "File input"),
                    html.input({ type: "file",  id: "exampleInputFile"}),
                    html.p({ klass: "help-block"}, "Example block-level help text here.")
                ),
                html.div({ klass: "checkbox"},
                    html.label(html.input({ type: "checkbox"}))
                ),
                html.button({ type: "submit",  klass: "btn btn-default"}, "Submit")
            );
        }
    });

    examples.inlineForm = code({
        group: "Forms",
        label: "Inline",
        links: ["http://getbootstrap.com/css/#forms-inline"],
        example : function(html) {
            html.form({ klass: "form-inline",  role: "form"},
                html.div({ klass: "form-group"},
                    html.label({ klass: "sr-only",  for: "exampleInputEmail2"}, "Email address" ),
                    html.input({ type: "email",  klass: "form-control",  id: "exampleInputEmail2",  placeholder: "Enter email"})
                ),
                html.div({ klass: "form-group"},
                    html.label({ klass: "sr-only",  for: "exampleInputPassword2"}, "Password"),
                    html.input({ type: "password",  klass: "form-control",  id: "exampleInputPassword2",  placeholder: "Password"})
                ),
                html.div({ klass: "checkbox"},
                    html.label(
                        html.input({ type: "checkbox"}), "Remember me")
                ),
                html.button({ type: "submit",  klass: "btn btn-default"}, "Sign in")
            );
        }
    });

    examples.horizontalForm = code({
        group: "Forms",
        label: "Horizontal",
        links: ["http://getbootstrap.com/css/#forms-horizontal"],
        example : function(html) {
            html.form({ klass: "form-horizontal",  role: "form"},
                html.div({ klass: "form-group"},
                    html.label({ for: "inputEmail3",  klass: "col-sm-2 control-label"}, "Email"),
                    html.div({ klass: "col-sm-10"},
                        html.input({ type: "email",  klass: "form-control",  id: "inputEmail3",  placeholder: "Email"})
                    )
                ),
                html.div({ klass: "form-group"},
                    html.label({ for: "inputPassword3",  klass: "col-sm-2 control-label"}, "Password"),
                    html.div({ klass: "col-sm-10"},
                        html.input({ type: "password",  klass: "form-control",  id: "inputPassword3",  placeholder: "Password"})
                    )
                ),
                html.div({ klass: "form-group"},
                    html.div({ klass: "col-sm-offset-2 col-sm-10"},
                        html.div({ klass: "checkbox"},
                            html.label(
                                html.input({ type: "checkbox"})
                            )
                        )
                    )
                ),
                html.div({ klass: "form-group"},
                    html.div({ klass: "col-sm-offset-2 col-sm-10"},
                        html.button({ type: "submit",  klass: "btn btn-default"}, "Sign in")
                    )
                )
            );
        }
    });

    examples.formInputs = code({
        group: "Forms",
        label: "Inputs",
        links: ["http://getbootstrap.com/css/#forms-controls"],
        example : function(html) {
            html.input({ type: "text",  klass: "form-control",  placeholder: "Text input"});
            html.textarea({ klass: "form-control",  rows: "3"});
        }
    });

    examples.formCheckboxesAndRadios = code({
        group: "Forms",
        label: "Checkboxes and radios (stacked)",
        links: ["http://getbootstrap.com/css/#forms-controls"],
        example : function(html) {
            html.div({ klass: "checkbox"},
                html.label(
                    html.input({ type: "checkbox",  value: ""})
                )
            );
            html.div({ klass: "radio"},
                html.label(
                    html.input({ type: "radio",  name: "optionsRadios",  id: "optionsRadios1",  value: "option1",  checked: "checked"})
                )
            );

            html.div({ klass: "radio"},
                html.label(
                    html.input({ type: "radio",  name: "optionsRadios",  id: "optionsRadios2",  value: "option2"})
                )
            );

        }
    });

    examples.formCheckboxesInline = code({
        group: "Forms",
        label: "Checkboxes inlined",
        links: ["http://getbootstrap.com/css/#forms-controls"],
        example : function(html) {
            html.label({ klass: "checkbox-inline"},
                html.input({ type: "checkbox",  id: "inlineCheckbox1",  value: "option1"}), "1"
            );
            html.label({ klass: "checkbox-inline"},
                html.input({ type: "checkbox",  id: "inlineCheckbox2",  value: "option2"}), "2"
            );

            html.label({ klass: "checkbox-inline"},
                html.input({ type: "checkbox",  id: "inlineCheckbox3",  value: "option3"}), "3"
            );

        }
    });

    examples.formSelects = code({
        group: "Forms",
        label: "Selects",
        links: ["http://getbootstrap.com/css/#forms-controls"],
        example : function(html) {
            html.select({ klass: "form-control"},
                html.option("1"),
                html.option("2"),
                html.option("3"),
                html.option("4"),
                html.option("5")
            );
            html.select({ multiple: "multiple",  klass: "form-control"},
                html.option("1"),
                html.option("2"),
                html.option("3"),
                html.option("4"),
                html.option("5")
            );
        }
    });

    examples.formStatic = code({
        group: "Forms",
        label: "Static",
        links: ["http://getbootstrap.com/css/#forms-controls-static"],
        example : function(html) {
            html.form({ klass: "form-horizontal",  role: "form"},
                html.div({ klass: "form-group"},
                    html.label({ klass: "col-sm-2 control-label"}, "Email"),
                    html.div({ klass: "col-sm-10"}, html.p({ klass: "form-control-static"}, "email@example.com")
                    )
                ),
                html.div({ klass: "form-group"},
                    html.label({ for: "inputPassword",  klass: "col-sm-2 control-label"}, "Password"),
                    html.div({ klass: "col-sm-10"},
                        html.input({ type: "password",  klass: "form-control",  id: "inputPassword",  placeholder: "Password"})
                    )
                )
            );

        }
    });

    examples.formFocusDisable = code({
        group: "Forms",
        label: "Focus / Disable",
        links: ["http://getbootstrap.com/css/#forms-control-focus", "http://getbootstrap.com/css/#forms-control-disabled"],
        example : function(html) {
            html.input({ klass: "form-control",  id: "focusedInput",  type: "text",  value: "Demonstrative focus state"});
            html.input({ klass: "form-control",  id: "disabledInput",  type: "text",  placeholder: "Disabled input here...",  disabled: "disabled"});
        }
    });

    examples.formDisableFieldset = code({
        group: "Forms",
        label: "Disabled fieldset",
        links: ["http://getbootstrap.com/css/#forms-control-disabled"],
        example : function(html) {
            html.form({ role: "form"},
                html.fieldset({ disabled: "disabled"},
                    html.div({ klass: "form-group"},
                        html.label({ for: "disabledTextInput"}, "Disabled input"),
                        html.input({ type: "text",  id: "disabledTextInput",  klass: "form-control",  placeholder: "Disabled input"})
                    ),
                    html.div({ klass: "form-group"},
                        html.label({ for: "disabledSelect"}, "Disabled select menu"),
                        html.select({ id: "disabledSelect",  klass: "form-control"},
                            html.option("Disabled select")
                        )
                    ),
                    html.div({ klass: "checkbox"},
                        html.label(html.input({ type: "checkbox"}))
                    ),
                    html.button({ type: "submit",  klass: "btn btn-primary"}, "Submit")
                )
            );

        }
    });

    examples.formValidationState = code({
        group: "Forms",
        label: "Validation states",
        links: ["http://getbootstrap.com/css/#forms-control-validation"],
        example : function(html) {
            html.div({ klass: "form-group has-success"},
                html.label({ klass: "control-label",  for: "inputSuccess1"}, "Input with success"),
                html.input({ type: "text",  klass: "form-control",  id: "inputSuccess1"})
            );
            html.div({ klass: "form-group has-warning"},
                html.label({ klass: "control-label",  for: "inputWarning1"}, "Input with warning"),
                html.input({ type: "text",  klass: "form-control",  id: "inputWarning1"})
            );
            html.div({ klass: "form-group has-error"},
                html.label({ klass: "control-label",  for: "inputError1"},"Input with error"),
                html.input({ type: "text",  klass: "form-control",  id: "inputError1"})
            );

        }
    });

    examples.formValidationWithIncons = code({
        group: "Forms",
        label: "Validation states with optional icons",
        links: ["http://getbootstrap.com/css/#forms-control-validation"],
        example : function(html) {
            html.div({ klass: "form-group has-success has-feedback"},
                html.label({ klass: "control-label",  for: "inputSuccess2"}, "Input with success"),
                html.input({ type: "text",  klass: "form-control",  id: "inputSuccess2"}),
                html.span({ klass: "glyphicon glyphicon-ok form-control-feedback"})
            );
            html.div({ klass: "form-group has-warning has-feedback"},
                html.label({ klass: "control-label",  for: "inputWarning2"}, "Input with warning"),
                html.input({ type: "text",  klass: "form-control",  id: "inputWarning2"}),
                html.span({ klass: "glyphicon glyphicon-warning-sign form-control-feedback"})
            );
            html.div({ klass: "form-group has-error has-feedback"},
                html.label({ klass: "control-label",  for: "inputError2"},"Input with error"),
                html.input({ type: "text",  klass: "form-control",  id: "inputError2"}),
                html.span({ klass: "glyphicon glyphicon-remove form-control-feedback"})
            );

        }
    });

    examples.formHeightSizing = code({
        group: "Forms",
        label: "Height sizing",
        links: ["http://getbootstrap.com/css/#forms-control-sizes"],
        example : function(html) {
            html.form({ role: "form"},
                html.div({ klass: "controls"},
                    html.input({ klass: "form-control input-lg",  type: "text",  placeholder: ".input-lg"}),
                    html.input({ type: "text",  klass: "form-control",  placeholder: "Default input"}),
                    html.input({ klass: "form-control input-sm",  type: "text",  placeholder: ".input-sm"}),
                    html.select({ klass: "form-control input-lg"},
                        html.option({ value: ""},".input-lg")
                    ),
                    html.select({ klass: "form-control"},
                        html.option({ value: ""}, "Default select")
                    ),
                    html.select({ klass: "form-control input-sm"},
                        html.option({ value: ""}, ".input-sm")
                    )
                )
            );

        }
    });

    examples.formColumnSizing = code({
        group: "Forms",
        label: "Column sizing",
        links: ["http://getbootstrap.com/css/#forms-control-sizes"],
        example : function(html) {
            html.div({ klass: "row"},
                html.div({ klass: "col-xs-2"},
                    html.input({ type: "text",  klass: "form-control",  placeholder: ".col-xs-2"})
                ),
                html.div({ klass: "col-xs-3"},
                    html.input({ type: "text",  klass: "form-control",  placeholder: ".col-xs-3"})
                ),
                html.div({ klass: "col-xs-4"},
                    html.input({ type: "text",  klass: "form-control",  placeholder: ".col-xs-4"})
                )
            );
        }
    });

    examples.formHelpText = code({
        group: "Forms",
        label: "Help text",
        links: ["http://getbootstrap.com/css/#forms-help-text"],
        example : function(html) {
            html.span({ klass: "help-block"},
                "A block of help text that breaks onto a new line and may extend beyond one line."
            );
        }
    });


    var users = [
        { firstName: "Mark", lastName: "Otto", userName: "@mdo"},
        { firstName: "Jacob", lastName: "Thornton", userName: "@fat"},
        { firstName: "Larry", lastName: "the Bird", userName: "@twitter"}
    ];

    examples.table = code({
        group: "Tables",
        label: "Table",
        links: ["http://getbootstrap.com/css/#tables-example"],
        example : function(html) {
            html.table({"class": "table table-responsive"},
                html.thead(
                    html.tr(
                        html.th("#"),
                        html.th("First Name"),
                        html.th("Last Name"),
                        html.th("User Name")
                    )
                ),
                html.tbody(
                    users.map(function(user, index) {
                        return html.tr(
                            html.td(index.toString()),
                            html.td(user.firstName),
                            html.td(user.lastName),
                            html.td(user.userName)
                        );
                    })
                )
            );
        }
    });

    examples.tableStriped = code({
        group: "Tables",
        label: "Striped",
        links: ["http://getbootstrap.com/css/#tables-striped"],
        example : function(html) {
            // Striped
            html.table({"class": "table table-striped"},
                html.thead(
                    html.tr(
                        html.th("#"),
                        html.th("First Name"),
                        html.th("Last Name"),
                        html.th("User Name")
                    )
                ),
                html.tbody(
                    users.map(function(user, index) {
                        return html.tr(
                            html.td(index.toString()),
                            html.td(user.firstName),
                            html.td(user.lastName),
                            html.td(user.userName)
                        );
                    })
                )
            );
        }
    });

    examples.tableBordered = code({
        group: "Tables",
        label: "Bordered",
        links: ["http://getbootstrap.com/css/#tables-bordered"],
        example : function(html) {
            html.table({"class": "table table-bordered"},
                html.thead(
                    html.tr(
                        html.th("#"),
                        html.th("First Name"),
                        html.th("Last Name"),
                        html.th("User Name")
                    )
                ),
                html.tbody(
                    users.map(function(user, index) {
                        return html.tr(
                            html.td(index.toString()),
                            html.td(user.firstName),
                            html.td(user.lastName),
                            html.td(user.userName)
                        );
                    })
                )
            );
        }
    });

    examples.tableHover = code({
        group: "Tables",
        label: "Hover rows",
        links: ["http://getbootstrap.com/css/#tables-hover-rows"],
        example : function(html) {
            html.table({"class": "table table-hover"},
                html.thead(
                    html.tr(
                        html.th("#"),
                        html.th("First Name"),
                        html.th("Last Name"),
                        html.th("User Name")
                    )
                ),
                html.tbody(
                    users.map(function(user, index) {
                        return html.tr(
                            html.td(index.toString()),
                            html.td(user.firstName),
                            html.td(user.lastName),
                            html.td(user.userName)
                        );
                    })
                )
            );
        }
    });

    examples.tableCondensed = code({
        group: "Tables",
        label: "Condensed",
        links: ["http://getbootstrap.com/css/#tables-condensed"],
        example : function(html) {
            html.table({"class": "table table-condensed"},
                html.thead(
                    html.tr(
                        html.th("#"),
                        html.th("First Name"),
                        html.th("Last Name"),
                        html.th("User Name")
                    )
                ),
                html.tbody(
                    users.map(function(user, index) {
                        return html.tr(
                            html.td(index.toString()),
                            html.td(user.firstName),
                            html.td(user.lastName),
                            html.td(user.userName)
                        );
                    })
                )
            );
        }
    });

    examples.tableContextualClasses = code({
        group: "Tables",
        label: "Contextual classes",
        links: ["http://getbootstrap.com/css/#tables-contextual-classes"],
        example : function(html) {
            html.table({"class": "table "},
                html.thead(
                    html.tr(
                        html.th("A"),
                        html.th("B"),
                        html.th("C")
                    )
                ),
                html.tbody(
                    ["active", "success", "info", "warning", "danger"].map(function(cssClass) {
                        return html.tr( {"class" : cssClass},
                            html.td(cssClass),
                            html.td(cssClass),
                            html.td(cssClass)
                        );
                    })
                )
            );
        }
    });

    examples.code = code({
        group: "Code",
        label: "Code and KBD",
        links: ["http://getbootstrap.com/css/#code"],
        example : function(html) {
            html.p("For example, ", html.code("&lt;section&gt;"), " should be wrapped as inline.");
            html.p("To switch directories, type ", html.kbd("cd"), " followed by the name of the directory.");
        }
    });

    examples.typographyHeadings = code({
        group: "Typography",
        label: "Headings",
        links: ["http://getbootstrap.com/css/#type-headings"],
        example : function(html) {
            html.h3("h3. Bootstrap heading");
            html.h4("h4. Bootstrap heading");
        }
    });

    examples.typographyHeadingWithSecondaryText = code({
        group: "Typography",
        label: "Heading with secondary text",
        links: ["http://getbootstrap.com/css/#type-headings"],
        example : function(html) {
            html.h3("h3. Bootstrap heading ", html.small("Secondary text"));
            html.h4("h4. Bootstrap heading ", html.small("Secondary text"));
        }
    });

    examples.typographyP = code({
        group: "Typography",
        label: "P/SMALL/STRONG/EM",
        links: ["http://getbootstrap.com/css/#type"],
        example : function(html) {
            html.p("Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam id dolor id nibh ultricies vehicula.");
            html.p({ "class": "lead" }, "Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Duis mollis, est non commodo luctus.");
            html.small("This line of text is meant to be treated as fine print.");
            html.strong("The following snippet of text is rendered as bold text");
            html.em("The following snippet of text is rendered as italicized text.");
        }
    });

    examples.typographyAlign = code({
        group: "Typography",
        label: "Align text",
        links: ["http://getbootstrap.com/css/#type"],
        example : function(html) {
            html.p({"class": "text-left"}, "Left aligned text.");
            html.p({"class": "text-center"}, "Center aligned text.");
            html.p({"class": "text-right"}, "Right aligned text.");
            html.p({"class": "text-justify"}, "Justified text.");
        }
    });

    examples.typographyABBR = code({
        group: "Typography",
        label: "ABBR",
        links: ["http://getbootstrap.com/css/#type-abbreviations"],
        example : function(html) {
            html.p("Hover the ", html.abbr({ tittle: "A description to show"}, "abbr"));
            html.p(html.abbr({ tittle: "HyperText Markup Language", "class": "initialism"}, "HTML"), " is the best thing since sliced bread.");
        }
    });

    examples.typographyAddress = code({
        group: "Typography",
        label: "Address",
        links: ["http://getbootstrap.com/css/#type-addresses"],
        example : function(html) {
            html.address(
                html.strong("Företagsplatsen AB"), html.br(),
                "Skeppsbron 26, 11 15", html.br(),
                "Stockholm SWEDEN", html.br(),
                html.abbr({ title: "Phone"}, "P:"), " +46 (0)70 7746 300", html.br()
            );
            html.address(
                html.strong("Full name"), html.br(),
                html.a({ href: "mailto:#"}, "first.last@example.com")
            );
        }
    });

    examples.typographyBlockquote = code({
        group: "Typography",
        label: "Blockquote",
        links: ["http://getbootstrap.com/css/#type-blockquotes"],
        example : function(html) {
            html.blockquote(
                html.p("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.")
            );
            html.blockquote(
                html.p("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante."),
                html.footer("Someone famous in ", html.cite({title: "Source Title"}, "Source Title"))
            );
            html.blockquote({ "class": "blockquote-reverse"},
                html.p("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante."),
                html.footer("Someone famous in ", html.cite({title: "Source Title"}, "Source Title"))
            );
        }
    });

    examples.typographyUnorderedList = code({
        group: "Typography",
        label: "Unordered list",
        links: ["http://getbootstrap.com/css/#type-lists"],
        example : function(html) {
            html.ul(
                html.li("Lorem ipsum dolor sit amet"),
                html.li("Lorem ipsum dolor sit amet"),
                html.li("Lorem ipsum dolor sit amet"),
                html.li("Lorem ipsum dolor sit amet"),
                html.li("Lorem ipsum dolor sit amet")
            );
        }
    });

    examples.typographyOrderedList = code({
        group: "Typography",
        label: "Ordered list",
        links: ["http://getbootstrap.com/css/#type-lists"],
        example : function(html) {
            html.ol(
                html.li("Lorem ipsum dolor sit amet"),
                html.li("Lorem ipsum dolor sit amet"),
                html.li("Lorem ipsum dolor sit amet"),
                html.li("Lorem ipsum dolor sit amet"),
                html.li("Lorem ipsum dolor sit amet")
            );
        }
    });

    examples.typographyUnstyledList =code({
        group: "Typography",
        label: "Unstyled list",
        links: ["http://getbootstrap.com/css/#type-lists"],
        example : function(html) {
            html.ul({ "class": "list-unstyled"},
                html.li("Lorem ipsum dolor sit amet"),
                html.li("Lorem ipsum dolor sit amet"),
                html.li("Lorem ipsum dolor sit amet"),
                html.li("Lorem ipsum dolor sit amet"),
                html.li("Lorem ipsum dolor sit amet")
            );
        }
    });

    examples.typographyInlinedList = code({
        group: "Typography",
        label: "Inlined list",
        links: ["http://getbootstrap.com/css/#type-lists"],
        example : function(html) {
            html.ul({ "class": "inline"},
                html.li("Lorem ipsum dolor sit amet"),
                html.li("Lorem ipsum dolor sit amet"),
                html.li("Lorem ipsum dolor sit amet"),
                html.li("Lorem ipsum dolor sit amet"),
                html.li("Lorem ipsum dolor sit amet")
            );
        }
    });

    examples.typographyDescriptionList =code({
        group: "Typography",
        label: "Description lists",
        links: ["http://getbootstrap.com/css/#type-lists"],
        example : function(html) {
            html.dl(
                html.dt("Description lists"),
                html.dd("A description list is perfect for defining terms."),
                html.dt("Euismod"),
                html.dd("Vestibulum id ligula porta felis euismod semper eget lacinia odio sem nec elit. Donec id elit non mi porta gravida at eget metus.")
            );
            html.dl({"class": "dl-horizontal"},
                html.dt("Description lists"),
                html.dd("A description list is perfect for defining terms."),
                html.dt("Euismod"),
                html.dd("Vestibulum id ligula porta felis euismod semper eget lacinia odio sem nec elit. Donec id elit non mi porta gravida at eget metus.")
            );
        }
    });

    examples.gridSystemColumns = code({
        group: "Grid",
        label: "Columns",
        links: ["http://getbootstrap.com/css/#grid"],
        example : function(html) {
            // 12 columns (stack on mobile)
            html.div({ "class" : "row show-grid"},
                lodash.range(12).map(function() {
                    return html.div({ "class" : "col-md-1" }, "col-md-1");
                })
            );

            // Large column + small column (stack on mobile)
            html.div({ "class" : "row show-grid"},
                html.div({ "class" : "col-md-8" }, "col-md-8"),
                html.div({ "class" : "col-md-4" }, "col-md-4")
            );

            // 3 equally sized columns (stack on mobile)
            html.div({ "class" : "row show-grid"},
                html.div({ "class" : "col-md-4" }, "col-md-4"),
                html.div({ "class" : "col-md-4" }, "col-md-4"),
                html.div({ "class" : "col-md-4" }, "col-md-4")
            );

            // Stack the columns on mobile by making one full-width and the other half-width
            html.div({ "class" : "row show-grid"},
                html.div({ "class" : "col-xs-12 col-md-8" }, "col-xs-12 col-md-8"),
                html.div({ "class" : "col-xs-6 col-md-4" }, "col-xs-6 col-md-4")
            );
        }
    });

    examples.gridSystemOffsets = code({
        group: "Grid",
        label: "Offsets",
        links: ["http://getbootstrap.com/css/#grid-offsetting"],
        example : function(html) {
            html.div({ "class" : "row show-grid"},
                html.div({ "class" : "col-md-6 col-md-offset-3" }, "col-md-6 col-md-offset-3")
            );
        }
    });

    examples.gridSystemNest = code({
        group: "Grid",
        label: "Nest",
        links: ["http://getbootstrap.com/css/#grid-nesting"],
        example : function(html) {
            html.div({ "class" : "row show-grid"},
                html.div({ "class" : "col-md-9" }, "Level 1: .col-md-9",
                    html.div({ "class" : "row show-grid"},
                        html.div({ "class" : "col-md-6" }, "Level 2: .col-md-6"),
                        html.div({ "class" : "col-md-6" }, "Level 2: .col-md-6")
                    )
                )
            );
        }
    });

    examples.gridSystemColumnOrdering = code({
        group: "Grid",
        label: "Column ordering",
        links: ["http://getbootstrap.com/css/#grid-column-ordering"],
        example : function(html) {
            html.div({ "class" : "row show-grid"},
                html.div({ "class" : "col-md-9 col-md-push-3" }, "col-md-9 col-md-push-3"),
                html.div({ "class" : "col-md-3 col-md-pull-9" }, "col-md-3 col-md-pull-9")
            );
        }
    });

    examples.buttonsOptions = code({
        group: "Buttons",
        label: "Options",
        links: ["http://getbootstrap.com/css/#buttons-options"],
        example : function(html) {
            html.button({ type: "button",  klass: "btn btn-default"}, "Default");
            html.button({ type: "button",  klass: "btn btn-primary"}, "Primary");
            html.button({ type: "button",  klass: "btn btn-success"}, "Success");
            html.button({ type: "button",  klass: "btn btn-info"}, "Info");
            html.button({ type: "button",  klass: "btn btn-warning"}, "Warning");
            html.button({ type: "button",  klass: "btn btn-danger"}, "Danger");
            html.button({ type: "button",  klass: "btn btn-link"}, "Link");
        }
    });

    examples.buttonsSizes = code({
        group: "Buttons",
        label: "Sizes",
        links: ["http://getbootstrap.com/css/#buttons-sizes"],
        example : function(html) {
            html.p(
                html.button({ type: "button",  klass: "btn btn-primary btn-lg"}, "Large button"),
                html.button({ type: "button",  klass: "btn btn-default btn-lg"}, "Large button")
            );
            html.p(html.button({ type: "button",  klass: "btn btn-primary"}, "Default button"),
                html.button({ type: "button",  klass: "btn btn-default"}, "Default button")
            );
            html.p(html.button({ type: "button",  klass: "btn btn-primary btn-sm"}, "Small button"),
                html.button({ type: "button",  klass: "btn btn-default btn-sm"}, "Small button")
            );
            html.p(
                html.button({ type: "button",  klass: "btn btn-primary btn-xs"}, "Extra small button"),
                html.button({ type: "button",  klass: "btn btn-default btn-xs"}, "Extra small button")
            );
        }
    });

    examples.buttonsActiveState = code({
        group: "Buttons",
        label: "Active state",
        links: ["http://getbootstrap.com/css/#buttons-active"],
        example : function(html) {
            html.a({ href: "#",  klass: "btn btn-primary btn-lg active",  role: "button"}, "Primary link");
            html.a({ href: "#",  klass: "btn btn-default btn-lg active",  role: "button"}, "Link");
        }
    });

    examples.buttonsDisabledState = code({
        group: "Buttons",
        label: "Disabled state",
        links: ["http://getbootstrap.com/css/#buttons-disabled"],
        example : function(html) {
            html.button({ type: "button",  klass: "btn btn-lg btn-primary",  disabled: "disabled"}, "Primary button");
            html.button({ type: "button",  klass: "btn btn-default btn-lg",  disabled: "disabled"}, "Button");
        }
    });

    examples.buttonsTags = code({
        group: "Buttons",
        label: "Button tags",
        links: ["http://getbootstrap.com/css/#buttons-tags"],
        example : function(html) {
            html.a({ klass: "btn btn-default",  href: "#",  role: "button"}, "Link");
            html.button({ klass: "btn btn-default",  type: "submit"}, "Button");
            html.input({ klass: "btn btn-default",  type: "button",  value: "Input"});
            html.input({ klass: "btn btn-default",  type: "submit",  value: "Submit"});
        }
    });

    var imageData = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNDAiIGhlaWdodD0iMTQwIj48cmVjdCB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgZmlsbD0iI2VlZSI+PC9yZWN0Pjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9IjcwIiB5PSI3MCIgc3R5bGU9ImZpbGw6I2FhYTtmb250LXdlaWdodDpib2xkO2ZvbnQtc2l6ZToxMnB4O2ZvbnQtZmFtaWx5OkFyaWFsLEhlbHZldGljYSxzYW5zLXNlcmlmO2RvbWluYW50LWJhc2VsaW5lOmNlbnRyYWwiPjE0MHgxNDA8L3RleHQ+PC9zdmc+";

    examples.images = code({
        group: "Images",
        label: "Images",
        links: ["http://getbootstrap.com/css/#images"],
        example : function(html) {
            html.img({ "data-src": "holder.js/140x140",  klass: "img-rounded",  alt: "140x140",  src: imageData,  style: "width: 140px; height: 140px;"});
            html.img({ "data-src": "holder.js/140x140",  klass: "img-circle",  alt: "140x140",  src: imageData,  style: "width: 140px; height: 140px;"});
            html.img({ "data-src": "holder.js/140x140",  klass: "img-thumbnail",  alt: "140x140",  src: imageData,  style: "width: 140px; height: 140px;"});
        }
    });

    examples.helpersContextualColors = code({
        group: "Helpers",
        label: "Contextual colors",
        links: ["http://getbootstrap.com/css/#helper-classes-colors"],
        example : function(html) {
            html.div(
                html.p({ klass: "text-muted"},
                    "Fusce dapibus, tellus ac cursus commodo, tortor mauris nibh."
                ),
                html.p({ klass: "text-primary"},
                    "Nullam id dolor id nibh ultricies vehicula ut id elit."
                ),
                html.p({ klass: "text-success"},
                    "Duis mollis, est non commodo luctus, nisi erat porttitor ligula."
                ),
                html.p({ klass: "text-info"},
                    "Maecenas sed diam eget risus varius blandit sit amet non magna."
                ),
                html.p({ klass: "text-warning"},
                    "Etiam porta sem malesuada magna mollis euismod."
                ),
                html.p({ klass: "text-danger"},
                    "Donec ullamcorper nulla non metus auctor fringilla."
                )
            );
        }
    });

    examples.helpersContextualBackgrounds = code({
        group: "Helpers",
        label: "Contextual backgrounds",
        links: ["http://getbootstrap.com/css/#helper-classes-backgrounds"],
        example : function(html) {
            html.div(
                html.p({ klass: "text-muted"},
                    "Fusce dapibus, tellus ac cursus commodo, tortor mauris nibh."
                ),
                html.p({ klass: "text-primary"},
                    "Nullam id dolor id nibh ultricies vehicula ut id elit."
                ),
                html.p({ klass: "text-success"},
                    "Duis mollis, est non commodo luctus, nisi erat porttitor ligula."
                ),
                html.p({ klass: "text-info"},
                    "Maecenas sed diam eget risus varius blandit sit amet non magna."
                ),
                html.p({ klass: "text-warning"},
                    "Etiam porta sem malesuada magna mollis euismod."
                ),
                html.p({ klass: "text-danger"},
                    "Donec ullamcorper nulla non metus auctor fringilla."
                )
            );
        }
    });

    examples.responsive = code({
        group: "Responsive",
        label: "Responsive utilities",
        links: ["http://getbootstrap.com/css/#responsive-utilities"],
        example : function(html) {

            html.div({ klass: "table-responsive"},
                html.table({ klass: "table table-bordered table-striped responsive-utilities"},
                    html.thead(
                        html.tr(
                            html.th(),
                            html.th(
                                html.small("Phones (&lt;768px)")
                            ),
                            html.th(
                                html.small("Tablets (≥768px)")
                            ),
                            html.th(
                                html.small("Desktops (≥992px)")
                            ),
                            html.th(
                                html.small("Desktops (≥1200px)")
                            )
                        )
                    ),
                    html.tbody(
                        html.tr(
                            html.th(
                                html.code(".visible-xs")
                            ),
                            html.td({ klass: "is-visible"}, "Visible"),
                            html.td({ klass: "is-hidden"}, "Hidden"),
                            html.td({ klass: "is-hidden"}, "Hidden"),
                            html.td({ klass: "is-hidden"}, "Hidden")
                        ),
                        html.tr(
                            html.th(
                                html.code(".visible-sm")
                            ),
                            html.td({ klass: "is-hidden"},"Hidden"),
                            html.td({ klass: "is-visible"},"Visible"),
                            html.td({ klass: "is-hidden"}, "Hidden"),
                            html.td({ klass: "is-hidden"}, "Hidden")
                        ),
                        html.tr(
                            html.th(
                                html.code(".visible-md")
                            ),
                            html.td({ klass: "is-hidden"}, "Hidden"),
                            html.td({ klass: "is-hidden"}, "Hidden"),
                            html.td({ klass: "is-visible"}, "Visible"),
                            html.td({ klass: "is-hidden"}, "Hidden")
                        ),
                        html.tr(
                            html.th(
                                html.code(".visible-lg")
                            ),
                            html.td({ klass: "is-hidden"}, "Hidden"),
                            html.td({ klass: "is-hidden"}, "Hidden"),
                            html.td({ klass: "is-hidden"}, "Hidden"),
                            html.td({ klass: "is-visible"}, "Visible")
                        )
                    ),
                    html.tbody(
                        html.tr(
                            html.th(
                                html.code(".hidden-xs")
                            ),
                            html.td({ klass: "is-hidden"},"Hidden"),
                            html.td({ klass: "is-visible"},"Visible"),
                            html.td({ klass: "is-visible"},"Visible"),
                            html.td({ klass: "is-visible"},"Visible")
                        ),
                        html.tr(
                            html.th(
                                html.code(".hidden-sm")
                            ),
                            html.td({ klass: "is-visible"},"Visible"),
                            html.td({ klass: "is-hidden"},"Hidden"),
                            html.td({ klass: "is-visible"},"Visible"),
                            html.td({ klass: "is-visible"},"Visible")
                        ),
                        html.tr(
                            html.th(
                                html.code(".hidden-md")
                            ),
                            html.td({ klass: "is-visible"},"Visible"),
                            html.td({ klass: "is-visible"},"Visible"),
                            html.td({ klass: "is-hidden"},"Hidden"),
                            html.td({ klass: "is-visible"},"Visible")
                        ),
                        html.tr(
                            html.th(
                                html.code(".hidden-lg")
                            ),
                            html.td({ klass: "is-visible"}, "Visible"),
                            html.td({ klass: "is-visible"}, "Visible"),
                            html.td({ klass: "is-visible"}, "Visible"),
                            html.td({ klass: "is-hidden"}, "Hidden")
                        )
                    )
                )
            );
        }
    });

    examples.responsivePrint = code({
        group: "Responsive",
        label: "Print classes",
        links: ["http://getbootstrap.com/css/#responsive-utilities-print"],
        example : function(html) {
            html.table({ klass: "table table-bordered table-striped responsive-utilities"},
                html.thead(
                    html.tr(
                        html.th("Class"),
                        html.th("Browser"),
                        html.th("Print")
                    )
                ),
                html.tbody(
                    html.tr(
                        html.th(
                            html.code(".visible-print")
                        ),
                        html.td({ klass: "is-hidden"},"Hidden"),
                        html.td({ klass: "is-visible"},"Visible")
                    ),
                    html.tr(
                        html.th(
                            html.code(".hidden-print")
                        ),
                        html.td({ klass: "is-visible"}, "Visible"),
                        html.td({ klass: "is-hidden"}, "Hidden")
                    )
                )
            );
        }
    });

    return examples;

});