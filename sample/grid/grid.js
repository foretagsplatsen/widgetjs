define([
  'widgetjs/core',
  'widgetjs/grid/searchFieldWidget',
  'widgetjs/grid/cardGridWidget',
  'widgetjs/grid/tableGridWidget',
  'widgetjs/grid/iconCardWidget',
  'widgetjs/grid/detailedCardWidget',
], function(widgetjs, searchFieldWidget, cardGridWidget, tableGridWidget, iconCardWidget, detailedCardWidget) {

  function linkify(url) {
    return function(html) {
      html.a({href: url}, url);
    };
  }

  function property(name, formatter) {
    return function(item) {
      if(formatter) {
        return formatter(item[name]);
      }
      return item[name];
    };
  }

  function user(spec) {
    spec = spec || {};

    var name = spec.name;
    var blog = spec.blog;

    var that = {};

    that.id = name;
    that.name = name;
    that.blog = blog;
    that.image = '';

    that.match = function(keyword) {
      return name.indexOf(keyword) >= 0 ||
        blog.indexOf(keyword) >= 0;
    };

    return that;
  }

  function grid(spec, my) {
      spec = spec || {};
      my = my || {};

      var that = widgetjs.widget(spec, my);

      var users = [
        user({
          name: 'Nicolas Peton',
          blog: 'www.nicolaspetton.com'
        }),
        user({
          name: 'Mikael Hägerbro',
          blog: 'www.hagerbride.com'
        }),
        user({
          name: 'Anders Hedström',
          blog: 'www.acunt.com'
        })
      ];

      var search = searchFieldWidget();

      // TABLE GRID
      var tableGrid = tableGridWidget({
        source: users,
        //orderBy: 'name',
        //searchOn: 'name',
        fields: {
          'name' : {
            content: function(user) { //TODO: tableCellContent?
              return function(html) {
                html.a({href: my.linkTo('showRecipe', { recipeId: user.id })},
                  html.img({style: 'height:30px', klass: 'img-circle', src: user.image }),
                  html.b(' ', user.name)
                );
              };
            }
            //TODO: class: 'tada'
          },
          'blog' : {
            title: 'Blog',
            value: property('blog', linkify)
            //TODO: type: date/url/string/number/currency
            //TODO: orderable: false
          }
          // ,
          // 'description' : property('description')
        }
      });
      search.applySearchOn(tableGrid);

      //TODO: Sortable columns => orderBy function?

      // CARDGRID ALTERNATIVE 1: Generic grid with specialized cards
      var cardGrid = cardGridWidget({
        source: users,
        searchOn: property('match'),
        //orderBy: 'name',
        //TODO: search: function(query) { return async... ]);
        card: iconCardWidget,
        fields: {
          'link': function(item) {
            return ''; //my.linkTo('showRecipe', { recipeId: item.id })
          },
          'name': {
            isLabel: true, //TODO: isCardLabel: true
            value: property('name')
          },
          'icon': property('image') // isCardIcon: true
        }
      });

      search.applySearchOn(cardGrid); //TODO: argument


      // // ANOTHER EXAMPLE OF A GRID
      // var detailedCardGrid = cardGridWidget({
      //   source: recipes,
      //   pageSize: 3,
      //   searchOn: property('match'),
      //   orderBy: recipeModel.recipe.orderByName,
      //   card: detailedCardWidget,
      //   fields: {
      //     'link': function(item) {
      //       return '#'; //my.linkTo('showRecipe', { recipeId: item.id })
      //     },
      //     'label': property('name'),
      //     'icon': property('image'),
      //     'ingredients' : function(recipe) {
      //       return recipe.ingredients.length;
      //     },
      //     'instructions' : function(recipe) {
      //       return recipe.instructions.length;
      //     }
      //   }
      // });
      //
      // search.applySearchOn(detailedCardGrid);


      that.renderContentOn = function(html) {
        html.div({klass: 'row'}, search);
        html.hr();

        html.div({klass: 'row'}, tableGrid);
        html.hr();
      };

      return that;
  }

  return grid;
});
