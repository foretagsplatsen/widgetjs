define([
	'./cardGridWidget'
], function(cardGridWidget) {


	function tableGridWidget(spec, my) {
		spec = spec || {};
		my = my || {};

		spec.fields  = spec.fields || spec.columns;

		var that = cardGridWidget(spec, my);

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
					my.currentElements.map(function(element){
						return html.tr(
							that.getFieldNames().map(function(fieldName) {
								return html.td(that.getFieldValue(fieldName, element));
							})
						)
					})
				)
			);
		};

		return that;
	}

	return tableGridWidget;
});