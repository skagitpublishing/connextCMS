/*global define*/
define([
	'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',
  'text!../../../js/app/templates/imageAddNew.html',
  'caman.full.min',
  'canvas-to-blob.min'
], function ($, _, Backbone, ImageAddNewTemplate, Caman, CanvasToBlob) {
	'use strict';

	var ImageAddNewView = Backbone.View.extend({

		tagName:  'div',
    
    el: '#imageAddNewView', 

		template: _.template(ImageAddNewTemplate),

		// The DOM events specific to an item.
		events: {
			//'click .toggle':	'toggleCompleted',
			//'dblclick label':	'edit',
			//'click .destroy':	'clear',
			//'keypress .edit':	'updateOnEnter',
			//'keydown .edit':	'revertOnEscape',
			//'blur .edit':		'close'
		},

		// The TodoView listens for changes to its model, re-rendering. Since there's
		// a one-to-one correspondence between a **Todo** and a **TodoView** in this
		// app, we set a direct reference on the model for convenience.
		initialize: function () {
			//this.listenTo(this.model, 'change', this.render);
			//this.listenTo(this.model, 'destroy', this.remove);
			//this.listenTo(this.model, 'visible', this.toggleVisible);
      
      this.fileName = "";
      this.fileType = "";
      //this.imgOrigWidth = "";
      //this.imgOrigHeigh
      
      this.imgGUID = ["", "", "", ""];
      this.imgNameExt = ["", "-300px", "-600px", "-1200px"];
		},

		
    render: function () {
      //this.$el.html(this.template(this.model.toJSON()));
      this.$el.html(this.template);
      
      log.push('imageAddNewView rendered.');
      
      //debugger;
      
      //$('#dashboardView').hide();
      //$('#pagesView').show();
      
			//this.toggleVisible();
			//this.$input = this.$('.edit');
			return this;
		}, 
    
    //This function is called after the user selected an image file, after clicking the 'Choose File' button.
    displayUploadImage: function() { 
        //debugger; 

        log.push('Choose File button clicked in imageAddNewView. Executing displayUploadImage().');
      
        //Error Handling
        if( $('#image_upload').get(0).files[0] == undefined ) {
            log('Add New Image aboarted. File not selected.');
            $('#successMsgUpload').text('Error: Please select a file.');
            return;
        }

        var imageFile = $('#image_upload').get(0).files[0];
        var imageToUpload = $('#imageToUpload')[0];

        //Display the name text box:
        $('#imageNameUploadDiv').show();

        //Display the selected image file in the browser
        var reader = new FileReader();      //Create a new FileReader object

        reader.onload = (function(aImg) {   //These functions are executed when the FileReader
            return function(e) {            //finishes reading the image file.
                aImg.src = e.target.result; //It displays the image file.
                global.imageAddNewView.get_image_info();
            }; 
        })(imageToUpload);

        reader.readAsDataURL(imageFile);    //Read the selected file with the FileReader.
      
        log.push('displayUploadImage() successfuly executed. Image rendered.')
    },
    
    //This function is called when the Upload button is clicked for uploading a new image.
    //It's purpose is to do error handling prior to calling the function that handles the
    //image upload to the server.
    uploadImage: function() {
      debugger;

      log.push('Upload button clicked in imageAddNewView. Executing uploadImage().')
        
      var selectedFile = $('#image_upload').get(0).files[0];
      
      if( selectedFile == undefined ) {
        this.$el.find('#successWaitingModal').find('h2').css('color', 'black');
        this.$el.find('#successWaitingModal').find('h2').text('No file selected.');
        this.$el.find('#successWaitingModal').find('#waitingGif').hide();
        this.$el.find('#successWaitingModal').find('#successMsg').show();
        return;
      }
      
      this.fileName = selectedFile.name; //Pass filename to global variable.
      this.fileType = selectedFile.type;

      // START ERROR HANDLING
      if( selectedFile == undefined ) {
          $('#successMsgUpload').text('Error: Please select a file.');
          return;
      }

      //Assumption: User must load the image library before they can click on the Add New navigation link.
      if( global.imageUploadCollection.length == 0 ) {
          $('#successMsgUpload').text('Error communicating with server! File upload failed');
          return;
      }

      if( $('#imageNameUpload').val() == "" ) {
          $('#successMsgUpload').text('Please give this image a name.');
          $('#successMsgUpload').attr('style', 'color: #FF0000;');
          $('#imageNameUpload').parent().parent().find('label').attr("style", "color: #FF0000;");
          return;
      }
      // STOP ERROR HANDLING
      //debugger;

      global.uploadState = 0;
      //upload_process();
      this.send_images_to_server(0);

    },
    
    //This function is called when the FileReader finishes reading the file and has deployed the image to the DOM.
    //This occurs when the user has clicked the Choose File button and selected an image file.
    //The purpose of this function is to convert the uploaded image to an HTML5 canvas, retrieve the
    //width and hieght information from the image, and resize the displayed image to a 300px thumbnail.
    get_image_info: function() {

        //debugger;

        log.push('Executing get_image_info(). Converting uploaded image to HTML5 canvas.');
      
        //Copy the original image.
        global.imageAddNewView.imgOrig = $('#imageToUpload').clone();
        global.imageAddNewView.imgOrig.attr('id', 'imageToUploadOriginal');


        //Convert the thumbnail image to a canvas to retrieve image information.
        Caman('#imageToUpload', function () {
            //debugger;

            global.imageAddNewView.imgOrigWidth = this.width;
            global.imageAddNewView.imgOrigHeight = this.height;

            this.resize({
                width: 300
            });
            this.render();

            global.imageAddNewView.resize_image();
        });

    },
    
    //This function is responsible for resizing the uploaded image via the Caman libary to standard image sizes.
    //This function is called by get_image_info().
    resize_image: function() {
      //debugger;
      log.push('Executing resize_image(). Resizing image canvas to 300px, 600px, and 1200px standard sizes.')
      
      //Error Handling
      if( global.imageAddNewView.imgOrigWidth == undefined ) {
        alert('global.imageAddNewView.imgOrigWidth is undefined.');
        return;
      }

      var imgOrigWidth = global.imageAddNewView.imgOrigWidth;
      var imgOrig = global.imageAddNewView.imgOrig;
      
      if( imgOrigWidth > 300 ) {

          var img300px = imgOrig.clone();
          img300px.attr('id', 'imgToUpload300px');

          //The image needs to be added to the DOM so Caman can 'see' it.
          $('#imageResizeDiv').append(img300px);

          Caman('#imgToUpload300px', function () {
              this.resize({
                  width: 300
              });
              this.render();
          });

      }

      if( imgOrigWidth > 600 ) {

          var img600px = imgOrig.clone();
          img600px.attr('id', 'imgToUpload600px');

          //The image needs to be added to the DOM so Caman can 'see' it.
          $('#imageResizeDiv').append(img600px);

          Caman('#imgToUpload600px', function () {
              this.resize({
                  width: 600
              });
              this.render();
          });

      }

      if( imgOrigWidth > 1200 ) {

          var img1200px = imgOrig.clone();
          img1200px.attr('id', 'imgToUpload1200px');

          //The image needs to be added to the DOM so Caman can 'see' it.
          $('#imageResizeDiv').append(img1200px);

          Caman('#imgToUpload1200px', function () {
              this.resize({
                  width: 1200
              });
              this.render();
          });

      }

      //Append the original image as a canvas
      $('#imageResizeDiv').append(imgOrig);
      Caman('#imageToUploadOriginal', function () {
              this.render();
      });

    },
    
    //This function is called by several different callback functions. It ensures that the process
    //of uploading images to the server is managed by defining the state of the process in each step.
    send_images_to_server: function(uploadState) {
      debugger;
      
      global.uploadState = uploadState; //Ensure the passed argument persists to the global varible.
      
      //debugger;
        switch(uploadState) {
            case 0: //Called by Upload Button. Upload original image.
                //debugger;
                //var selectedFile = $('#image_upload').get(0).files[0];

                //uploadState = 1; //update the state of the upload process.
                this.currentFile = 0; //original file

                //Below I'll createa file based on the manipulatd Canvas.
                var canvas = $('#imageToUploadOriginal')[0];
                if (canvas.toBlob) { //Ensure the toBlob library is loaded
                    canvas.toBlob( this.handleCanvasBlob, this.fileType );
                } else {
                    console.error('Could not access toBlob library!');
                    return;
                }                
                break;



            case 1: //server returned GUID from uploading original image.
                //debugger;
                //Upload 300px image

                if( $('#imgToUpload300px')[0] != undefined ) {
                    this.currentFile = 1;

                    var canvas = $('#imgToUpload300px')[0];
                    canvas.toBlob( this.handleCanvasBlob, this.fileType );
                } else {
                    global.uploadState = 4;
                    this.send_images_to_server(global.uploadState);
                }
                break;

            case 2: //server returned GUID from uploading 300px image

                //debugger;

                //Upload 600px image
                if( $('#imgToUpload600px')[0] != undefined ) {
                    this.currentFile = 2;

                    var canvas = $('#imgToUpload600px')[0];
                    canvas.toBlob( this.handleCanvasBlob, this.fileType );
                } else {
                    global.uploadState = 4;
                    this.send_images_to_server(global.uploadState);
                }
                break;

            case 3: //server returned GUID from uploading 600px image
                //debugger;

                //Upload 1200px image
                if( $('#imgToUpload1200px')[0] != undefined ) {
                    this.currentFile = 3;

                    var canvas = $('#imgToUpload1200px')[0];
                    canvas.toBlob( this.handleCanvasBlob, this.fileType );
                } else {
                    global.uploadState = 4;
                    this.send_images_to_server(global.uploadState);
                }

                break;

            case 4: //server returned GUID from uploading 1200px image
                //debugger;
                //Note: at this point, the imgGUID array should be filled in with the GUIDs of the uploaded images.

                global.uploadState++;

                //Call server to retrieve JSON Gallery data.
                $.getJSON('http://'+global.serverIp+':'+global.serverPort+'/api/imageupload/list', '', global.imageAddNewView.catch_new_image_data);


                break;

            case 5: //server returned JSON data on image gallery with newly uploaded image.
                //Add name and children to original image
                //debugger;
            
                //Note: this = global.imageAddNewView

                //Loop through the area of image data in reverse order (start with last and work towards first).
                //Looping in that order should find the original image faster as it will be near the end.
                for( var i = this.imgDataRaw.length-1; i>=0; i--) {
                    if( this.imgDataRaw[i]._id == this.imgGUID[0] ) {

                        this.imgDataRaw[i].imageName = $('#imageNameUpload').val();

                        //Generate a GUID children string
                        var childrenStr = "";
                        if( this.imgGUID[1] != "") {
                            childrenStr = this.imgGUID[1];
                            if( this.imgGUID[2] != "") {
                                childrenStr += ","+this.imgGUID[2];
                                if( this.imgGUID[3] != "" ) {
                                    childrenStr += ","+this.imgGUID[3];
                                }
                            }
                        }
                        this.imgDataRaw[i].children = childrenStr;

                        //Create an empty object with a collection property, so that the uploaded JSON matches the original format.
                        var serverJSON = this.imgDataRaw[i];


                        //Send the JSON string to the server and log a copy on the console.
                        //console.log('Collection API URL: '+'http://'+serverIP+':'+global.serverPort+'/api/frontendimg/'+collectionId);
                        //console.log('JSON data sent: '+JSON.stringify(serverJSON)); //Used for debugging.
                        $.getJSON('http://'+global.serverIp+':'+global.serverPort+'/api/imageupload/'+this.imgGUID[0]+'/update', serverJSON, this.validateUploadData);
                      
                        //If the image upload process is complete, signal the user.
                        if(this.imgGUID[1] == "")
                          this.image_upload_complete();
                      
                        break; //break out of the for loop once I've found the right entry.
                    }
                    
                }

                break;

            case 6: //Original image data updated. Now update 300px image data
                //debugger;

                //Skip if no 300px image was ever uploaded.
                if( this.imgGUID[1] != "" ) {

                    //Loop through the area of image data in reverse order.
                    for( var i = this.imgDataRaw.length-1; i>=0; i--) {
                        if( this.imgDataRaw[i]._id == this.imgGUID[1] ) {

                          this.imgDataRaw[i].imageName = $('#imageNameUpload').val()+this.imgNameExt[1];

                          //Point to parent image
                          this.imgDataRaw[i].parent = this.imgGUID[0];

                          //Create an empty object with a collection property, so that the uploaded JSON matches the original format.
                          var serverJSON = this.imgDataRaw[i];


                          //Send the JSON string to the server and log a copy on the console.
                          //console.log('Collection API URL: '+'http://'+serverIP+'/api/frontendimg/'+collectionId);
                          //console.log('JSON data sent: '+JSON.stringify(serverJSON)); //Used for debugging.
                          $.getJSON('http://'+global.serverIp+':'+global.serverPort+'/api/imageupload/'+this.imgGUID[1]+'/update', serverJSON, this.validateUploadData);

                          //If the image upload process is complete, signal the user.
                          if(this.imgGUID[2] == "")
                            this.image_upload_complete();
                          
                          break; //break out of the for loop once I've found the right entry.
                        }
                        
                    }
                }

                break;

            case 7: //300px image data updated. Now update 600px image.
                //debugger;

                //Skip if no 600px image was ever uploaded.
                if( this.imgGUID[2] != "" ) {

                    //Loop through the area of image data in reverse order.
                    for( var i = this.imgDataRaw.length-1; i>=0; i--) {
                        if( this.imgDataRaw[i]._id == this.imgGUID[2] ) {

                          this.imgDataRaw[i].imageName = $('#imageNameUpload').val()+this.imgNameExt[2];

                          //Point to parent image
                          this.imgDataRaw[i].parent = this.imgGUID[0];

                          //Create an empty object with a collection property, so that the uploaded JSON matches the original format.
                          var serverJSON = this.imgDataRaw[i];


                          //Send the JSON string to the server and log a copy on the console.
                          //console.log('Collection API URL: '+'http://'+serverIP+'/api/frontendimg/'+collectionId);
                          //console.log('JSON data sent: '+JSON.stringify(serverJSON)); //Used for debugging.
                          $.getJSON('http://'+global.serverIp+':'+global.serverPort+'/api/imageupload/'+this.imgGUID[2]+'/update', serverJSON, this.validateUploadData);

                          //If the image upload process is complete, signal the user.
                          if(this.imgGUID[3] == "")
                            this.image_upload_complete();
                          
                          break; //break out of the for loop once I've found the right entry.
                        }
                        
                    }
                }

                break;

            case 8: //600px image data updated. Now update 1200px image.
                //debugger;

                //Skip if no 600px image was ever uploaded.
                if( this.imgGUID[3] != "" ) {

                    //Loop through the area of image data in reverse order.
                    for( var i = this.imgDataRaw.length-1; i>=0; i--) {
                        if( this.imgDataRaw[i]._id == this.imgGUID[3] ) {

                          this.imgDataRaw[i].imageName = $('#imageNameUpload').val()+this.imgNameExt[3];

                          //Point to parent image
                          this.imgDataRaw[i].parent = this.imgGUID[0];

                          //Create an empty object with a collection property, so that the uploaded JSON matches the original format.
                          var serverJSON = this.imgDataRaw[i];


                          //Send the JSON string to the server and log a copy on the console.
                          //console.log('Collection API URL: '+'http://'+serverIP+':'+global.serverPort+'/api/frontendimg/'+collectionId);
                          //console.log('JSON data sent: '+JSON.stringify(serverJSON)); //Used for debugging.
                          $.getJSON('http://'+global.serverIp+':'+global.serverPort+'/api/imageupload/'+this.imgGUID[3]+'/update', serverJSON, this.validateUploadData);

                          //If the image upload process is complete, signal the user.
                          this.image_upload_complete();
                          
                          break; //break out of the for loop once I've found the right entry.
                        }
                    }
                }

                break;

            default:
              debugger;

              console.error('send_images_to_server() called with unknown state. State: '+uploadState);
              log.push('send_images_to_server() called with unknown state. State: '+uploadState);
              sendLog();

              break;
        }

        
    }, 
    
    //This function is called by state 4 of send_images_to_server(). It catches the image gallery JSON data sent by the server.
    catch_new_image_data: function (data) {
        //debugger;
        global.imageAddNewView.imgDataRaw = data.collections;

        //uploadState = 5;
        //upload_process();
        global.imageAddNewView.send_images_to_server(5);
    },

    //This function is called by send_images_to_server(). For now it does nothing, eventually it will validate 
    //that data was successfully updated.
    validateUploadData: function(data) {
        //debugger;
        //data.collection.imageName

        global.uploadState++;
        //upload_process();
        global.imageAddNewView.send_images_to_server(global.uploadState);
    },
    
    //This function is called from within the uploadImage() function.
    //This function is a callback that finalizes the upload of the image after the canvas has been converted to a blob.
    handleCanvasBlob: function (blob) {
        //debugger;

        //var localFileName = fileName+imgNameExt[currentFile]; //Could improve this
        var localFileName = global.imageAddNewView.fileName; //Could improve this
        var the_file = new File([blob], localFileName, {type: blob.type});

        //handleFiles(the_file);

        //Create the FormData data object and append the file to it.
        var newImage = new FormData();
        newImage.append('image_upload', the_file); //This is the raw file that was selected

        //Note: all other appeneded items like 'name' or 'alt1' will be ignored. Need to edit these fields with a second call.

        var opts = {
            url: 'http://'+global.serverIp+':'+global.serverPort+'/api/imageupload/create',
            data: newImage,
            cache: false,
            contentType: false,
            //contentType: "multipart/form-data",
            processData: false,
            type: 'POST',
            success: function(data){
                //debugger;
                console.log('Image upload ID: ' + data.image_upload._id);
                log.push('Image upload ID: ' + data.image_upload._id);
                global.imageAddNewView.imgGUID[global.imageAddNewView.currentFile] = data.image_upload._id; //Save the returned GUID.

                //Redownload the image gallery data and refresh the page.
                //$.getJSON('http://'+serverIp+':'+global.serverPort+'/api/imageupload/list', '', processImageJSON);

                //uploadState++;
                //upload_process();
                global.uploadState++;
                global.imageAddNewView.send_images_to_server(global.uploadState);
            }
        };


        jQuery.ajax(opts);
    },
    
    //Signal to the user that the upload is complete.
    image_upload_complete: function() {
      //debugger;
      global.leftMenuView.showImageLibrary();
    }
    
	});

  //debugger;
	return ImageAddNewView;
});
