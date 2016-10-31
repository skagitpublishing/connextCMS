/*global define*/ 
define([
	'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',
  'tinymce/tinymce.min',
  'bootstrap-datepicker.min',
  'text!../../../js/app/templates/pagesAddNew.html'
], function ($, _, Backbone, TinyMCE, Datepicker, PagesAddNewTemplate) {
	'use strict';

	var PagesAddNewView = Backbone.View.extend({

		tagName:  'div',
    
    el: '#pagesAddNewView', 

		template: _.template(PagesAddNewTemplate),

		// The DOM events specific to an item.
		events: {
      'click #submitPage': 'submitPage',
      'click #deletePage': 'deletePage',
      //'hidden.bs.modal #successWaitingModal': 'refreshView',
      'change #section': 'changeSectionState',
      
		}, 

		initialize: function () {

		},
		
    render: function () {
      
      //debugger;
      try {
        
        //if( tinymce.editors.length == 0 ) {
        if( (global.tinymce.initialized == false) || (global.tinymce.currentView != "pages") ) {
          
          //Fix corner case where the tinyMCE needs to be removed in order to get the init event to fire.
          if((global.tinymce.currentView != "pages")) {
            if((global.tinymce.initialized == true)) {
              //debugger;
              tinymce.remove();
              global.tinymce.initialized = false;
            }
          }
          
          log.push('Initializing TinyMCE editor...')
          
          //Rendering the template destroys the existing TinyMCE editor. I only want to render the template if the TinyMCE editor
          //hasn't been created yet.
          this.$el.html(this.template);
          
          //Fill out the Section drop-down
          this.$el.find('#section').find('option').text(global.pageSectionCollection.models[0].get('name')); //First Section
          for( var i = 1; i < global.pageSectionCollection.models.length; i++ ) { //The rest of the sections
            this.$el.find('#section').append('<option>'+global.pageSectionCollection.models[i].get('name')+'</option>');
          }

          tinymce.init({
            selector: '#pageContent',
            //menubar: 'edit view format insert',
            menubar: false,
            toolbar: 'bold, italic, underline, strikethrough, alignleft, aligncenter, alignright, alignjustify, bullist, numlist, outdent, indent, removeformat, subscript, superscript, link, formatselect, fontselect, image_gallery, file_link, code',
            plugins: 'code, image_gallery, link, file_link',
            extended_valid_elements: "a[class|name|href|target|title|onclick|rel|id|download],button[class|name|href|target|title|onclick|rel|id],script[type|src],iframe[src|style|width|height|scrolling|marginwidth|marginheight|frameborder|allowfullscreen],img[class|src|border=0|alt|title|hspace|vspace|width|height|align|onmouseover|onmouseout|name],$elements",
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
                global.tinymce.currentView = 'pages';
                log.push('TinyMCE editor initialized.')

                //User clicked on existing page and wants to edit it.
                if( global.tinymce.currentModelIndex != null ) {
                  global.pagesAddNewView.loadPage(global.tinymce.currentModelIndex);
                  global.tinymce.currentModelIndex = null; //Clear to signal that this request has been processed.
                  
                //User clicked on Add New link in left menu and wants to create a new page.
                } else {
                  global.pagesAddNewView.newPage();
                }
              });
            },


          });
        //If the TinyMCE editor has already been loaded...
        } else {

          //User clicked on existing page and wants to edit it.
          if( global.tinymce.currentModelIndex != null ) {
            global.pagesAddNewView.loadPage(global.tinymce.currentModelIndex);
            global.tinymce.currentModelIndex = null; //Clear to signal that this request has been processed.

          //User clicked on Add New link in left menu and wants to create a new page.
          } else {
            global.pagesAddNewView.newPage();
          }
        }
        
      } catch(err) {
        console.error('Error while trying to render pagesAddNewView. Error message: ');
        console.error(err.message);
        
        log.push('Error while trying to render pagesAddNewView. Error message: ');
        log.push(err.message);
        sendLog();
      }
      
			return this;
		},
    
    //This function is called when the 'Add New' link is clicked on the left menu. It indicates the user wants
    //to create a new, blank page.
    newPage: function() {
      try {
        //debugger;
        this.$el.find('#pageTitle').val('');
        tinymce.activeEditor.setContent('');

        //Create an empty model to store the page data.
        this.model = global.pagesCollection.models[0].clone();
        this.model.id = "";
        this.model.set('_id', '');
        this.model.attributes.content.brief = '';
        this.model.attributes.content.extended = '';
        this.model.set('publishedDate', '');
        this.model.set('slug', '');
        this.model.set('title', '');
        this.model.set('state', 'draft');
        this.model.set('priority', 0);
        this.model.set('redirect', '');

        //Set published state drop-down to default to 'Draft'
        this.$el.find('#publishedState').val('Draft');
        
        //Set page author as currently logged in user.
        this.model.set('author', userdata._id);

        //Set default date to today.
        var today = new Date();
        this.model.set('publishedDate', today.getFullYear()+'-'+('00'+(today.getMonth()+1)).slice(-2)+'-'+('00'+(today.getDate()+1)).slice(-2));
        this.$el.find('#publishedDate').val(('00'+(today.getMonth()+1)).slice(-2)+'/'+('00'+(today.getDate()+1)).slice(-2)+'/'+today.getFullYear());

        //Set default priority to zero.
        this.$el.find('#pagePriority').val(0);
        
        //Set default redirect to blank
        this.$el.find('#pageRedirect').val('');
        
        //Hide the delete page button.
        this.$el.find('#deletePage').hide();
        
        log.push('Loaded new page.')
        
      } catch (err) {
        console.error('Error while trying to load newPage() in pagesAddNewView. Error message: ');
        console.error(err.message);

        log.push('Error while trying to load newPage() in pagesAddNewView. Error message: ');
        log.push(err.message);
        sendLog();
      }
    },
    
    //This function is called when the user clicks on an existing page in the 'Pages' View.
    loadPage: function(modelId) {
      try {
        //debugger;

        //Retrieve the correct model.
        var tempModel = global.pagesCollection.get(modelId);
        if(tempModel == undefined)
          //If the ID doesn't match a model in the pagesCollection, then it must exist in the privatePagesCollection.
          tempModel = global.privatePagesCollection.get(modelId);
        
        this.model = tempModel;

        //Fill out the form on the pagesAddNewView with the content stored in the Page model.
        this.$el.find('#pageTitle').val(this.model.get('title'));
        tinymce.activeEditor.setContent(this.model.get('content').extended);

        //Published state
        //Change the State drop-down based on the current Model.
        if( this.$el.find('#publishedState').find('option').first().text().toLowerCase() == this.model.get('state') ) {
          this.$el.find('#publishedState').val('Draft');
        } else if( this.$el.find('#publishedState').find('option').first().next().text().toLowerCase() == this.model.get('state') ) {
          this.$el.find('#publishedState').val('Published');
        } else if( this.$el.find('#publishedState').find('option').last().text().toLowerCase() == this.model.get('state') ) {
          this.$el.find('#publishedState').val('Archived');
        }
        
        //Set page author as currently logged in user.
        this.model.set('author', userdata._id);

        //Set the Date to the Model's date.
        var publishedDate = this.model.get('publishedDate'); //Get date string from model.
        publishedDate = new Date(publishedDate.slice(0,4), publishedDate.slice(5,7)-1, publishedDate.slice(8,10)); //Convert date string to Date object.
        //var datestr = (publishedDate.getMonth()+1)+'/'+publishedDate.getDate()+'/'+publishedDate.getFullYear();
        this.$el.find('#publishedDate').val(('00'+(publishedDate.getMonth()+1)).slice(-2)+'/'+('00'+(publishedDate.getDate())).slice(-2)+'/'+publishedDate.getFullYear());

        //Set the Section from the Model.
        for( var i = 0; i < global.pageSectionCollection.models.length; i++ ) { //Loop through all the page sections          
          
          //Corner case: If the page has no sections assigned to it, load the first Section as default.
          if( this.$el.find('#section')[0] == undefined) {
            this.$el.find('#section').val(global.pageSectionCollection.models[0].get('name'));
            break;
          }

          //Find the Section GUID that matches the one in the Model
          if( this.model.get('sections')[0] == global.pageSectionCollection.models[i].get('_id') ) {
            //Assign the corresponding Section to this page.
            //this.model.set('sections', [global.pageSectionCollection.models[i].get('_id')]);
            this.$el.find('#section').val(global.pageSectionCollection.models[i].get('name'));
            
            //If the section matches the one used for private pages, then set the state for this view to private.
            this.changeSectionState();
            
            //Break out of the loop.
            break;
          }
        }

        //Show the page priority
        this.$el.find('#pagePriority').val(this.model.get('priority'));
        
        //Show the pages redirect address
        this.$el.find('#pageRedirect').val(this.model.get('redirect'));
        
        //Show the delete page button.
        this.$el.find('#deletePage').show();
        
        log.push('Loaded page '+this.model.get('title'));

      } catch (err) {
        console.error('Error while trying to loadPage() in pagesAddNewView. Error message: ');
        console.error(err.message);

        log.push('Error while trying to loadPage() in pagesAddNewView. Error message: ');
        log.push(err.message);
        sendLog();
      }
      
    },
    
    submitPage: function() {
      //debugger;
      
      //submission behavior is different if this is a new page or an existing page.
      if(this.model.id == "") { //New Page
        try {
          //debugger;

          //Don't try to create a new page without a title.
          if( this.$el.find('#pageTitle').val() == "" ) {
            //debugger;
            global.modalView.errorModal('Please give the page a title.');
            return;
          }

          //Title and Slug
          var str = this.$el.find('#pageTitle').val();
          this.model.set('title', str);
          str = str.replace(/ /g, '-');
          this.model.set('slug', str.toLowerCase());

          //Published state
          this.model.set('state', this.$el.find('#publishedState').val().toLowerCase());

          //Date
          //#publishedDate form field uses format MM/DD/YYYY
          //KeystoneJS model uses format YYYY-MM-DD
          var pageDate = new Date(this.$el.find('#publishedDate').val());
          this.model.set('publishedDate', pageDate.getFullYear()+'-'+('00'+(pageDate.getMonth()+1)).slice(-2)+'-'+('00'+pageDate.getDate()).slice(-2));

          //Set author to the currently logged in user
          this.model.set('author', userdata._id);

          //Set the Section for the new page.
          for( var i = 0; i < global.pageSectionCollection.models.length; i++ ) { //Loop through all the page sections          
            //Find the Section that matches one selected in the drop-down.
            if( this.$el.find('#section').val() == global.pageSectionCollection.models[i].get('name') ) {
              //Assign the corresponding Section to this page.
              this.model.set('sections', [global.pageSectionCollection.models[i].get('_id')]);
              //Break out of the loop.
              break;
            }
          }

          //Set the Page Priority
          var priority = this.$el.find('#pagePriority').val();
          var testPriority = new Number(priority);
          //Test if entry is a number. Default to priority 0
          if( isNaN(testPriority) ) {            
            priority = 0;
          } else {
            //Test if entry is an integer. Default to priority = 0.
            if( testPriority == parseInt(testPriority,10) ) {
              priority = Number(priority);
            } else {
              priority = 0;
            }            
          }
          this.model.set('priority', priority);
          
          //Add Content
          this.model.attributes.content.extended = tinymce.activeEditor.getContent();

          //Set the pages redirect URL
          this.model.set('redirect', this.$el.find('#pageRedirect').val());
          
          //Send new Public page Model to server
          if(this.sectionState == "public") {
            $.get('/api/page/create', this.model.attributes, function(data) {
              //debugger;

              //The server will return the same object we submitted but with the _id field filled out. A non-blank _id field
              //represents a success.
              if( data.page._id != "" ) {

                log.push('New page '+data.page._id+' successfully updated.')

                //global.pagesAddNewView.$el.find('#successWaitingModal').find('h2').css('color', 'green');
                //global.pagesAddNewView.$el.find('#successWaitingModal').find('h2').text('Success!');
                //global.pagesAddNewView.$el.find('#successWaitingModal').find('#waitingGif').hide();
                //global.pagesAddNewView.$el.find('#successWaitingModal').find('#successMsg').show();
                global.modalView.successModal(global.pagesAddNewView.refreshView);
              } else { //Fail
                console.error('New page not accepted by server!')
              }
            })
            //If sending the data to the server fails:
            .fail(function( jqxhr, textStatus, error ) {
              debugger;

              var err = textStatus + ", " + error;

              try {
                if(jqxhr.responseJSON.detail == "invalid csrf") {
                  global.modalView.errorModal('Update failed due to a bad CSRF token. Please log out and back in to refresh your CSRF token.');
                  return;
                } else {
                  global.modalView.errorModal("Request failed because of: "+error+'. Error Message: '+jqxhr.responseText);
                  console.log( "Request Failed: " + error );
                  console.error('Error message: '+jqxhr.responseText);
                }
              } catch(err) {
                console.error('Error trying to retrieve JSON data from server response.');
              }            
            });
          
          //Send Private pages to a different api.
          } else if(this.sectionState == "private") {
            //debugger;
            
            //Create a new privatepage model and move the data into it.
            var newPrivatePage = global.privatePageModel.clone();
            newPrivatePage.set('author', this.model.get('author'));
            newPrivatePage.set('content', this.model.get('content'));
            newPrivatePage.set('priority', this.model.get('priority'));
            newPrivatePage.set('publishedDate', this.model.get('publishedDate'));
            newPrivatePage.set('redirect', this.model.get('redirect'));
            newPrivatePage.set('sections', this.model.get('sections'));
            newPrivatePage.set('slug', this.model.get('slug'));
            newPrivatePage.set('state', this.model.get('state'));
            newPrivatePage.set('title', this.model.get('title'));
            
            $.get('/api/privatepage/create', newPrivatePage.attributes, function(data) {
              //debugger;

              //The server will return the same object we submitted but with the _id field filled out. A non-blank _id field
              //represents a success.
              if( data.page._id != "" ) {

                log.push('New private page '+data.page._id+' successfully updated.')

                //global.pagesAddNewView.$el.find('#successWaitingModal').find('h2').css('color', 'green');
                //global.pagesAddNewView.$el.find('#successWaitingModal').find('h2').text('Success!');
                //global.pagesAddNewView.$el.find('#successWaitingModal').find('#waitingGif').hide();
                //global.pagesAddNewView.$el.find('#successWaitingModal').find('#successMsg').show();
                global.modalView.successModal(global.pagesAddNewView.refreshView);
                
              } else { //Fail
                console.error('New private page not accepted by server!')
              }
            })
            //If sending the data to the server fails:
            .fail(function( jqxhr, textStatus, error ) {
              debugger;

              var err = textStatus + ", " + error;

              try {
                if(jqxhr.responseJSON.detail == "invalid csrf") {
                  global.modalView.errorModal('Update failed due to a bad CSRF token. Please log out and back in to refresh your CSRF token.');
                  return;
                } else {
                  global.modalView.errorModal("Request failed because of: "+error+'. Error Message: '+jqxhr.responseText);
                  console.log( "Request Failed: " + error );
                  console.error('Error message: '+jqxhr.responseText);
                }
              } catch(err) {
                console.error('Error trying to retrieve JSON data from server response.');
              }            
            });
            
          //Error handling
          } else {
            console.log('Unexpected state! sectionState = '+this.sectionState);
            alert('Problem determining if this is a private or public page! Page not saved.');
            return;
          }

          //debugger;
        } catch (err) {
          console.error('Error while trying to submit new page in pagesAddNewView. Error message: ');
          console.error(err.message);

          log.push('Error while trying to submit new page in pagesAddNewView. Error message: ');
          log.push(err.message);
          sendLog();
        }
        
      } else { //Existing page
        //debugger;
        
        try {
          
          //Don't try to update page without a title.
          if( this.$el.find('#pageTitle').val() == "" ) {
            //debugger;
            global.modalView.errorModal('Please give the page a title.');
            return;
          }
          
          //Date
          //#publishedDate form field uses format MM/DD/YYYY
          //KeystoneJS model uses format YYYY-MM-DD
          var pageDate = new Date(this.$el.find('#publishedDate').val());
          pageDate = pageDate.getFullYear()+'-'+('00'+(pageDate.getMonth()+1)).slice(-2)+'-'+('00'+pageDate.getDate()).slice(-2);

          //Set the Section for the Model.
          for( var i = 0; i < global.pageSectionCollection.models.length; i++ ) { //Loop through all the page sections          

            //Find the Section GUID that matches the one in the dropdown
            if( this.$el.find('#section').val() == global.pageSectionCollection.models[i].get('name') ) {
              //Assign the corresponding Section to this page.
              this.model.set('sections', [global.pageSectionCollection.models[i].get('_id')]);
              
              //Break out of the loop.
              break;
            }
          }
          
          //Set the Page Priority
          var priority = this.$el.find('#pagePriority').val();
          var testPriority = new Number(priority);
          //Test if entry is a number. Default to priority 0
          if( isNaN(testPriority) ) {            
            priority = 0;
          } else {
            //Test if entry is an integer. Default to priority = 0.
            if( testPriority == parseInt(testPriority,10) ) {
              priority = Number(priority);
            } else {
              priority = 0;
            }            
          }
          this.model.set('priority', priority);

          //Set the pages redirect URL
          this.model.set('redirect', this.$el.find('#pageRedirect').val());
          
          var content = this.model.get('content');
          content.extended = tinymce.activeEditor.getContent();

          this.model.set({
            'title': this.$el.find('#pageTitle').val(),
            //Design Note: slug does not get updated.
            'state': this.$el.find('#publishedState').val().toLowerCase(),
            'publishedDate': pageDate,
            'author': userdata._id,
            'content': content,
          });

          //Send new Model to server
          //Public Pages
          if(this.sectionState == "public") {
            //debugger;
            
            //If this was a privatepage that has been converted to a public page...
            if(this.model.url.indexOf('privatepage') != -1) {
              
              //...convert the data from private to public.
              this.movePrivateToPublic(this.model);
              
              
            //Normal operation: updating a public page.
            } else {

              $.get('/api/page/'+this.model.id+'/update', this.model.attributes, function(data) {
                //debugger;

                //The server will return the same object we submitted but with the _id field filled out. A non-blank _id field
                //represents a success.
                if( data.page._id != "" ) {
                  //Fetch/update the pagesCollection so that it includes the new page.
                  //global.pagesCollection.fetch();
                  //Accomplished when closing modal by refreshView()

                  log.push('Existing Public Page '+data._id+' successfully updated.');

                  //global.pagesAddNewView.$el.find('#successWaitingModal').find('h2').css('color', 'green');
                  //global.pagesAddNewView.$el.find('#successWaitingModal').find('h2').text('Success!');
                  //global.pagesAddNewView.$el.find('#successWaitingModal').find('#waitingGif').hide();
                  //global.pagesAddNewView.$el.find('#successWaitingModal').find('#successMsg').show();
                  global.modalView.successModal(global.pagesAddNewView.refreshView);
                } else { //Fail
                  console.error('Page'+data._id+' not updated!')
                }
              })
              //If sending the data to the server fails:
              .fail(function( jqxhr, textStatus, error ) {
                debugger;

                var err = textStatus + ", " + error;

                try {
                  if(jqxhr.responseJSON.detail == "invalid csrf") {
                    global.modalView.errorModal('Update failed due to a bad CSRF token. Please log out and back in to refresh your CSRF token.');
                    return;
                  } else {
                    global.modalView.errorModal("Request failed because of: "+error+'. Error Message: '+jqxhr.responseText);
                    console.log( "Request Failed: " + error );
                    console.error('Error message: '+jqxhr.responseText);
                  }
                } catch(err) {
                  console.error('Error trying to retrieve JSON data from server response.');
                }            
              });
            }
          
          //Private Pages
          } else {
            //debugger;
            
            //If this was a public page that has been converted to a private page...
            if(this.model.url.indexOf('api/page') != -1) {
              
              //...convert to private.
              this.movePublicToPrivate(this.model);
              
              
            //Normal operation: updating a private page.
            } else {
            
              $.get('/api/privatepage/'+this.model.id+'/update', this.model.attributes, function(data) {
                //debugger;

                //The server will return the same object we submitted but with the _id field filled out. A non-blank _id field
                //represents a success.
                if( data.page._id != "" ) {
                  //Fetch/update the pagesCollection so that it includes the new page.
                  //global.pagesCollection.fetch();
                  //Accomplished when closing modal by refreshView()

                  log.push('Existing Private Page '+data._id+' successfully updated.');

                  //global.pagesAddNewView.$el.find('#successWaitingModal').find('h2').css('color', 'green');
                  //global.pagesAddNewView.$el.find('#successWaitingModal').find('h2').text('Success!');
                  //global.pagesAddNewView.$el.find('#successWaitingModal').find('#waitingGif').hide();
                  //global.pagesAddNewView.$el.find('#successWaitingModal').find('#successMsg').show();
                  global.modalView.successModal(global.pagesAddNewView.refreshView);
                } else { //Fail
                  console.error('Private Page'+data._id+' not updated!')
                }
              })
              //If sending the data to the server fails:
              .fail(function( jqxhr, textStatus, error ) {
                debugger;

                var err = textStatus + ", " + error;

                try {
                  if(jqxhr.responseJSON.detail == "invalid csrf") {
                    global.modalView.errorModal('Update failed due to a bad CSRF token. Please log out and back in to refresh your CSRF token.');
                    return;
                  } else {
                    global.modalView.errorModal("Request failed because of: "+error+'. Error Message: '+jqxhr.responseText);
                    console.log( "Request Failed: " + error );
                    console.error('Error message: '+jqxhr.responseText);
                  }
                } catch(err) {
                  console.error('Error trying to retrieve JSON data from server response.');
                }            
              });
            }
          }
        
        //debugger;
        } catch (err) {
          console.error('Error while trying to update existing  in pagesAddNewView. Error message: ');
          console.error(err.message);

          log.push('Error while trying to update existing  in pagesAddNewView. Error message: ');
          log.push(err.message);
          sendLog();
        }
      }
    },
    
    deletePage: function() { 
      //debugger;
      
      var ans = confirm('Are you sure you want to delete this page?');

      if(ans) { 
        
        //Private Page
        if(this.model.url.indexOf('privatepage') != -1) {

          //debugger;

          log.push('Preparing to delete Private Page '+this.model.get('title')+' (id: '+this.model.id+')');

          $.get('/api/privatepage/'+this.model.id+'/remove', '', function(data) {
            //debugger;
            if( data.success == true ) {
              log.push('Private Page successfully deleted.');

              global.privatePagesCollection.refreshView = true;
              global.privatePagesCollection.fetch(); //Update the pages collection.

            } else {
              log.push('Private Page not deleted!');
              console.error('Error in function deletePage(). Page not deleted.');
            }
          })
          //If sending the data to the server fails:
          .fail(function( jqxhr, textStatus, error ) {
            debugger;
            
            var err = textStatus + ", " + error;
            
            try {
              if(jqxhr.responseJSON.detail == "invalid csrf") {
                global.modalView.errorModal('Update failed due to a bad CSRF token. Please log out and back in to refresh your CSRF token.');
                return;
              } else {
                global.modalView.errorModal("Request failed because of: "+error+'. Error Message: '+jqxhr.responseText);
                console.log( "Request Failed: " + error );
                console.error('Error message: '+jqxhr.responseText);
              }
            } catch(err) {
              console.error('Error trying to retrieve JSON data from server response.');
            }            
          });

        //Public Page
        } else {

          log.push('Preparing to delete Public Page '+this.model.get('title')+' (id: '+this.model.id+')');

          $.get('/api/page/'+this.model.id+'/remove', '', function(data) {
            //debugger;
            if( data.success == true ) {
              log.push('Page successfully deleted.');

              global.pagesCollection.refreshView = true;
              global.pagesCollection.fetch(); //Update the pages collection.

            } else {
              log.push('Page not deleted!');
              console.error('Error in function deletePage(). Page not deleted.');
            }
          })
          //If sending the data to the server fails:
          .fail(function( jqxhr, textStatus, error ) {
            debugger;
            
            var err = textStatus + ", " + error;
            
            try {
              if(jqxhr.responseJSON.detail == "invalid csrf") {
                global.modalView.errorModal('Update failed due to a bad CSRF token. Please log out and back in to refresh your CSRF token.');
                return;
              } else {
                global.modalView.errorModal("Request failed because of: "+error+'. Error Message: '+jqxhr.responseText);
                console.log( "Request Failed: " + error );
                console.error('Error message: '+jqxhr.responseText);
              }
            } catch(err) {
              console.error('Error trying to retrieve JSON data from server response.');
            }            
          });
        }
        
      }
    },
    
    //This function is called when the modal has completed closing. It refreshes the View to make sure
    //any new uploaded files appear in the file table.
    refreshView: function() {
      
      //debugger;
      
      //By refreshing the view after re-fetching the collection, this prevents a bug
      //When clicking the submit button a second time creates an identical, but new
      //page/post.
      global.pagesCollection.refreshView = true;
      global.privatePagesCollection.refreshView = true;
      
      //Fetch/update the pagesCollection so that it includes the new page. 
      global.pagesCollection.fetch();
      global.privatePagesCollection.fetch()
    },
    
    //This state variable and function are used to determine weather the information should be sent to the Pages or PrivatePages API.
    //The function is called anytime the Section drop-down is changed.
    sectionState: "public",
    changeSectionState: function() {
      //debugger;
      
      try {

        //Get the name of the private section.
        var privateSection = global.pageSectionCollection.get(global.privatePagesSection).get('name');

        //Switch the state to 'private' if the drop-down matches.
        if(privateSection == this.$el.find('#section').val()) {
          this.sectionState = "private";

        //Otherwise set the state to public.
        } else {
          this.sectionState = "public";
        }
      
      //This catch statement will activate if the user did not set up a private page section.
      //In this case, the sectionState should default to public.
      } catch(err) {
        this.sectionState = "public";
      }
    },
    
    //This function is used to move data from the /api/pages to /api/privatepages. 
    //Inputs: A GUID for the pages model must be supplied.
    //Outputs: A URL to the new model.
    movePublicToPrivate: function(publicModel) {
      //debugger;
      
      //Send new Private page Model to server
      $.get('/api/privatepage/create', publicModel.attributes, function(data) {
        //debugger;

        //Delete the old public model.
        $.get('/api/page/'+publicModel.id+'/remove', '', function(data) {
          //debugger;
          
          if( data.success == true ) {
            log.push('Public Page successfully deleted.');

            //global.pagesCollection.refreshView = true;
            //global.pagesCollection.fetch(); //Update the pages collection.

          } else {
            log.push('Public Page not deleted!');
            console.error('Error in function movePublictoPrivate(). Public Page not deleted.');
          }
        })
        //If sending the data to the server fails:
        .fail(function( jqxhr, textStatus, error ) {
          debugger;

          var err = textStatus + ", " + error;

          try {
            if(jqxhr.responseJSON.detail == "invalid csrf") {
              global.modalView.errorModal('Update failed due to a bad CSRF token. Please log out and back in to refresh your CSRF token.');
              return;
            } else {
              global.modalView.errorModal("Request failed because of: "+error+'. Error Message: '+jqxhr.responseText);
              console.log( "Request Failed: " + error );
              console.error('Error message: '+jqxhr.responseText);
            }
          } catch(err) {
            console.error('Error trying to retrieve JSON data from server response.');
          }            
        });
        
        //The server will return the same object we submitted but with the _id field filled out. A non-blank _id field
        //represents a success.
        if( data.page._id != "" ) {

          log.push('Page '+data.page._id+' successfully created and data moved from public to private.')

          //Update Modal. This also triggers a refresh of the page collections when the modal is closed.
          global.modalView.successModal(global.pagesAddNewView.refreshView);
        } else { //Fail
          console.error('Page update and move from public to private attempted... request not accepted by server!')
        }
      })
      //If sending the data to the server fails:
      .fail(function( jqxhr, textStatus, error ) {
        debugger;

        var err = textStatus + ", " + error;

        try {
          if(jqxhr.responseJSON.detail == "invalid csrf") {
            global.modalView.errorModal('Update failed due to a bad CSRF token. Please log out and back in to refresh your CSRF token.');
            return;
          } else {
            global.modalView.errorModal("Request failed because of: "+error+'. Error Message: '+jqxhr.responseText);
            console.log( "Request Failed: " + error );
            console.error('Error message: '+jqxhr.responseText);
          }
        } catch(err) {
          console.error('Error trying to retrieve JSON data from server response.');
        }            
      });
    },
    
    //This function is used to move data from the /api/privatepages to /api/pages. A GUID for the privatepages model must be supplied.
    //Inputs: A private page model must be supplied.
    //Outputs: A URL to the new model.
    movePrivateToPublic: function(privateModel) {
      //debugger;
   
      //Send new Public page Model to server
      $.get('/api/page/create', privateModel.attributes, function(data) {
        //debugger;

        //Delete the old private model.
        $.get('/api/privatepage/'+privateModel.id+'/remove', '', function(data) {
          //debugger;
          
          if( data.success == true ) {
            log.push('Private Page successfully deleted.');

            //global.pagesCollection.refreshView = true;
            //global.pagesCollection.fetch(); //Update the pages collection.

          } else {
            log.push('Private Page not deleted!');
            console.error('Error in function movePrivateToPublic(). Private Page not deleted.');
          }
        })
        //If sending the data to the server fails:
        .fail(function( jqxhr, textStatus, error ) {
          debugger;

          var err = textStatus + ", " + error;

          try {
            if(jqxhr.responseJSON.detail == "invalid csrf") {
              global.modalView.errorModal('Update failed due to a bad CSRF token. Please log out and back in to refresh your CSRF token.');
              return;
            } else {
              global.modalView.errorModal("Request failed because of: "+error+'. Error Message: '+jqxhr.responseText);
              console.log( "Request Failed: " + error );
              console.error('Error message: '+jqxhr.responseText);
            }
          } catch(err) {
            console.error('Error trying to retrieve JSON data from server response.');
          }            
        });
        
        //The server will return the same object we submitted but with the _id field filled out. A non-blank _id field
        //represents a success.
        if( data.page._id != "" ) {

          log.push('Page '+data.page._id+' successfully created and data moved from private to public.')

          //Update Modal. This also triggers a refresh of the page collections when the modal is closed.
          //global.pagesAddNewView.$el.find('#successWaitingModal').find('h2').css('color', 'green');
          //global.pagesAddNewView.$el.find('#successWaitingModal').find('h2').text('Success!');
          //global.pagesAddNewView.$el.find('#successWaitingModal').find('#waitingGif').hide();
          //global.pagesAddNewView.$el.find('#successWaitingModal').find('#successMsg').show();
          global.modalView.successModal(global.pagesAddNewView.refreshView);
        } else { //Fail
          console.error('Page update and move from private to public attempted... request not accepted by server!')
        }
      })
      //If sending the data to the server fails:
      .fail(function( jqxhr, textStatus, error ) {
        debugger;

        var err = textStatus + ", " + error;

        try {
          if(jqxhr.responseJSON.detail == "invalid csrf") {
            global.modalView.errorModal('Update failed due to a bad CSRF token. Please log out and back in to refresh your CSRF token.');
            return;
          } else {
            global.modalView.errorModal("Request failed because of: "+error+'. Error Message: '+jqxhr.responseText);
            console.log( "Request Failed: " + error );
            console.error('Error message: '+jqxhr.responseText);
          }
        } catch(err) {
          console.error('Error trying to retrieve JSON data from server response.');
        }            
      });
    },
    

	});

  //debugger;
	return PagesAddNewView;
});
