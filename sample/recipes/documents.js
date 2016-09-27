define([
	"documents/aboutDocument",
	"documents/recipesDocument",
	"documents/recipeDocument",
	"documents/recipeEditorDocument",
	"documents/exportDocument",
], function(aboutDocument, recipesDocument, recipeDocument, recipeEditorDocument, exportDocument) {
	return {
		aboutDocument: aboutDocument(),
		recipesDocument: recipesDocument(),
		recipeDocument: recipeDocument(),
		recipeEditorDocument: recipeEditorDocument(),
		exportDocument: exportDocument()
	};
});