define([
  './abstractGridWidget'
], function(abstractGridWidget) {

  function tableGridWidget(spec, my) {
    spec = spec || {};
    my = my || {};

    spec.fields = spec.fields || spec.columns;

    var that = abstractGridWidget(spec, my);

    that.renderContentOn = function(html) {
      html.table(
        html.thead(
          html.tr(
            that.getFieldNames().map(function(fieldName) {
              return html.th(that.getFieldTitle(fieldName));
            })
          )
        ),
        html.tbody(
          my.getCurrentElements().map(function(element) {
            return html.tr(
              that.getFieldNames().map(function(fieldName) {
                return html.td(that.getFieldValue(fieldName, element));
              })
            );
          })
        )
      );
    };

    return that;
  }

  return tableGridWidget;
});
