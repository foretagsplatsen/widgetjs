define([
	'documents/aboutDocument',
	'documents/recipesDocument',
	'documents/recipeDocument',
], function (aboutDocument, recipesDocument, recipeDocument) {
	return {
		aboutDocument: aboutDocument(),
		recipesDocument: recipesDocument(),
		recipeDocument: recipeDocument()
	};
});