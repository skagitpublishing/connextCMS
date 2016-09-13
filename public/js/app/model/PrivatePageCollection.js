define([
  'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',
  './PrivatePageModel',
], function ($, _, Backbone, PrivatePageModel) { 

  
  //Create an empty Collection to hold all the posts.
  var PrivatePageCollection = Backbone.Collection.extend({ //Collection Class
    model: PrivatePageModel,
    //url: 'http://'+global.serverIp+':'+global.serverPort+'/api/page/list',
    url: '',

    //parse is called when data is returned from the server after a fetch() call.
    //Parse allows me to massage non-standard data before it is returned to the collection.
    parse: function(response) {
      //debugger;
      
      //if(response.results.length == 0) { //Admin API
      if(response.pages.length == 0) { //Old API
        log.push('Empty data returned by server when trying to retrieve Private Page collection. Most likely due to a new DB.');
        return [global.privatePageModel];
      } else {
        //return response.results; //Admin API
        return response.pages; //Old API
      }
    },

    refreshView: false, 
    
    initialize: function() {
      //debugger;
      
      //This function is often used for debugging, so leave it here.
      //this.on('change', function(model) {
      //  debugger;
      //});

      //this.url = '/keystone/api/private-pages'; //Admin API
      this.url = '/api/privatepage/list'; //Old API
      
      this.on('add', function() {
        //debugger;
      });

      this.on('reset', function() {
        //debugger;

        if(this.refreshView) {
          this.refreshView = false;
          
          //Fixing bug where modal backdrop stays in place. 
          $('.modal-backdrop').hide();
          
          global.leftMenuView.showPages2();
          log.push('Rendering pagesView.js');
        }
        
        //Assumption: this funciton is only called when opening the image gallery. Therefore we need to call it again and
        //finish populating the image library.
        log.push('Finished retrieving PrivatePageCollection data from server.');

        //global.pagesView.populateTable();
      });
    }
  });
  
  return PrivatePageCollection;

});
