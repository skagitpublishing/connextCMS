/*global define*/
define([
	'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',
  'text!../../../js/app/templates/posts.html'
], function ($, _, Backbone, PostsTemplate) {
	'use strict';

	var PostsView = Backbone.View.extend({

		tagName:  'div',
    
    el: '#postsView',  

		template: _.template(PostsTemplate),

		// The DOM events specific to an item.
		events: {

		},

		initialize: function () {

		},

    render: function () {      
      //debugger;
      
      this.$el.html(this.template);

      this.populateTable();
      
      this.loadHelp();
      
			return this;
		},
    
    populateTable: function() {
      //debugger;
      
      //Get a the sortIndex based on the date entry of the posts.
      var sortIndex = this.getDateIndex();
      
      //Loop through each model in the collection.
      //for( var i = 0; i < global.postsCollection.length; i++ ) {
      for( var i = global.postsCollection.length-1; i > -1; i-- ) { //Show newest first
      
        try {
          //debugger;

          var model = global.postsCollection.models[i];
          
          //Handle corner case of new install with empty DB
          if( (global.postsCollection.models.length == 1) && (model.id == "") ) {
            return;
          }
          
          //Clone the example row provided in the template.
          var tempRow = global.postsView.$el.find('#postRow').clone();

          //Clear the ID copied from the example row.
          tempRow.attr('id', '');

          //Populate the new row with data from the model.
          var postTitle = model.get('title');
          tempRow.find('th').html('<a href="#/">'+postTitle+'</a>');
          tempRow.find('th').find('a').attr('onclick', 'global.postsView.editPost('+i+')');
        
          //Cross-reference the author ID with a name from the userCollection. Display the authors name.
          var authorId = model.get('author');
          for(var j=0; j < global.userCollection.length; j++) {
            var thisUser = global.userCollection.models[j];
            if(authorId == thisUser.id) {
              var userName = thisUser.get('name');
              tempRow.find('.postAuthor').text(userName.first+' '+userName.last);
              break;
            }
          }
          
          //Find and display the category name for this post.
          for( var j=0; j < global.postCategoryCollection.models.length; j++ ) {
            //To-Do: handle posts that are assigned no sections.
            var postCategoryGUID = model.get('categories')[0];
            
            //Match up the GUIDs and display the name of the matching category.
            if( global.postCategoryCollection.models[j].id == postCategoryGUID ) {
              tempRow.find('.postCategories').text(global.postCategoryCollection.models[j].get('name'));
              break;
            }
          }

          var publishedDate = model.get('publishedDate'); //Get date string from model.
          publishedDate = new Date(publishedDate.slice(0,4), publishedDate.slice(5,7)-1, publishedDate.slice(8,10)); //Convert date string to Date object.
          var datestr = (publishedDate.getMonth()+1)+'/'+publishedDate.getDate()+'/'+publishedDate.getFullYear();
          tempRow.find('.postDate').text(datestr);

          //Remove the 'hidden' attribute copied from the example row.
          tempRow.show();

          //Append the new row to the DOM.
          global.postsView.$el.find('#postsTable').append(tempRow);
          
        } catch(err) {
          console.error('Error encountered in postsView.populateTable(). Error message:');
          console.error(err.message);
          
          log.push('Error encountered in postsView.populateTable(). Error message:')
          log.push(err.message)
          sendLog();
        }
        
      }
      
    },
    
    editPost: function(model_index) {
      //debugger;
      
      $('#postsView').hide();
      $('#postsAddNewView').show();
      
      $('#app-location').text('Posts : Edit Post');
      
      //Load the currently selected model into the TinyMCE state variable so that once
      //the TinyMCE editor has been loaded, it knows which model to load.
      global.tinymce.currentModelIndex = model_index;
      
      //Render the Add New pages View view.
      global.postsAddNewView.render();
      
    },
    
    loadHelp: function() {
      //debugger;
      $('#control-sidebar-home-tab').empty();
      
      var wrapperHeight = $('.content-wrapper').height();
      
      //console.log($('.wrapper').height());
      $('#control-sidebar-home-tab').css('overflow-y', 'scroll');
      $('#control-sidebar-home-tab').load('/documentation/core/posts.html', function() {
        $('#control-sidebar-home-tab').height(wrapperHeight);
      });
    },
    
    // This function generates a sorted index of entries in the global.postsCollection
    // based on published date.
    getDateIndex: function() {
      
      //Error handling
      if(global.postsCollection.length == 0)
        return;
      
      //Fill the unsortedDates array with numeric timestamps.
      var unsortedDates = [];
      var unsortedIndex = [];
      var sortedItems = [];
      for(var i=0; i < global.postsCollection.length; i++) {
        var thisDate = new Date(global.postsCollection.models[i].get('publishedDate'));
        unsortedDates.push(thisDate.getTime());
        unsortedIndex.push(i);
        sortedItems.push({dateStamp: thisDate.getTime(), index: i});
      }
      
      debugger;
    }
    

	});

  //debugger;
	return PostsView;
});