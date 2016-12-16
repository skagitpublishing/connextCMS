define([
  'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',
  './FrontEndWidgetModel',
], function ($, _, Backbone, FrontEndWidgetModel) {  

  
  //Create an empty Collection to hold all the posts.
  var FrontEndWidgetCollection = Backbone.Collection.extend({ //Collection Class
    model: FrontEndWidgetModel,
    //url: 'http://'+global.serverIp+':'+global.serverPort+'/api/post/list',
    url: '',

    //parse is called when data is returned from the server after a fetch() call.
    //Parse allows me to massage non-standard data before it is returned to the collection.
    parse: function(response) {
      //debugger;
      
      if(response.frontendwidget.length == 0) {
        log.push('Empty data returned by server when trying to retrieve Front End Widget models. Most likely due to a new DB.');
        return [global.frontEndWidgetModel];
      } else {
        return response.frontendwidget;
      }
    },

    refreshView: false, 
    refreshWidget: false,
    
    initialize: function() {
      //This function is often used for debugging, so leave it here.
      //this.on('change', function(model) {
      //  debugger;
      //});

      this.url = '/api/frontendwidget/list';
      
      this.on('add', function() {
        debugger;
      });

      this.on('reset', function() {
        //debugger;
        
        if(this.refreshView) {
          this.refreshView = false;
          
          //Fixing bug where modal backdrop stays in place. 
          //$('.modal-backdrop').hide();
          
          //global.leftMenuView.showPosts2();
          global.frontEndWidgetView.render();
          
        //Re-render the View and load the target widget.
        }
        
        if(this.refreshWidget) {
          //debugger;
          this.refreshWidget = false;
          
          global.editWidgetView.render(global.editWidgetView.targetWidget, global.tinymce.currentModelIndex);
        }

        //Assumption: this funciton is only called when opening the image gallery. Therefore we need to call it again and
        //finish populating the image library.
        log.push('Finished retrieving FrontEndWidgetCollection data from server.');

      });
    }
  });
  
  return FrontEndWidgetCollection;

});