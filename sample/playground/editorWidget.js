define([
  "widgetjs",
  "jquery",
  "codemirror/lib/codemirror",
  "codemirror/mode/javascript/javascript"
], function(widgetjs, jQuery, codemirror) {

  /**
  * Code Editor is a wrapper for coded mirror (https://codemirror.net/).
  *
  * @param	{{}} spec
  * @param	{boolean} [spec.showLineNumbers="true"]
  * @param	{string} [spec.theme="monokai"] Code Mirror theme. Make sure css is  included.
  * @param	{string} [spec.mode="javascript"] Code Mirror mode.
  * @param	{string} [spec.code=""] Code to edit.
  *
  * @param	my
  *
  * @return {editorWidget}
  */
  function editorWidget(spec, my) {
    spec = spec || {};
    my = my || {};

    var that = widgetjs.widget(spec, my);

    var showLineNumbers = spec.showLineNumbers === undefined ? true : spec.showLineNumbers;
    var theme = spec.theme || "monokai";
    var mode = spec.mode || "javascript";
    var code = spec.code || "";

    var editor;

    that.onChange = my.events.createEvent();

    //
    // Public
    //

    that.getCode = function() {
      return code;
    };

    that.setCode = function(newCode) {
      code = newCode;
      that.onChange.trigger(code);
      that.update();
    };

    //
    // Render
    //

    that.renderContentOn = function(html) {
      html.textarea({id: "editor", style: "height:100%"}, code);
    };

    my.didAttach = function() {
      editor = codemirror.fromTextArea(document.getElementById("editor"), {
        lineNumbers: showLineNumbers,
        matchBrackets: true,
        mode: mode,
        theme: theme,
        autofocus: true
      });

      editor.on("change", my.codeChanged);
    };

    //
    // Protected
    //

    my.codeChanged = function() {
      if(editor) {
        code = editor.getValue();
        that.onChange.trigger(code);
      }
    };

    return that;
  }

  return editorWidget;
});
