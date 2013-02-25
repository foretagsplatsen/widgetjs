Widget.JS
=====

### Introduction

Widget.JS is a framework that provides routing, events and widgets to JS Apps. 


### Usage

``` html
<script type="text/javascript" src="http://code.jquery.com/jquery-1.8.2.min.js"></script>
<script type="text/javascript" src="https://raw.github.com/foretagsplatsen/widget-js/master/dist/WidgetJS.min.js"></script>
``` 

A simple widget can look like:

``` javascript
var helloWidget = function() {
	var that = widgetjs.widget();

	that.renderContentOn = function(html) {
		html.h1('hello world');
	}

	return that;
}
```

See https://github.com/foretagsplatsen/widget-js/tree/master/sample

### Install

Use [bower](https://github.com/twitter/bower) 
```
bower install widgetjs
```


or copy  https://github.com/foretagsplatsen/widget-js/tree/master/dist/WidgetJS.min.js to your project


Use with requirejs:
``` javascript
requirejs.config({
	baseUrl: '.',
	paths: {
		'widgetjs' : '<widget js path>/src/WidgetJS.min.js'
	}
});
```
or
``` javascript
requirejs.config({
	baseUrl: '.',
	paths: {
		'widgetjs' : '<widget js path>/src/'
	}
});
```

### CODE
You need [npm](https://npmjs.org/), [bower](https://github.com/twitter/bower) and [grunt](http://gruntjs.com/)

Install depedencies
```
bower install
```

```
npm install
```

Lint + run tests :
```
grunt 
```

Build:
```
grunt dist
```

### Credits
Thanks a ton to @NicolasPetton for HtmlCanvas and tricking us into developing and using Widget.JS at Företagsplatsen

### License
Widget.JS is under the MIT-license, see file LICENSE
