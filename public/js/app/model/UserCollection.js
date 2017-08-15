define([
  'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',
  './UserModel',
], function ($, _, Backbone, UserModel) { 

  
  //Create an empty Collection to hold all the posts.
  var UserCollection = Backbone.Collection.extend({ //Collection Class
    model: UserModel,
    //url: 'http://'+global.serverIp+':'+global.serverPort+'/api/post/list',
    url: '',

    //parse is called when data is returned from the server after a fetch() call.
    //Parse allows me to massage non-standard data before it is returned to the collection.
    parse: function(response) {
      //debugger;
      
      if(response.user.length == 0) {
        log.push('Empty data returned by server when trying to retrieve User models. Most likely due to a new DB.');
        return [global.userModel];
      } else {
        return response.user;
      }
    },

    refreshView: false, 
    
    initialize: function() {
      //This function is often used for debugging, so leave it here.
      //this.on('change', function(model) {
      //  debugger;
      //});

      this.url = '/api/users/list';
      
      this.on('add', function() {
        debugger;
      });

      this.on('reset', function() {
        //debugger;
        
        log.push('Finished retrieving UserCollection data from server.');

      });
    }
  });
  
  return UserCollection;

});