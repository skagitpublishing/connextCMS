/*global define*/
define([
	'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',
  'tinymce/tinymce.min',
  'bootstrap-datepicker.min',
  'text!../../../js/app/templates/postsAddNew.html'
], function ($, _, Backbone, TinyMCE, Datepicker, PostsAddNewTemplate) {
	'use strict';

	var PostsAddNewView = Backbone.View.extend({

		tagName:  'div',
    
    el: '#postsAddNewView', 

		template: _.template(PostsAddNewTemplate),

		// The DOM events specific to an item.
		events: {
			//'click .toggle':	'toggleCompleted',
			//'dblclick label':	'edit',
			//'click .destroy':	'clear',
			//'keypress .edit':	'updateOnEnter',
			//'keydown .edit':	'revertOnEscape',
			//'blur .edit':		'close'
      'click #submitPost': 'submitPost',
      'hidden.bs.modal #successWaitingModal': 'refreshView'
		}, 

		// The TodoView listens for changes to its model, re-rendering. Since there's
		// a one-to-one correspondence between a **Todo** and a **TodoView** in this
		// app, we set a direct reference on the model for convenience.
		initialize: function () {
			//this.listenTo(this.model, 'change', this.render);
			//this.listenTo(this.model, 'destroy', this.remove);
			//this.listenTo(this.model, 'visible', this.toggleVisible);
		},

		// Re-render the titles of the todo item.
		
    render: function () {
      
      
      //debugger;
      try {
        
        //if( tinymce.editors.length == 0 ) {
        if( (global.tinymce.initialized == false) || (global.tinymce.currentView != "posts") ) {
          
          log.push('Initializing TinyMCE editor...')

          //Rendering the template destroys the existing TinyMCE editor. I only want to render the template if the TinyMCE editor
          //hasn't been created yet.
          //this.$el.html(this.template(this.model.toJSON()));
          this.$el.html(this.template);
          
          //Fill out the Category drop-down
          this.$el.find('#category').find('option').text(global.postCategoryCollection.models[0].get('name')); //First category
          for( var i = 1; i < global.postCategoryCollection.models.length; i++ ) { //The rest of the categories
            this.$el.find('#category').append('<option>'+global.postCategoryCollection.models[i].get('name')+'</option>');
          }

          tinymce.init({
            selector: '#postContent',
            //menubar: 'edit view format insert',
            menubar: false,
            toolbar: 'bold, italic, underline, strikethrough, alignleft, aligncenter, alignright, alignjustify, bullist, numlist, outdent, indent, removeformat, subscript, superscript, link, formatselect, fontselect, image_gallery, code',
            plugins: 'code, image_gallery, link',
            extended_valid_elements: "a[class|name|href|target|title|onclick|rel|id],button[class|name|href|target|title|onclick|rel|id],script[type|src],iframe[src|style|width|height|scrolling|marginwidth|marginheight|frameborder],img[class|src|border=0|alt|title|hspace|vspace|width|height|align|onmouseover|onmouseout|name],$elements",
            relative_urls: false,
            convert_urls: false,
            remove_script_host: false,
            browser_spellcheck: true,
            image_caption: true,
            
            //The setup function runs when the TinyMCE editor has finished loading. It's kind of like the document.ready() function.
            setup: function (ed) {
              ed.on('init', function(args) {
                //debugger;  

                global.tinymce.initialized = true;
                global.tinymce.currentView = 'posts';
                log.push('TinyMCE editor initialized.')

                //User clicked on existing post and wants to edit it.
                if( global.tinymce.currentModelIndex != null ) {
                  global.postsAddNewView.loadPost(global.tinymce.currentModelIndex);
                  global.tinymce.currentModelIndex = null; //Clear to signal that this request has been processed.
                //User clicked on Add New link in left menu and wants to create a new post.
                } else {
                  global.postsAddNewView.newPost();
                }
              });
            },


          });
        //If the TinyMCE editor has already been loaded...
        } else {

          //User clicked on existing post and wants to edit it.
          if( global.tinymce.currentModelIndex != null ) {
            global.postsAddNewView.loadPost(global.tinymce.currentModelIndex);
            global.tinymce.currentModelIndex = null; //Clear to signal that this request has been processed.

          //User clicked on Add New link in left menu and wants to create a new post.
          } else {
            global.postsAddNewView.newPost();
          }
        }
        
        
        
      } catch(err) {
        console.error('Error while trying to render postsAddNewView. Error message: ');
        console.error(err.message);
        
        log.push('Error while trying to render postsAddNewView. Error message: ');
        log.push(err.message);
        sendLog();
      }
      
			return this;
		},
    
    //This function is called when the 'Add New' link is clicked on the left menu. It indicates the user wants
    //to create a new, blank post.
    newPost: function() {
      try {
        //debugger;
        this.$el.find('#postTitle').val('');
        tinymce.activeEditor.setContent('');

        //Create an empty model to store the post data.
        this.model = global.postsCollection.models[0].clone();
        this.model.id = "";
        this.model.set('_id', '');
        this.model.attributes.content.brief = '';
        this.model.attributes.content.extended = '';
        this.model.set('publishedDate', '');
        this.model.set('slug', '');
        this.model.set('title', '');
        this.model.set('state', 'draft');

        //Set published state drop-down to default to 'Draft'
        this.$el.find('#publishedState').val('Draft');
        
        //Set post author as currently logged in user.
        this.model.set('author', userdata._id);

        //Set default date to today.
        var today = new Date();
        this.model.set('publishedDate', today.getFullYear()+'-'+('00'+(today.getMonth()+1)).slice(-2)+'-'+('00'+(today.getDate()+1)).slice(-2));
        this.$el.find('#publishedDate').val(('00'+(today.getMonth()+1)).slice(-2)+'/'+('00'+(today.getDate()+1)).slice(-2)+'/'+today.getFullYear());

        //Hide the delete post button.
        this.$el.find('#deletePost').hide();
        
        log.push('Loaded new post.')
        
      } catch (err) {
        console.error('Error while trying to load newPost() in postsAddNewView. Error message: ');
        console.error(err.message);

        log.push('Error while trying to load newPost() in postsAddNewView. Error message: ');
        log.push(err.message);
        sendLog();
      }
    },
    
    //This function is called when the user clicks on an existing post in the 'Pages' View.
    loadPost: function(model_index) {
      try {

        //debugger;

        //Retrive the selected Post model from the postsCollection.
        this.model = global.postsCollection.models[model_index];

        //global.pagesAddNewView.postId = model.id;

        //Fill out the form on the pagesAddNewView with the content stored in the Post model.
        this.$el.find('#postTitle').val(this.model.get('title'));
        tinymce.activeEditor.setContent(this.model.get('content').extended);

        //Published state
        //Change the State drop-down based on the current Model. A lot of 'DOM walking'
        if( this.$el.find('#publishedState').find('option').first().text().toLowerCase() == this.model.get('state') ) {
          this.$el.find('#publishedState').val('Draft');
        } else if( this.$el.find('#publishedState').find('option').first().next().text().toLowerCase() == this.model.get('state') ) {
          this.$el.find('#publishedState').val('Published');
        } else if( this.$el.find('#publishedState').find('option').last().text().toLowerCase() == this.model.get('state') ) {
          this.$el.find('#publishedState').val('Archived');
        }
        
        //Set post author as currently logged in user.
        this.model.set('author', userdata._id);

        //Set the Date to the Model's date.
        var publishedDate = this.model.get('publishedDate'); //Get date string from model.
        publishedDate = new Date(publishedDate.slice(0,4), publishedDate.slice(5,7)-1, publishedDate.slice(8,10)); //Convert date string to Date object.
        //var datestr = (publishedDate.getMonth()+1)+'/'+publishedDate.getDate()+'/'+publishedDate.getFullYear();
        this.$el.find('#publishedDate').val(('00'+(publishedDate.getMonth()+1)).slice(-2)+'/'+('00'+(publishedDate.getDate())).slice(-2)+'/'+publishedDate.getFullYear());

        //Set the Category from the Model.
        for( var i = 0; i < global.postCategoryCollection.models.length; i++ ) { //Loop through all the post categories          
          //Corner case: If the page has no categories assigned to it, load the first category as default.
          if( this.$el.find('#category')[0] == undefined) {
            this.$el.find('#category').val(global.postCategoryCollection.models[0].get('name'));
            break;
          }

          //Find the category GUID that matches the one in the Model
          if( this.model.get('categories')[0] == global.postCategoryCollection.models[i].get('_id') ) {
            //Assign the corresponding category to this post.
            //this.model.set('categories', [global.postCategoryCollection.models[i].get('_id')]);
             this.$el.find('#category').val(global.postCategoryCollection.models[i].get('name'));
            //Break out of the loop.
            break;
          }
        }

        //Show the delete post button.
        this.$el.find('#deletePost').show();
        
        log.push('Loaded post '+this.model.get('title'));

      } catch (err) {
        console.error('Error while trying to loadPost() in pagesAddNewView. Error message: ');
        console.error(err.message);

        log.push('Error while trying to loadPost() in pagesAddNewView. Error message: ');
        log.push(err.message);
        sendLog();
      }
      
    },
    
    submitPost: function() {
      //debugger;
      
      //submission behavior is different if this is a new post or an existing post.
      if(this.model.id == "") { //New Post
        try {
        
          //debugger;

          //Don't try to create a new post without a title.
          if( this.$el.find('#postTitle').val() == "" ) {
            //debugger;
            global.postsAddNewView.$el.find('#successWaitingModal').find('h2').css('color', 'black');
            global.postsAddNewView.$el.find('#successWaitingModal').find('h2').text('Please give the page a title.');
            global.postsAddNewView.$el.find('#successWaitingModal').find('#waitingGif').hide();
            global.postsAddNewView.$el.find('#successWaitingModal').find('#successMsg').show();
            return;
          }
          
          //Don't try to create a new page without a title.
          if( this.$el.find('#pageTitle').val() == "" ) {
            
          }

          //Title and Slug
          var str = this.$el.find('#postTitle').val();
          this.model.set('title', str);
          str = str.replace(/ /g, '-');
          this.model.set('slug', str.toLowerCase());

          //Published state
          this.model.set('state', this.$el.find('#publishedState').val().toLowerCase());

          //Date
          //#publishedDate form field uses format MM/DD/YYYY
          //KeystoneJS model uses format YYYY-MM-DD
          var postDate = new Date(this.$el.find('#publishedDate').val());
          this.model.set('publishedDate', postDate.getFullYear()+'-'+('00'+(postDate.getMonth()+1)).slice(-2)+'-'+('00'+postDate.getDate()).slice(-2));

          //Set author to the currently logged in user
          this.model.set('author', userdata._id);

          //Set the Category for the new post.
          for( var i = 0; i < global.postCategoryCollection.models.length; i++ ) { //Loop through all the post categories          
            //Find the category that matches one selected in the drop-down.
            if( this.$el.find('#category').val() == global.postCategoryCollection.models[i].get('name') ) {
              //Assign the corresponding category to this post.
              this.model.set('categories', [global.postCategoryCollection.models[i].get('_id')]);
              //Break out of the loop.
              break;
            }
          }

          //Add Content
          this.model.attributes.content.extended = tinymce.activeEditor.getContent();

          //Send new Model to server
          $.get('http://'+global.serverIp+':'+global.serverPort+'/api/post/create', this.model.attributes, function(data) {
            //debugger;

            //The server will return the same object we submitted but with the _id field filled out. A non-blank _id field
            //represents a success.
            if( data.post._id != "" ) {
              
              log.push('New post '+data.post._id+' successfully updated.')

              global.postsAddNewView.$el.find('#successWaitingModal').find('h2').css('color', 'green');
              global.postsAddNewView.$el.find('#successWaitingModal').find('h2').text('Success!');
              global.postsAddNewView.$el.find('#successWaitingModal').find('#waitingGif').hide();
              global.postsAddNewView.$el.find('#successWaitingModal').find('#successMsg').show();
            } else { //Fail
              console.error('New post not accepted by server!')
            }
          });

          //debugger;
        } catch (err) {
          console.error('Error while trying to submit new post in postsAddNewView. Error message: ');
          console.error(err.message);

          log.push('Error while trying to submit new post in postsAddNewView. Error message: ');
          log.push(err.message);
          sendLog();
        }
        
      } else { //Existing post
        //debugger;
        try {
          //Date
          //#publishedDate form field uses format MM/DD/YYYY
          //KeystoneJS model uses format YYYY-MM-DD
          var postDate = new Date(this.$el.find('#publishedDate').val());
          postDate = postDate.getFullYear()+'-'+('00'+(postDate.getMonth()+1)).slice(-2)+'-'+('00'+postDate.getDate()).slice(-2);

          //Set the Category for the Model.
          for( var i = 0; i < global.postCategoryCollection.models.length; i++ ) { //Loop through all the post categories          

            //Find the category GUID that matches the one in the dropdown
            if( this.$el.find('#category').val() == global.postCategoryCollection.models[i].get('name') ) {
              //Assign the corresponding category to this post.
              this.model.set('categories', [global.postCategoryCollection.models[i].get('_id')]);
              //Break out of the loop.
              break;
            }
          }

          var content = this.model.get('content');
          content.extended = tinymce.activeEditor.getContent();

          this.model.set({
            'title': this.$el.find('#postTitle').val(),
            //Design Note: slug does not get updated.
            'state': this.$el.find('#publishedState').val().toLowerCase(),
            'publishedDate': postDate,
            'author': userdata._id,
            'content': content,
          });

          //Send new Model to server
          $.get('http://'+global.serverIp+':'+global.serverPort+'/api/post/'+this.model.id+'/update', this.model.attributes, function(data) {
            //debugger;

            //The server will return the same object we submitted but with the _id field filled out. A non-blank _id field
            //represents a success.
            if( data.post._id != "" ) {
              
              log.push('Post '+data.post._id+' successfully updated.')

              global.postsAddNewView.$el.find('#successWaitingModal').find('h2').css('color', 'green');
              global.postsAddNewView.$el.find('#successWaitingModal').find('h2').text('Success!');
              global.postsAddNewView.$el.find('#successWaitingModal').find('#waitingGif').hide();
              global.postsAddNewView.$el.find('#successWaitingModal').find('#successMsg').show();
            } else { //Fail
              console.error('Post '+data.post._id+' not updated!')
            }
          });
        
        //debugger;
        } catch (err) {
          console.error('Error while trying to update existing post in postsAddNewView. Error message: ');
          console.error(err.message);

          log.push('Error while trying to update existing post in postsAddNewView. Error message: ');
          log.push(err.message);
          sendLog();
        }
      }
    },
    
    deletePost: function() {
      //debugger;
      
      log.push('Preparing to delete post '+this.model.get('title')+' (id: '+this.model.id+')');
      
      $.get('http://'+global.serverIp+':'+global.serverPort+'/api/post/'+this.model.id+'/remove', '', function(data) {
        //debugger;
        if( data.success == true ) {
          log.push('Post successfully deleted.');
          
          global.postsCollection.refreshView = true;
          global.postsCollection.fetch(); //Update the posts collection.
          //global.leftMenuView.showPostsAddNew(); //Refresh the view 
          //global.leftMenuView.showPosts2(); //Need to wait until fetch completes. 
        } else {
          log.push('Post not deleted!');
          console.error('Error in function deletePost(). Post not deleted.');
        }
      });
    },
    
    //This function is called when the modal has completed closing. It refreshes the View to make sure
    //any new uploaded files appear in the file table.
    refreshView: function() {
      //debugger;
      
      //By refreshing the view after re-fetching the collection, this prevents a bug
      //When clicking the submit button a second time creates an identical, but new
      //page/post.
      global.postsCollection.refreshView = true;
      
      //Fetch/update the pagesCollection so that it includes the new page.
      global.postsCollection.fetch();
    },
    

	});

  //debugger;
	return PostsAddNewView;
});
