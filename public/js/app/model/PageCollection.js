define([
  'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',
  './PageModel',
], function ($, _, Backbone, PageModel) {

  
  //Create an empty Collection to hold all the posts.
  var PageCollection = Backbone.Collection.extend({ //Collection Class
    model: PageModel,
    //url: 'http://'+global.serverIp+':'+global.serverPort+'/api/page/list',
    url: '',

    //parse is called when data is returned from the server after a fetch() call.
    //Parse allows me to massage non-standard data before it is returned to the collection.
    parse: function(response) {
      //debugger;
      return response.pages;
    },

    initialize: function() {
      //this.on('change', function(model) {
      //  debugger;
      //});

      this.url = 'http://'+global.serverIp+':'+global.serverPort+'/api/page/list';
      
      this.on('add', function() {
        debugger;
      });

      this.on('reset', function() {
        //debugger;

        //Assumption: this funciton is only called when opening the image gallery. Therefore we need to call it again and
        //finish populating the image library.
        log.push('Finished retrieving PageCollection data from server.');

        //global.pagesView.populateTable();
      });
    }
  });
  
  return PageCollection;

});
