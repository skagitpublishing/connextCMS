define([
  'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',
  './PageSectionModel',
], function ($, _, Backbone, PageSectionModel) {

  
  //Create an empty Collection to hold all the posts.
  var PageSectionCollection = Backbone.Collection.extend({ //Collection Class
    model: PageSectionModel,
    //url: 'http://'+global.serverIp+':'+global.serverPort+'/api/pagesection/list',
    url: '',

    //parse is called when data is returned from the server after a fetch() call.
    //Parse allows me to massage non-standard data before it is returned to the collection.
    parse: function(response) {
      //debugger;
      
      if(response.pagesection.length == 0) {
        log.push('Empty data returned by server when trying to retrieve PageSection collection. Most likely due to a new DB.');
        return [global.pageSectionModel];
      } else {
        return response.pagesection;
      }
    },

    refreshView: false,
    
    initialize: function() {
      //This function is often used for debugging, so leave it here.
      //this.on('change', function(model) {
      //  debugger;
      //});

      this.url = 'http://'+global.serverIp+':'+global.serverPort+'/api/pagesection/list',
      
      this.on('add', function() {
        debugger;
      });

      this.on('reset', function() {
        //debugger;

        if(this.refreshView) {
          this.refreshView = false;
          global.sectionsView.render();
        }
        
        //Assumption: this funciton is only called when opening the image gallery. Therefore we need to call it again and
        //finish populating the image library.
        log.push('Finished retrieving PageSectionCollection data from server.');

      });
    }
  });
  
  return PageSectionCollection;

});
