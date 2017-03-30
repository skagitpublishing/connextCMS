/*global define*/
define([
	'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',
  'text!../../../js/app/templates/imageLibrary.html',
  'logs'
], function ($, _, Backbone, ImageLibraryTemplate, Logs) {
	'use strict';

	var ImageLibraryView = Backbone.View.extend({

		tagName:  'div',
    
    el: '#imageLibraryView', 

		template: _.template(ImageLibraryTemplate),

		// The DOM events specific to an item.
		events: {
      //'hidden.bs.modal #successWaitingModal': 'refreshView' 
		},

		initialize: function () {
			//debugger;
      
		},

    render: function () {
      
      //Render the template for this view in the browser.
      this.$el.html(this.template);
      
      //Populate the View with images from the gallery.
      this.openGallery();
      
			return this;
		},
    
    //This function called by render() to generate the image gallery.
    openGallery: function() {
      //debugger;
      
      try {
          //debugger
        
          //Load the image data from the server if it hasn't been loaded yet.
          if( global.imageUploadCollection.length == 0) {
            log.push('Fetching JSON data for image library.');
            
            //Call server to retrieve JSON Gallery data.
            global.imageUploadCollection.fetch();

          } else {
            log.push('Image library data fetched. Populating images into ImageLibraryView');
            
            var defaultImgRow = this.$el.find('.imgrow').first();   //Save the default imgrow to an object as this will get copied and manipulated.
            var imgRows = [];                           //Array to contain the image rows.
            var currentImage = [];                      //Array used to work with the current image.

            var originalIndex = []; //Tracks the location in the original imgDataRaw array.

            //Remove all .imgrow entires except the first, empty one.
            //If a category was previously selected, this section will be filled in with images.
            //The program needs to remove them first before populating with new images.
            $('.imgrow:not(:first)').remove();

            //Calculate the number of image rows needed.
            //var numRows = Math.ceil(global.imageUploadCollection.models.length/3);   
            var numRows = Math.ceil(global.thumbnailImageCollection.models.length/3);   


            //This block builds up the HTML for the image rows.
            //var k = 0; //Used to track the current image in imgDataRaw
            var k = global.thumbnailImageCollection.models.length - 1;
            //Loop through each row of images (3 images per row)
            for( var i = 0; i < numRows; i++) {

                //Add a new blank row of images
                imgRows.push(defaultImgRow.clone());

                //Get the array of 3 images in the current row
                currentImage = imgRows[i].find('img');

                //Loop through each image in the row.
                for( var j = 0; j < 3; j++) {

                    try { 
                        var image = global.thumbnailImageCollection.models[k].attributes; 
                        //$(currentImage[j]).attr('src', 'http://'+global.serverIp+':'+global.serverPort+image.path.slice(6)+'/'+image.filename);
                        $(currentImage[j]).attr('src', image.url);
                        $(currentImage[j]).attr('onclick', 'global.imageLibraryView.editImage('+k+')');
                      
                        if(image.width > 300) {
                          $(currentImage[j]).attr('width', "300");
                          $(currentImage[j]).attr('height', "auto");
                        }
                      
                        if(image.height > 300) {
                          $(currentImage[j]).attr('height', "300");
                          $(currentImage[j]).attr('width', "auto");
                        }
                      
                        k--;
                    } catch(err) {
                        //This loop intentially creates an error when it's time to exit the loop.
                        //To-Do: this could be coded better. Improper to exit by creating an error.
                        console.log('Breaking out of openGallery(). k = '+k);
                        break;
                    }
                }

            }

            //Add the populated imgRows to the DOM.
            defaultImgRow.parent().append(imgRows);
          }

      //
      } catch(err) {
          console.error('Catastrophic error in function openGallery().');
          console.error('Error Message: '+err.message);
        
          log.push('Catastrophic error in function openGallery().')
          log.push('Error Message: '+err.message);
          sendLog();
      }
    },
    
    //This function is called whenever an image in the gallery is clicked.
    //It's purpose is to load the image and image information into the 'Update Image' section.
    editImage: function(imageId) {
      //debugger;
      
      //Retrieve the image data from the collection.
      var selectedImageData = global.thumbnailImageCollection.models[imageId];
      var selectedImage = selectedImageData.attributes;
      
      //Fill out the form fields.
      this.$el.find('#inputTitle').val(selectedImageData.get('imageName'));
      this.$el.find('#inputAltTitle').val(selectedImageData.get('alt1'));
      //var URL = 'http://'+global.serverIp+':'+global.serverPort+selectedImage.path.slice(6)+'/'+selectedImage.filename;
      var URL = selectedImage.url;
      this.$el.find('#inputUrl').val(URL);
      this.$el.find('#selected-image').attr('src', URL); //Display the origional image by default.
      
      //Remove any li's in the ul. Create a blank slate in case previous images were viewed.
      this.$el.find('#thumbList').find('li').remove();
      
      //Get the parent image
      var parentGUID = selectedImageData.get('parent');
      if(parentGUID == "")
        var parentImageData = selectedImageData;
      else
        var parentImageData = global.imageUploadCollection.get(parentGUID);
      
      this.$el.find('#thumbList').append(
        '<li><a href="'+parentImageData.get('url')+'" target="_blank">'+parentImageData.attributes.imageName+' (original)</a></li>'
      ); 
      
      //Generate URLs for thumbnails and original
      //debugger;      
      var childrenGUIDs = parentImageData.get('children').split(',');
      if( childrenGUIDs[0] != "" ) {
        for( var i = 0; i < childrenGUIDs.length; i++ ) {

          //Retrieve the thumbnail images from the imageUploadCollection.
          selectedImageData = global.imageUploadCollection.get(childrenGUIDs[i]);
          selectedImage = selectedImageData.attributes;

          URL = selectedImage.url;

          //Add the thumbnail links to the ul list.
          this.$el.find('#thumbList').append(
            '<li><a href="'+URL+'" target="_blank">'+selectedImageData.attributes.imageName+'</a></li>'
          );

          //Save the URL to the 300px thumbnail. This is the image that should be displayed.
          if( i == 0 ) {
            var URL300px = URL;

            //Replace the original image with a 300px image if it's available.
            this.$el.find('#selected-image').attr('src', URL300px);
          }
        }
      }
      
      //Add the onclick function to the Update & Delete buttons.
      this.$el.find('#update-button').attr('onclick', 'global.imageLibraryView.updateImage('+imageId+')');
      this.$el.find('#delete-button').attr('onclick', 'global.imageLibraryView.deleteImage('+imageId+')');
      
      $('#edit-image').show();
      
      //Scroll to the top of the page.
      $('body').scrollTop(0);
    },
    
    //This function is called when the 'Update' button is clicked in the 'Update Image' section.
    //The purpose is to update the image data in the collection and then sync the collection with the server.
    updateImage: function(imageId) {
      //debugger;
      
      var selectedGUID = global.thumbnailImageCollection.models[imageId].get('_id');
      var selectedModel = global.imageUploadCollection.get(selectedGUID);
      
      //Update the model in the collection.
      selectedModel.set('alt1', this.$el.find('#inputAltTitle').val());
      selectedModel.set('imageName', this.$el.find('#inputTitle').val());

      //Data is automatically synced with server upon change.
      
    },
    
    //This function is called when the 'Delete' button is clicked in the 'Update Image' section.
    //The purose is to delete the parent and thumbnail images from the database.
    //Unfortunately, the imags themselves get orphined in the /public/uploads/images directory. At some
    //point I need to write a server-side function that will handle the deletion on the server.
    deleteImage: function(imageId) {      
      //debugger;
      
      //Point the object 'selectedGUID' at the parent image.
      var parentGUID = global.thumbnailImageCollection.models[imageId].get('parent');
      if(parentGUID == "")
        var selectedGUID = global.thumbnailImageCollection.models[imageId].get('_id');
      else
        var selectedGUID = parentGUID;
      
      //Generate an array that contains the IDs of this images childen.
      var childrenGUIDs = global.imageUploadCollection.get(selectedGUID).get('children');
      childrenGUIDs = childrenGUIDs.split(',');
      
      var r = confirm("Are you sure you want to delete this image?");
      if (r == true) {
        
        //Show the waiting/success modal.
        //this.$el.find('#successWaitingModal').modal('show');
        global.modalView.waitingModal();
        
        //Handle corner case of images with no children.
        if(!((childrenGUIDs.length == 1) && (childrenGUIDs[0]==""))) {
        
          //Delete all children first
          for( var i=0; i < childrenGUIDs.length; i++ ) {          
            $.getJSON('/api/imageupload/'+childrenGUIDs[i]+'/remove', function(data) {
              if( data.success ) {
                log.push('Child image id='+childrenGUIDs[i]+' successfully deleted from database.');
              } else {
                alert('The selected image was NOT deleted. There may be a problem communicating with the server.');
                console.error('Child image id='+childrenGUIDs[i]+' not deleted from datase!');
                log.push('Child image id='+childrenGUIDs[i]+' not deleted from datase!');
                sendLog();
                return;
              }
            });
          }
        }
          
        //Delete the parent last
        $.getJSON('/api/imageupload/'+selectedGUID+'/remove', function(data) {
          //debugger;
          if( data.success ) {
            console.log('Image successfully deleted from database.');
            log.push('Image successfully deleted from database.');
            
            //global.leftMenuView.showImageLibrary2();
            //alert('Image successfully deleted.'); 
            
            //debugger;
            //global.imageLibraryView.$el.find('#successWaitingModal').find('h2').css('color', 'green');
            //global.imageLibraryView.$el.find('#successWaitingModal').find('h2').text('Success!');
            //global.imageLibraryView.$el.find('#successWaitingModal').find('#waitingGif').hide();
            //global.imageLibraryView.$el.find('#successWaitingModal').find('#successMsg').show();
            global.modalView.successModal(global.imageLibraryView.refreshView);
            
            //Refesh the collection, which will also refresh the view after it's updated.
            global.imageUploadCollection.refreshView = true;
            global.imageUploadCollection.fetch();
            
            
          } else {
            alert('The selected image was NOT deleted. There may be a problem communicating with the server.')
            console.error('Image not deleted from datase!');
            log.push('Selected image was NOT deleted.');
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
      } else {
        //debugger;
        
      }
      
    },
    
    //This function is called after the imageUploadCollection has fetched its data from the server.
    //The purpose it to create an additional collection of 'parent' images -e.g. images with thumbnail children.
    getParentImageCollection: function() {
      //debugger;
      
      log.push('Retrieving parent images from imageUploadCollection and storing in parentImageCollection.')
      
      var ParentImageCollection = Backbone.Collection.extend({ //Collection Class
        model: global.imageUploadCollection.models[0]
      });
      global.parentImageCollection = new ParentImageCollection();
      
      //Cycle through all the models in imageUploadCollection and add those without a parent GUID into the ParentImageCollection.
      global.imageUploadCollection.forEach( function(model) {
        //debugger;
        if( (model.attributes.parent == "" ) || (model.attributes.parent == undefined) ) {
          global.parentImageCollection.add(model);
        }
        
      });
    },
    
    //This function is called after the imageUploadCollection has fetched its data from the server.
    //The purpose it to create an additional collection of 'thumbnail' images -e.g. the smallest images for quick loading.
    getThumbnailImageCollection: function() {
      //debugger;
      
      log.push('Retrieving 300px or smaller images from library from imageUploadCollection and storing in thumbnailImageCollection.')
      
      var ThumbnailImageCollection = Backbone.Collection.extend({ //Collection Class
        //model: global.imageUploadCollection.models[0],
        model: global.imageUploadModel
      });
      global.thumbnailImageCollection = new ThumbnailImageCollection();
      
      //Cycle through all the models in imageUploadCollection and add those with a width of 300px or less
      global.imageUploadCollection.forEach( function(model) {
        //debugger;
        if( (model.attributes.width <= 300 ) ) {
          global.thumbnailImageCollection.add(model);
        }
        
      });
    },
    
    
    //This function gets called when the modal is closed.
    refreshView: function() {
      //debugger;
      
      //Hide the edit image area.
      $('#edit-image').hide();

      //Scroll to the top of the page.
      $('body').scrollTop(0);
    }
    
   
    

    
	});

  //debugger;
	return ImageLibraryView;
});
