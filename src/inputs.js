define(['widgetjs/core'], function(widgetjs) {

    function optionWidget (spec, my) {
        spec = spec || {};
        my = my || {};

        var that = widgetjs.widget(spec, my);

        my.item = spec.item;
        my.attributes = spec.attributes || {};
        my.style = spec.style || {};
        my.isSelected = spec.isSelected;

        my.getValue = function() {
            return my.item;
        };

        my.getLabel = function() {
            return my.item;
        };

        that.getItem = function () {
            return my.item;
        };

        that.setItem = function(newItem) {
            my.item = newItem;
            that.update();
        };

        that.isSelected = isSelected;

        that.select = function() {
            my.isSelected = true;
            that.update();
        };

        that.renderOn = function(html) {
            var el = html.option({ id: that.getId(), value: my.getValue() }, my.getLabel());

            el.attr(my.attributes);
            el.style(my.style);

            if (isSelected()) {
                el.setAttribute('selected', 'selected');
            }
        };

        function isSelected () {
            if (typeof my.isSelected === "function") {
                return my.isSelected(that);
            }

            return my.isSelected || false;
        }

        return that;
    }

    function selectWidget (spec, my) {
        spec = spec || {};
        my = my || {};

        var that = widgetjs.widget(spec, my);

        var optionAttributes = spec.optionAttributes;

        my.attributes = spec.attributes || {};
        my.style = spec.style || {};

        my.options = spec.options || createOptions(spec.items || []);

        that.getItems = function() {
            return my.options.map(function(option) {
                return option.getItem();
            });
        };

        that.setItems = function(newItems) {
            my.options = createOptions(newItems);
            that.update();
        };

        that.getOptions = function() {
            return my.options.slice();
        };

        that.setOptions = function(newOptions) {
            my.options(newOptions.slice());
            that.update();
        };

        that.getSelected = function() {
            return my.options.filter(function(option) {
                return option.isSelected();
            });
        };

        that.selectItem = function(item) {
            var match = my.options.filter(function(option) {
                return option.getItem() === item;
            });

            if(match && match[0]) {
                match[0].setSelected = true;
            }

            that.update();
        };


        that.renderContentOn = function(html) {
            var el = html.select(my.options);

            el.attr(my.attributes);
            el.style(my.style);

            el.change(function (event) {
                that.trigger('change', allElements[event.target.value]);
            });
        };

        function createOptions(items) {
            return items.map(function(item) {
                return optionWidget({item: item, attributes: optionAttributes});
            });
        }

        return that;
    }


    return {
        option: optionWidget,
        select: selectWidget
    };
});