define([
  'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',
  './ImageUploadModel',
], function ($, _, Backbone, ImageUploadModel) {

  
  //Create an empty Collection to hold all the image Models.
  var ImageUploadCollection = Backbone.Collection.extend({ //Collection Class
    model: ImageUploadModel,
    //url: 'http://'+global.serverIp+'/api/imageupload/list',
    url: '',

    //parse is called when data is returned from the server after a fetch() call.
    //Parse allows me to massage non-standard data before it is returned to the collection.
    parse: function(response) {
      //debugger;
      return response.collections;
    },

    initialize: function() {
      //this.on('change', function(model) {
      //  debugger;
      //});

      this.on('add', function() {
        debugger;
      });

      this.on('reset', function() {
        //debugger;

        //Assumption: this funciton is only called when opening the image gallery. Therefore we need to call it again and
        //finish populating the image library.
        log.push('Finished retrieving ImageUpload data from server. Opening the image gallery.');

        //Create a sub-collection based on 'parent' images.
        global.imageLibraryView.getParentImageCollection();

        global.imageLibraryView.openGallery();
      });
      
      this.url = 'http://'+global.serverIp+'/api/imageupload/list';
    }
  });
  
  return ImageUploadCollection;

});
