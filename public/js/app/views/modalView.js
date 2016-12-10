/*
The modal view is a single modal that lives in a <div> on the dashboard.hbs page, with the ID 'modalView'. 
All other views use this single modal to display information rather than implement individual modal windows
per Backbone View, which what I tried to do originally. That led to problems, so this is the fix.
*/


define([
	'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',  
  'text!../../../js/app/templates/modal.html',
  'text!../../../js/app/templates/browseImageLibrary.html'
], function ($, _, Backbone, ModalTemplate, ImageLibraryTemplate) {
	'use strict';

	var ModalView = Backbone.View.extend({

		tagName:  'div',
    
    el: '#modalView', 

		template: _.template(ModalTemplate),

		// The DOM events specific to an item.
		events: {
      'hidden.bs.modal #mainModal': 'runCloseFunc'
		},

		initialize: function () {
      this.selectedImage = null;
		},

    modalData: {
      title: 'Modal Title',
      body: '<p>Modal body text.</p>',
      btn1: '<button type="button" class="btn btn-default" id="mainModalBtn1" data-dismiss="modal">Close</button>',
      btn2: '<button type="button" class="btn btn-primary" id="mainModalBtn2" >Save changes</button>',
      closeFunc: undefined
    }, 
    
    render: function () {
      //debugger;
      
      this.$el.html(this.template);
      
      //Show the div containing the modal.
      $('#modalView').show();
      
      //Update the modal with the default data.
      this.updateModal();
      
			return this;
		},
    
    
    
    openModal: function() {
      this.$el.find('#mainModal').modal('show');
    },
    
    closeModal: function() {
      this.$el.find('#mainModal').modal('hide');
    },
    
    //This function updates the modal title, body, and footer based on the title, body, and button data in modalData.
    updateModal: function() {
      this.$el.find('#mainModalTitle').text(this.modalData.title);
      this.$el.find('#mainModalBody').html(this.modalData.body);
      this.$el.find('#mainModalFooter').html(this.modalData.btn1+this.modalData.btn2);
    },
    
    //This function executes the function assigned to modalData.closeFunc when the modal is closed. The function must be specified every time.
    runCloseFunc: function() {
      //debugger;
      if(this.modalData.closeFunc != undefined) {
        this.modalData.closeFunc(); //Execute the function once.
        this.modalData.closeFunc = undefined; //clear the function so that it is only run once.
      }
    },
    
    // BEGIN GENERIC MODALS
    //This function displays a generic error message. The message to display is passed in as an argument.
    errorModal: function(errMsg) {
      //debugger;
      this.modalData.title = 'Error!';
      this.modalData.body = '<p>'+errMsg+'</p>';
      this.modalData.btn1 = '';
      this.modalData.btn2 = '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
      
      this.updateModal();
      this.openModal();
    },
    
    //This function displays a waiting modal with a spinning gif image.
    waitingModal: function() {
      //debugger;
      this.modalData.title = 'Submitting...';
      this.modalData.body = '<img class="img-responsive center-block" src="images/waiting.gif" id="waitingGif" />';
      this.modalData.btn1 = '';
      this.modalData.btn2 = '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
      
      this.updateModal();
      this.openModal();
    },
    
    //This function displays a success message. An optional pointer to a function can be passed in as an argument.
    //The passed in function will execute when the modal is closed.
    successModal: function(closeFunc) {
      //debugger;
      this.modalData.title = 'Success!';
      this.modalData.body = '<h2 class="text-center" id="successMsg" style="color: green;"><strong>Success!</strong></h2><p>The data was successfully sent to the server.</p>';
      this.modalData.btn1 = '';
      this.modalData.btn2 = '<button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>';
      
      //Setup the close modal function after ensuring the passed in argument is a function.
      if(typeof(closeFunc) == "function")
        this.modalData.closeFunc = closeFunc;
      
      this.updateModal();
      this.openModal();
    }, 
    // END GENERIC MODALS
  
    
    // BEGIN IMAGE LIBRARY FUNCTIONS
    //This function loads the ImageLibrary Template into the modal window.
    browseImageLibrary: function() {
      this.modalData = {
        title: 'Browse Image Library',
        btn1: '<button type="button" class="btn btn-default" id="mainModalBtn1" data-dismiss="modal">Close</button>',
        btn2: '<button type="button" class="btn btn-default" id="selectImgBtn" data-dismiss="modal" onclick="global.modalView.returnImageUrl()" disabled>Select</button>',
        closeFunc: undefined,
        body: _.template(ImageLibraryTemplate)
      };
      
      this.loadImages();
      
      this.updateModal();
      this.openModal();
    },
    
    //This funciton is called by browseImageLibrary().
    //This function populates the modal with images from the image library.
    loadImages: function() {
      debugger;
      
      //Get a jQuery handle on the modal body content.
      var body = this.modalData.body();
      body = $(body);
      
      
      
      try {
        log.push('modalView.js/loadImages() starting.')

        var imageGallery = body.find('#imageGallery');
      
        //Clone only the first thumbRow
        var thumbRow = $(imageGallery.find('.thumbRow').clone()[0]);

        var j = 0; //Taggles between a value of 0 and 1. Tracks which image in the row currently being worked on.

        var rowImages = thumbRow.find('.thumbDiv');

        //Loop through each image in the imageUploadCollection.
        for( var i = 0; i < global.imageUploadCollection.length; i++ ) {


          //debugger;
          var image = global.imageUploadCollection.models[i].attributes;

          //Only load the 300px children or original images that are less than 300px wide.
          if( (image.parent == "") || (image.width <= 300) )
            continue;
          
          //Handle corner-case of new DB with no images
          //CT 9/9/16 - Needs testing.
          if( global.imageUploadCollection.length == 0 ) {
            debugger;
            return;
          }

          //var imageURL = 'http://'+top.global.serverIp+':'+top.global.serverPort+image.path.slice(6)+'/'+image.filename;
          var imageURL = image.url;

          $(rowImages[j]).append('<img class="img-responsive center-block" src="'+imageURL
                                 +'" onclick="global.modalView.selectImage('+i+')" id="galleryImage'+i+'" /><br>');

          //Enforce 300px width or height. Order of operations are important here.
          if(image.width > 300) {
            $(rowImages[j]).find('img').attr('width', "300");
            $(rowImages[j]).find('img').attr('height', "auto");
          }

          if(image.height > 300) {
            $(rowImages[j]).find('img').attr('height', "300");
            $(rowImages[j]).find('img').attr('width', "auto");
          }

          j++;
          if( j == 2 ) {
            //Create a new row.
            j = 0;

            imageGallery.find('.scrollDiv').append(thumbRow);

            //Clone only the first thumbRow
            var thumbRow = $(imageGallery.find('.thumbRow').clone()[0]);
            var rowImages = thumbRow.find('.thumbDiv');
          }

        }

        //Catch orphaned images
        if( j == 1 ) {
          imageGallery.find('.scrollDiv').append(thumbRow);
        }

        //Replace the body template with the HTML that is now filled in with the image library images.
        this.modalData.body = body;
        
        //console.log('...The TinyMCE image_gallery plugin has closed.');
        top.log.push('modalView.js/loadImages() finished');

      } catch(err) {
        console.error('Error while trying to render modalView.js/loadImages(). Error message: ');
        console.error(err.message);

        log.push('Error while trying to render modalView.js/loadImages(). Error message: ');
        log.push(err.message);
        sendLog();
      }
    },
    
    //This function is called when a user selects one of the images in the image library modal.
    selectImage: function(index) {
      debugger;
      
      try {
        log.push('modalView.js/selectImage() starting');

        //this.selectedImage is initialized to null.
        //If an image is selected, it's index is stored in this.selectedImage. When a new
        //image is clicked, the previous image needs to be unhighlighted.
        if( this.selectedImage != null ) {
          var previousImage = '#galleryImage'+this.selectedImage;
          this.$el.find(previousImage).css('border-style', 'none');
        }

        //Remove any previous options in the drop-down box.
        this.$el.find('#imageSize').find('option').remove();

        //Highlight the selected image with a blue border.
        var selectedImage = '#galleryImage'+index;
        $(selectedImage).css('border-style', 'solid');
        $(selectedImage).css('border-width', '7px');
        $(selectedImage).css('border-color', 'blue');

        //Update the global variable the previous image can be unselected next time we enter this function.
        this.selectedImage = index;

        //Retrive the parent and child image models for the selected image.
        var parentImageGUID = global.imageUploadCollection.models[index].get('parent');
        if(parentImageGUID == "")
          var parentImage = global.imageUploadCollection.models[index];
        else
          var parentImage = global.imageUploadCollection.get(parentImageGUID);
        
        var childrenGUIDs = parentImage.get('children').split(',');

        //Populate the drop-down box.
        if( childrenGUIDs.length >= 1 ) {
          if(childrenGUIDs[0] != "")
            this.$el.find('#imageSize').append('<option value="300px">300px</option>');
        }
        else if( childrenGUIDs.length >= 2 )
          this.$el.find('#imageSize').append('<option value="600px">600px</option>');
        else if( childrenGUIDs.length >= 3 )
          this.$el.find('#imageSize').append('<option value="1200px">1200px</option>');
        this.$el.find('#imageSize').append('<option value="original">original</option>'); //Default

        //Alt Tag
        //$('#altTag').val(parentImage.get('alt1'));
        
        //Enable the select button.
        this.$el.find('#selectImgBtn').prop('disabled', false);

        log.push('modalView.js/selectImage() finished');
        
      } catch(err) {
        console.error('Error while trying to execute modalView.js/selectImage(). Error message: ');
        console.error(err.message);

        log.push('Error while trying to execute modalView.js/selectImage(). Error message: ');
        log.push(err.message);
        sendLog();
      }
    },
    
    returnImageUrl: function() {
      debugger;
      
      var sizeSelection = this.$el.find('#imageSize').val();
      var selectedImage = global.imageUploadCollection.models[this.selectedImage];
      
      //The selected image is the one we want
      if( (selectedImage.get('name').indexOf(sizeSelection) != -1) || (selectedImage.get('parent') == "") ) {
        var imgUrl = selectedImage.get('url');
        global.editWidgetView.swapImg(imgUrl);
      //The image we want is a child of the parent image.
      } else {
        debugger;
        
        var parentImage = global.imageUploadCollection.get(selectedImage.attributes.parent);
        var childGUID = parentImage.get('children').split(',');
        
        switch(sizeSelection) {
          case 'original':
            global.editWidgetView.swapImg(parentImage.get('url'))
            break;
          case '300px':
            debugger;
            break;
          case '600px':
            debugger;
            break;
          case '1200px':
            debugger;
            break;
        }
      }
    }
    // END IMAGE LIBRARY FUNCTIONS
    
    
	});

  //debugger;
	return ModalView;
});
