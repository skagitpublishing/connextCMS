define([
  'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',
], function ($, _, Backbone) {

  
  //Create local Model to represent the Post model I'll retrieve from the server.
  var PrivatePageModel = Backbone.Model.extend({

    //Map the Model 'id' to the '_id' assigned by the server.
    //idAttribute: "id",  //Admin API
    idAttribute: "_id",    //Old API

    //When initialized this.id is undefined. This url gets fixed in the initialize() function.
    //url: 'http://'+global.serverIp+':'+global.serverPort+'/api/post/'+this.id+'/update', 
    url: '',

    //Initialize is called upon the instantiation of this model. This function is executed once
    //per model retrieved from the server.
    initialize: function() {
      //debugger;
      
      //This function is often used for debugging, so leave it here.
      //this.on('change', function() {
        //debugger;        
      //  this.save();
      //});
      

      //this.url = '/keystone/api/private-pages/'+this.id+'/'; //Admin API
      this.url = '/api/privatepage/'+this.id+'/update'; //Old API

    },
    
    defaults: {
      
      //Old API
      '_id': '',
      'author': '',
      'content': {
        'brief': '',
        'extended': ''
      },
      'sections': [],
      'slug': '',
      'state': '',
      'title': '',
      'publishedDate': '',
      'priority': 0,
      'redirect': ''
      
      /*
      //Keystone Admin API
      'id': '',
      'name': '',
      'slug': '',
      'fields': {
        'author': '',
        'content.brief': '',
        'content.extended': '',
        'image': new Object(),
        'priority': 0,
        'publishedDate': '',
        'redirect': '',
        'sections': [],
        'state': '',
        'title': ''
      }
      */
    },

    //Override the default Backbone save() function with one that our API understands.
    save: function() {
      //debugger;

      //$.getJSON(this.url, this.attributes, function(data) {
      $.post(this.url, this.attributes, function(data) {
        //Regardless of success or failure, the API returns the JSON data of the model that was just updated.
        //debugger;
        log.push('PrivatePageModel.save() executed.');

      }).fail( function(err) {
        //This is the error handler.
        debugger;
        log.push('Error while trying PrivatePageModel.save(). Most likely due to communication issue with the server.');
        log.push('Error message: '+err.message);
        sendLog();
        console.error('Communication error with server while execute PrivatePageModel.save()');
      });

    }
  });
  
  return PrivatePageModel;

});
