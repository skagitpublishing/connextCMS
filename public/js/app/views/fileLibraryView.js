/*global define*/
define([
	'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',
  'text!../../../js/app/templates/fileLibrary.html'
], function ($, _, Backbone, FileLibraryTemplate) {
	'use strict';

	var FileLibraryView = Backbone.View.extend({

		tagName:  'div',
    
    el: '#fileLibraryView', 

		template: _.template(FileLibraryTemplate),

		// The DOM events specific to an item.
		events: {
			//'click .toggle':	'toggleCompleted',
			//'dblclick label':	'edit',
			//'click .destroy':	'clear',
			//'keypress .edit':	'updateOnEnter',
			//'keydown .edit':	'revertOnEscape',
			//'blur .edit':		'close'
      'hidden.bs.modal #fileLibraryModal': 'refreshView'
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
      this.$el.html(this.template);
      //global.pagesView.populateTable();
      this.populateTable();
      
      //debugger;
      
      //$('#dashboardView').hide();
      //$('#pagesView').show();
      
			//this.toggleVisible();
			//this.$input = this.$('.edit');
			return this;
		},
    
    populateTable: function() {
      //debugger;
      
      //Loop through each model in the collection.
      //global.postsCollection.forEach( function(model) {
      for( var i = 0; i < global.fileUploadCollection.length; i++ ) {
      
        try {
          //debugger;

          var model = global.fileUploadCollection.models[i];
          
          //Handle corner case of new install with empty DB
          if( (global.fileUploadCollection.models.length == 1) && (model.id == "") ) {
            return;
          }
          
          //Clone the example row provided in the template.
          var tempRow = global.fileLibraryView.$el.find('#fileRow').clone();

          //Clear the ID copied from the example row.
          tempRow.attr('id', '');

          //Populate the new row with data from the model.
          var fileName = model.get('fileName');
          tempRow.find('th').html('<a href="#/">'+fileName+'</a>');
          tempRow.find('th').find('a').attr('onclick', 'global.fileLibraryView.editPost('+i+')');
          
          //Add the on-click function to the Delete button.
          tempRow.find('.postCol4').find('button').attr('onclick', 'global.fileLibraryView.deleteFile(global.fileUploadCollection.models['+i+'].id)');
          
          //tempRow.find('.postAuthor').text(model.get('author'));
          //tempRow.find('.postCategories').text(model.get('categories').join(','));

          //var publishedDate = new Date(model.get('publishedDate'));
          //var datestr = (publishedDate.getMonth()+1)+'/'+publishedDate.getDate()+'/'+publishedDate.getFullYear();
          //tempRow.find('.postDate').text(datestr);

          //Remove the 'hidden' attribute copied from the example row.
          tempRow.show();

          //Append the new row to the DOM.
          global.fileLibraryView.$el.find('#filesTable').append(tempRow);
        } catch(err) {
          console.error('Error encountered in fileLibraryView.populateTable(). Error message:');
          console.error(err.message);
          
          log.push('Error encountered in fileLibraryView.populateTable(). Error message:')
          log.push(err.message)
          sendLog();
        }
        
      }
      //});
      
      
    },
    
    editPost: function(model_index) {
      debugger;
      
      //$('#pagesView').hide();
      //$('#pagesAddNewView').show();
      
      //$('#app-location').text('Pages : Edit Post');
      
      //Load the currently selected model into the TinyMCE state variable so that once
      //the TinyMCE editor has been loaded, it knows which model to load.
      //global.tinymce.currentModelIndex = model_index;
      
      //Render the Add New pages View view.
      //global.pagesAddNewView.render();
      
      //global.pagesAddNewView.loadPost(model_index);
    },
    
    uploadFile: function() {
      //debugger;
      
      var selectedFile = this.$el.find('#file_upload').get(0).files[0];
      
      //Create the FormData data object and append the file to it.
      var newFile = new FormData();
      newFile.append('file_upload', selectedFile); //This is the raw file that was selected

      var opts = {
        url: 'http://'+global.serverIp+':'+global.serverPort+'/api/fileupload/create',
        data: newFile,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        success: function(data){
          //Dev Note: KeystoneAPI only allows file and image uploads with the file itself. Any extra metadata will have to
          //be uploaded/updated with a second call.
          
          //debugger;
          console.log('File upload succeeded! ID: ' + data.file_upload._id);
          log.push('File upload succeeded! ID: ' + data.file_upload._id);

          //Fill out the file information
          data.file_upload.name = data.file_upload.file.originalname;
          data.file_upload.fileName = data.file_upload.file.originalname;
          data.file_upload.url = 'http://'+global.serverIp+'/uploads/files/'+data.file_upload.file.filename;
          data.file_upload.fileType = data.file_upload.file.type;
          
          //Update the file with the information above.
          $.get('http://'+global.serverIp+':'+global.serverPort+'/api/fileupload/'+data.file_upload._id+'/update', data.file_upload, function(data) {
            //debugger;
            log.push('File information updated.');
            
            //Refresh the Collection.
            //global.fileUploadCollection.refreshView = true; //Set flag so view is refreshed after collection is updated.
            global.fileUploadCollection.fetch(); 
            
            //Notify successful upload via modal.
            global.fileLibraryView.$el.find('.modal-sm').find('#waitingGif').hide();
            global.fileLibraryView.$el.find('.modal-sm').find('#successMsg').show();
            //global.fileLibraryView.render();
          })
          //If the metadata update fails:
          .fail(function(data) {
            debugger;
          });
        },
        
        //This error function is called if the POST fails for submitting the file itself.
        error: function(err) {
          //debugger;
          
          global.fileLibraryView.$el.find('.modal-sm').find('#waitingGif').hide();
          global.fileLibraryView.$el.find('.modal-sm').find('#errorMsg').show();
          global.fileLibraryView.$el.find('.modal-sm').find('#errorMsg').html(
            '<p>The file was not uploaded to the server. This is most likely because the server does not accept the selected file TYPE.<br><br>'+
            'Here is the error message from the server: <br>'+
            'Server status: '+err.status+'<br>'+
            'Server message: '+err.statusText+'<br></p>'
          );
          
          
        }
      };

      //Execute the AJAX operation.
      jQuery.ajax(opts);
    },
    
    fileSelected: function() {
      //debugger;

    },
    
    //This function is called when the modal has completed closing. It refreshes the View to make sure
    //any new uploaded files appear in the file table.
    refreshView: function() {
      //debugger;
      
      //Fixing bug where modal backdrop stays in place.
      $('.modal-backdrop').hide();
      
      this.render();
    },
    
    
    deleteFile: function(id) {
      //debugger;
      $.get('http://'+global.serverIp+':'+global.serverPort+'/api/fileupload/'+id+'/remove', '', function(data) {
        //debugger;
        
        if( data.success == true ) {
          log.push('FileUpload object deleted successfully. ID: '+id);
          global.fileUploadCollection.refreshView = true; //Set flag so view is refreshed after collection is updated.
          global.fileUploadCollection.fetch();
          //global.fileLibraryView.render();
        } else {
          console.error('FileUpload object no deleted! ID: '+id);
          log.push('FileUpload object no deleted! ID: '+id);
          sendLog();
        }
      })
    }
    

	});

  //debugger;
	return FileLibraryView;
});
