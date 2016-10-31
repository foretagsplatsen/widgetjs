define([
	"widgetjs/widgetjs",
	"model/recipeRepository"
], function(widgetjs, recipeRepository) {

	/**
	 * Import/Export Page
	 *
	 * Export recipes as JSON
	 * Import json recipes using drag-and-drop
	 *
	 */
	var exportDocument = widgetjs.widget.subclass(function(that, my) {

		that.renderContentOn = function(html) {
			html.h2({klass: "page-header"}, "Export");
			html.button({klass: "btn btn-default"}, "Export Recipes").click(function() {
				recipeRepository.findAll({onSuccess: function(all) {
					download(JSON.stringify(all), "recipes.json", "text/json");
				}});
			});

			html.h2({klass: "page-header"}, "Import");
			html.div({id: "drop_zone", klass: "drop_zone"}, "Drop files here")
				.dragover(noPropagation)
				.dragenter(noPropagation)
				.drop(onFileDrop);

			html.div({id: "drop_result"});
		};

		function importRecipes (json) {
			var recipes =  jQuery.parseJSON(json);
			recipes.forEach(function(recipe) {
				recipeRepository.save({model: recipe});
				jQuery("#drop_result").append("<p>Imported recipe \"" + recipe.name + "\"</p>");
			});
		}

		function onFileDrop (e) {
			if(!(e.originalEvent.dataTransfer &&
				e.originalEvent.dataTransfer.files.length)) {
				return;
			}

			noPropagation(e);

			var files = Array.prototype.slice.call(e.originalEvent.dataTransfer.files);
			files.forEach(function(file) {
				if (!file.type.match(/json.*/)) {
					jQuery("#drop_result").text("File type: \""+ file.type + "\" is not Supported");
					return;
				}

				var reader = new FileReader();
				reader.onload = function() {
					jQuery("#drop_result").html("<p>Reading file: " + file.name + "</p>");
					importRecipes(reader.result);
				};

				reader.readAsText(file);
			});
		}

		function noPropagation (e) {
			e.stopPropagation();
			e.preventDefault();
		}
	});

	// Source: http://stackoverflow.com/questions/16376161/javascript-set-file-in-download
	function download(strData, strFileName, strMimeType) {
		var doc = document,
			arg = arguments,
			link = doc.createElement("a");

		if (window.MSBlobBuilder) { // IE10
			var bb = new MSBlobBuilder();
			bb.append(strData);
			return navigator.msSaveBlob(bb, strFileName);
		} /* end if(window.MSBlobBuilder) */


		// build download link:
		link.href = "data:" + strMimeType + "," + escape(strData);

		if ("download" in link) { //FF20, CH19
			link.setAttribute("download", strFileName);
			link.innerHTML = "downloading...";
			doc.body.appendChild(link);
			setTimeout(function() {
				var e = doc.createEvent("MouseEvents");
				e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				link.dispatchEvent(e);
				doc.body.removeChild(link);
			}, 66);
			return true;
		} /* end if("download" in a) */

		//do iframe dataURL download: (older W3)
		var f = doc.createElement("iframe");
		doc.body.appendChild(f);
		f.src = "data:" + (doc[2] ? doc[2] : "application/octet-stream") + (window.btoa ? ";base64" : "") + "," + (window.btoa ? window.btoa : escape)(strData);
		setTimeout(function() {
			doc.body.removeChild(f);
		}, 333);
		return true;
	} /* end download() */

	return exportDocument;
});
