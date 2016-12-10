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
        btn2: '',
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
debugger;        
        //Clone the thumbRow
        var thumbRow = $(imageGallery.find('.thumbRow').clone()[0]);

        var j = 0; //Taggles between a value of 0 and 1. Tracks which image in the row currently being worked on.

        var rowImages = thumbRow.find('.thumbDiv');

        //Loop through each image in the imageUploadCollection.
        for( var i = 0; i < global.imageUploadCollection.length; i++ ) {


          //debugger;
          var image = global.imageUploadCollection.models[i].attributes;

          //Handle corner-case of new DB with no images
          //CT 9/9/16 - Needs testing.
          if( global.imageUploadCollection.length == 0 ) {
            debugger;
            return;
          }

          //var imageURL = 'http://'+top.global.serverIp+':'+top.global.serverPort+image.path.slice(6)+'/'+image.filename;
          var imageURL = image.url;

          $(rowImages[j]).append('<img class="center-block" src="'+imageURL
                                 +'" onclick="selectImage('+i+')" id="galleryImage'+i+'" /><br>');

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
            j = 0;

            $('.scrollDiv').append(thumbRow);

            //Copy the template back into peopleRow.
            var thumbRow = $($('.thumbRow').clone()[0]);
            var rowImages = thumbRow.find('.thumbDiv');
          }

        }

        //Catch orphaned images
        if( j == 1 ) {
          $('.scrollDiv').append(thumbRow);
        }

        //console.log('...The TinyMCE image_gallery plugin has closed.');
        top.log.push('...The TinyMCE image_gallery plugin has closed.');

      } catch(err) {
        console.error('Error while trying to render image_gallery plugin for TinyMCE. Error message: ');
        console.error(err.message);

        top.log.push('Error while trying to render image_gallery plugin for TinyMCE. Error message: ');
        top.log.push(err.message);
        top.sendLog();
      }
    }
    // END IMAGE LIBRARY FUNCTIONS
    
    
	});

  //debugger;
	return ModalView;
});
