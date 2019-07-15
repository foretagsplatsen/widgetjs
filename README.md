widgetjs [![Travis CI Status](https://travis-ci.org/foretagsplatsen/widget-js.svg?branch=master)](https://travis-ci.org/#!/foretagsplatsen/widgetjs)
=====

Widget-JS is a framework that provides routing, events and widgets to javascript apps.

A simple widget can look like:
``` javascript
var counterWidget = function() {
	var that = widgetjs.widget();

	var count = 0;

	that.renderContentOn = function(html) {
		html.h1(count.toString());
		html.button("+").click(function() { count++; that.update();});
		html.button("-").click(function() { count--; that.update();});
	};

	return that;
};
```

See the complete example https://github.com/foretagsplatsen/widget-js/blob/master/sample/counterWidget/index.html

### Install

Install using [bower](https://github.com/twitter/bower)
```
bower install widgetjs
```
Alternatively

Download the [minified version](https://github.com/foretagsplatsen/widget-js/tree/master/dist/WidgetJS.min.js ) or the [complete project as a zip](https://github.com/foretagsplatsen/widget-js/archive/master.zip)


### Usage

Include the minified version in your project:
``` html
<script type="text/javascript" src="http://code.jquery.com/jquery-1.8.2.min.js"></script>
<script type="text/javascript" src="WidgetJS.min.js"></script>
```


Use with requirejs:
``` javascript
requirejs.config({
	baseUrl: ".",
	paths: {
		"widgetjs" : "<widget js path>/src/WidgetJS.min.js"
	}
});
```
or
``` javascript
requirejs.config({
	baseUrl: ".",
	paths: {
		"widgetjs" : "<widget js path>/src/"
	}
});
```

### CODE
You need [yarn](https://yarnpkg.com/).

Install dependencies
```
yarn
```


Lint + run tests :
```
yarn run lint
yarn run build-test
yarn run test
```

Build:
```
yarn run build
```

### Credits
Thanks a ton to @NicolasPetton for HtmlCanvas and tricking us into developing and using Widget-JS at Företagsplatsen

### License
Widget-JS is under the MIT-license, see file LICENSE
