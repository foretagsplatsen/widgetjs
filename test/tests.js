QUnit.config.autostart = false;

requirejs.config({
	baseUrl: '.',
	paths: {
		'jquery': '../components/jquery/jquery' //,
		//'qunit' : '../components/qunit/qunit'
	},
	packages: [
		{
			name: "widgetjs",
			location: "../src",
			main : 'main'
		}
	]
});

var testModules = [
	'htmlCanvasTest',
	'widgetTest',
	'eventsTest',
	'routerTest'];


define(testModules, function() {
	QUnit.start();
});