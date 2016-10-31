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
      
      if(response.pages.length == 0) {
        log.push('Empty data returned by server when trying to retrieve Page collection. Most likely due to a new DB.');
        return [global.pageModel];
      } else {
        return response.pages;
      }
    },

    refreshView: false, 
    
    initialize: function() {
      //This function is often used for debugging, so leave it here.
      //this.on('change', function(model) {
      //  debugger;
      //});

      this.url = '/api/page/list';
      
      this.on('add', function() {
        debugger;
      });

      this.on('reset', function() {
        //debugger;

        if(this.refreshView) {
          this.refreshView = false;
          
          //Fixing bug where modal backdrop stays in place. 
          $('.modal-backdrop').hide();
          
          global.leftMenuView.showPages2();
        }
        
        //Assumption: this funciton is only called when opening the image gallery. Therefore we need to call it again and
        //finish populating the image library.
        log.push('Finished retrieving PageCollection data from server.');

        //global.pagesView.populateTable();
      });
    }
  });
  
  return PageCollection;

});
