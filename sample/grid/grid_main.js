requirejs.config({
    baseUrl: '.',
    paths:   {
        'jquery':   '../../bower_components/jquery/jquery',
        'widgetjs': '../../src/'
    }
});

define(['./grid', 'jquery'], function(grid, jQuery) {
    jQuery(document).ready(function() {
        grid().appendTo('body');
    });
});
