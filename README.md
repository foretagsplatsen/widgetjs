Widget.JS
=====

### Introduction

Widget.JS is a framework that provied routing, events and a widget framework to JS Apps. 


### Usage

A simple widget can look like:

``` javascript
var helloWidget = function() {
	var that = widgetjs.widget();

	that.onRenderContent = function(html) {
		html.h1('hello world');
	}

	return that;
}
```

See samples for more examples

### Install

```
bower install widgetjs
```

or copy [/dist/WidgetJS.min.js] to your project


Use with requirejs:

```
requirejs.config({
	baseUrl: '.',
	paths: {
		'widgetjs' : '{widget js path}>/src/'
	}
});
```
or

```
requirejs.config({
	baseUrl: '.',
	paths: {
		'widgetjs' : '{widget js path}>/src/WidgetJS.min.js'
	}
});


### Contributing

You need npm and grunt

```
npm install grunt-cli
```

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

```
bower install widgetjs
```


