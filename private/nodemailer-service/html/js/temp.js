            //This function is called when the Submit button (at the bottom of the page) is clicked.
            //It's purpose is to upload the models to the server.
            function submitOrder(state) {
              //debugger;
              
              //Retrieve the View for the currently selected Tactic Model
              var currentTactic = Number(tacticCollectionView.activeTab.slice(-2))-1; //Calculate the View that corresponds to the currently active tactic.
              var thisTacticView = tacticViews[currentTactic];

              //The state of this function is passed in as a variable. 
              switch (state) {
                //This state is called when the button is clicked.
                case 0:
                  
                  //The customValidation function is below.
                  //Exit the function if it returns false.
                  if( !customValidation() )
                    return;
                  
                  //If any of the input boxes fail a validity check then halt the upload and tell the user.
                  if( !thisTacticView.$el.find('.tactic-form').valid() ) {
                    alert('There are issues with this order. Problems have been highlighted in red. Please fix and resubmit.')
                    return;
                  }
                  
                  //Prompt the user to ensure they are ready to upload the form.
                  var r = confirm("Are you sure you are ready to submit the order?");
                  if (r == true) {

                    //At some point this block should go into an Order View
                    var tmpElmt = document.getElementById("sales_publication");
                    orderItem.set('publication', tmpElmt.options[tmpElmt.selectedIndex].text);
                    orderItem.set('name', $('#sales_name').val());
                    orderItem.set('email', $('#sales_email').val());
                    orderItem.set('phone', $('#sales_phone').val());
                    
                    //Initialize the model arrays.
                    //This is necessary to get around a bug in Backbone.js.
                    //for( var i = 0; i < tacticCollection.models.length; i++) {
                    //  tacticCollection.models[i].attributes.creativesURLs = [];
                    //  tacticCollection.models[i].attributes.creativesGUIDs = [];
                    //}
                    
                    //reset the counter.
                    cnt = 0;

                    //Switch to the first Tactic tab
                    tacticCollectionView.switchTab('#tactic-1');
                    
                    //Move on to state 1.
                    submitOrder(1);

                  } else {
                    console.log('Order upload canceled.');
                  }
                  
                  break;
                  
                case 1:
                  //debugger;
                    
                    //Retrieve the View for the currently selected Tactic Model
                    //var currentTactic = Number(tacticCollectionView.activeTab.slice(-2))-1; //Calculate the View that corresponds to the currently active tactic.
                    //var thisTacticView = tacticViews[currentTactic];
                    
                    // 1) upload each image first.
                    // Loop through the list of images.
                    for( var i = 0; i < thisTacticView.model.attributes.creatives.length; i++ ) {

                      //Create the FormData data object and append the file to it.
                      var imgForm = new FormData();
                      
                      //Append the image file to the FormData object.
                      var imgFile = thisTacticView.model.attributes.creatives[i];
                      imgForm.append('image_upload', imgFile); //This is the raw file that was selected
                      //Note: all other appeneded items like 'name' or 'alt1' will be ignored. Need to edit these fields with a second call.

                      //AJAX options - required for uploading images
                      var opts = {
                          url: 'http://'+serverIp+':3000/api/imageupload/create',
                          data: imgForm,
                          cache: false,
                          contentType: false,
                          //contentType: "multipart/form-data",
                          processData: false,
                          type: 'POST',
                          success: function(data){  //Function executed upon sucessful upload:
                              console.log('Image upload ID: ' + data.image_upload._id);

                              //Retrieve the View for the currently selected Tactic Model
                              var currentTactic = Number(tacticCollectionView.activeTab.slice(-2))-1; //Calculate the View that corresponds to the currently active tactic.
                              var thisTacticView = tacticViews[currentTactic];
                            //debugger;
                              //Save the GUID and URL for the uploaded image to the model for this tactic.
                              thisTacticView.model.attributes.creativesGUIDs.push(data.image_upload._id);
                              thisTacticView.model.attributes.creativesURLs.push('http://'+serverIp+':3000'+data.image_upload.image.path.slice(6)+'/'+data.image_upload.image.filename);

                              
                              //Move on to state 2 if the last GUID has been retrieved.
                              if( thisTacticView.model.attributes.creativesGUIDs.length == thisTacticView.model.attributes.creatives.length ) {
                                
                                submitOrder(2);
                              }
                          }
                      };

                      //Submit the FormData object via AJAX.
                      jQuery.ajax(opts);

                    }
                    
                  

                  break;

                case 2:
                  
                  //debugger;
                  
                  //Switch to the next tactic tab and upload the images associated with that tab.
                  if( currentTactic+1 < campaignItem.attributes.tactics ) {
                    tacticCollectionView.switchTab('#tactic-'+(currentTactic+2));

                    submitOrder(1);
                  } else {
                    //debugger;
                    
                    //Switch back to the first tab before moving on to state 3.
                    tacticCollectionView.switchTab('#tactic-1');
                    
                    //Clear the counter
                    cnt = 0;
                    
                    submitOrder(3);
                  }
                  
                  break;
                  
                  
                //Retrieve the JSON data for each uploaded image. This provides scaffolding for updating the image data.
                //Note: the program will ping-pong between states 3 and 4 for each uploaded image.
                case 3:
                  //debugger;
                  var collectionId = thisTacticView.model.attributes.creativesGUIDs[cnt];
                  $.getJSON('http://'+serverIp+':3000/api/imageupload/'+collectionId, '', function (data) {
                    //debugger;
                    
                    imgJSON = data.collection; //Save the prototype
                    
                    submitOrder(4); //Call this function and increment the state.
                  });
                  
                  break;
                  
                //This state is responsible for uploading image data to the images (creatives).
                case 4: //Last image (creatives) has been uploaded and the GUIDs for each have been retrieved.
                  
                  //debugger;

                  //Generate a unique name for the image
                  var formattedName = orderItem.get('name').toLowerCase().replace(/\s+/, '-');
                  var now = new Date();
                  var timestamp = ("0"+(now.getMonth()+1)).slice(-2)+'-'+("0"+now.getDate()).slice(-2)+'-'+(now.getFullYear())+'-'+("0"+now.getHours()).slice(-2)+("0"+now.getMinutes()).slice(-2);
                  //var imgName = timestamp+'-'+formattedName+'-'+'img'+i;
                  var imgName = timestamp+'-'+campaignItem.get('advertiser')+'-'+'img'+(cnt+1)+'-tactic-'+(currentTactic+1);

                  //Save the image name to the JSON prototype
                  imgJSON.name = imgName;

                  //Save the URL to the image
                  imgJSON.attributes1 = 'http://'+serverIp+':3000'+imgJSON.image.path.slice(6)+'/'+imgJSON.image.filename;

                  //Update the image information with the filename
                  var collectionId = imgJSON._id;

                  $.getJSON('http://'+serverIp+':3000/api/imageupload/'+collectionId+'/update', imgJSON, function (data) {
                    //debugger;

                    //Retrieve the View for the currently selected Tactic Model
                    var currentTactic = Number(tacticCollectionView.activeTab.slice(-2))-1; //Calculate the View that corresponds to the currently active tactic.
                    var thisTacticView = tacticViews[currentTactic];

                    cnt++; //Increment the counter.

                    //Test to see if I've updated all the names. If so, increase the state.
                    if( cnt == thisTacticView.model.attributes.creativesGUIDs.length ) {
                      //debugger;
                      
                      cnt = 0; //reset the counter
                      
                      //If we're on the last tactic...
                      if( currentTactic+1 >= campaignItem.attributes.tactics ) {

                        //Switch back to the first tab before moving on to state 5.
                        tacticCollectionView.switchTab('#tactic-1');
                        
                        submitOrder(5);
                        
                      } else {
                        
                        //Switch to the next tactic
                        tacticCollectionView.switchTab('#tactic-'+(currentTactic+2));
                        
                        submitOrder(3);
                      }
                    } else {
                      //Otherwise, update the names for the rest of the images
                      submitOrder(3);
                    }
                  });
                
                  break;
                  
                // 2) Upload the RTB form information after image uploads have successfully completed
                //Upload Order
                case 5:
                  //debugger;
                  
                  //Generate a timestamp string
                  var now = new Date();
                  var timestamp = (now.getMonth()+1)+'-'+(now.getDate())+'-'+(now.getFullYear())+'-'+("0"+now.getHours()).slice(-2)+("0"+now.getMinutes()).slice(-2);
                  
                  //Update the rtbOrderJSON variable with information from the form.
                  rtbOrderJSON.publication = timestamp+'-'+orderItem.get('publication');
                  rtbOrderJSON.emailAddress = orderItem.get('email');
                  rtbOrderJSON.formUser = orderItem.get('name');
                  rtbOrderJSON.phoneNumber = orderItem.get('phone');
                  
                  /*
                  //Format all the data stored in the models into a JSON object to be passed to the server.
                  rtbJSON.publication = timestamp+'-'+orderItem.get('publication');
                  rtbJSON.budget = campaignItem.get('budget');
                  rtbJSON.desktopTargets = thisTacticView.model.get('desktopTarget').join(", ");
                  rtbJSON.destinationURL = thisTacticView.model.get('destinationUrl');
                  rtbJSON.emailAddress = orderItem.get('email');
                  rtbJSON.endDate = thisTacticView.model.get('endDate');
                  rtbJSON.formUser = orderItem.get('name');
                  rtbJSON.geographicTargets = thisTacticView.model.get('zipcodes').join(', ');
                  rtbJSON.impressionGoal = campaignItem.get('impressionsGoal');
                  rtbJSON.mobileTargets = thisTacticView.model.get('mobileTarget').join(', ');
                  rtbJSON.notes = thisTacticView.model.get('notes');
                  rtbJSON.phoneNumber = orderItem.get('phone');
                  rtbJSON.startDate = thisTacticView.model.get('startDate');
                  rtbJSON.trackingNumber = campaignItem.get('trackingNumber');
                  rtbJSON.advertiserName = campaignItem.get('advertiser');
                  */
                  
                  
                  //Upload the new form to the server
                  $.post('http://'+serverIp+':3000/api/rtborder/create', rtbOrderJSON, function (data) { 
                    //debugger; 
                    
                    //Add the Server GUID to the Order Model.
                    orderItem.set('GUID', data.form._id);
                    
                    //Move on to the next state
                    submitOrder(6);
                  });

                  break;
                  
                //Upload Campaign 
                case 6:
                  
                  //debugger;
                  
                  //Generate a timestamp string
                  var now = new Date();
                  var timestamp = ("0"+(now.getMonth()+1)).slice(-2)+'-'+("0"+now.getDate()).slice(-2)+'-'+(now.getFullYear())+'-'+("0"+now.getHours()).slice(-2)+("0"+now.getMinutes()).slice(-2);
                  
                  //Update the rtbCampaignJSON variable with information from the form.
                  rtbCampaignJSON.advertiserName = timestamp+'-'+campaignItem.get('advertiser');
                  rtbCampaignJSON.trackingNumber = campaignItem.get('trackingNumber');
                  rtbCampaignJSON.budget = campaignItem.get('budget');
                  rtbCampaignJSON.impressionGoal = campaignItem.get('impressionsGoal');
                  rtbCampaignJSON.order = orderItem.get('GUID');

                  //Upload the new campaign to the server
                  $.post('http://'+serverIp+':3000/api/rtbcampaign/create', rtbCampaignJSON, function (data) { 
                    //debugger; 
                    
                    //Add the Server GUID to the Order Model.
                    campaignItem.set('GUID', data.form._id);
                    
                    //Clear the global counter.
                    cnt = 0;
                    
                    //Move on to the next state
                    submitOrder(7);
                  });

                  break;
                
                //Upload the Tactic information
                case 7:
                  
                  //debugger;
                  
                  //Generate a timestamp string
                  var now = new Date();
                  var timestamp = ("0"+(now.getMonth()+1)).slice(-2)+'-'+("0"+now.getDate()).slice(-2)+'-'+(now.getFullYear())+'-'+("0"+now.getHours()).slice(-2)+("0"+now.getMinutes()).slice(-2);
                  
                  //Loop through the different models in the tacticCollection as this state is called.
                  var thisTacticItem = tacticCollection.models[cnt];
                  
                  //Update the rtbCampaignJSON variable with information from the form.
                  rtbTacticJSON.advertiserName = timestamp+'-'+campaignItem.get('advertiser')+'-tactic-'+(cnt+1);
                  rtbTacticJSON.startDate = thisTacticItem.get('startDate');
                  rtbTacticJSON.endDate = thisTacticItem.get('endDate');
                  rtbTacticJSON.destinationURL = thisTacticItem.get('destinationUrl');
                  //rtbTacticJSON.desktopTargets = thisTacticItem.get('desktopTarget').join(", ");
                  //rtbTacticJSON.mobileTargets = thisTacticItem.get('mobileTarget').join(', ');
                  //rtbTacticJSON.geographicTargets = thisTacticItem.get('zipcodes').join(', ');
                  rtbTacticJSON.hyperlocal_lat = thisTacticItem.get('hyper_local_lat').join(', ');
                  rtbTacticJSON.hyperlocal_long = thisTacticItem.get('hyper_local_long').join(', ');
                  rtbTacticJSON.notes = thisTacticItem.get('notes');
                  rtbTacticJSON.order = orderItem.get('GUID');
                  rtbTacticJSON.campaign = campaignItem.get('GUID');
                  rtbTacticJSON.imgGUID = thisTacticItem.get('creativesGUIDs').join(', ');
                  rtbTacticJSON.imgURL = thisTacticItem.get('creativesURLs').join(', ');
                  rtbTacticJSON.geoTarget = thisTacticItem.get('geoTarget');
                  rtbTacticJSON.zipcodes = thisTacticItem.get('zipcodes').join(', ');
                  
                  //Upload the new campaign to the server
                  $.post('http://'+serverIp+':3000/api/rtbtactic/create', rtbTacticJSON, function (data) { 
                    //debugger; 
                    
                    //Add the Server GUID to the Order Model.
                    thisTacticItem.set('GUID', data.form._id);
                    
                    //Clear the global counter.
                    cnt++;
                    
                    if( cnt == tacticCollection.models.length ) {
                      cnt = 0;
                    
                      //Move on to the next state
                      submitOrder(8);
                    } else {
                      //submit the next tactic
                      submitOrder(7);
                    }
                    
                  });
                  
                  break;
                
                //Update the campaign with all the tactic GUIDs
                case 8:
                  //debugger;
                  
                  //Retrieve the current campaign from the server
                  $.getJSON('http://'+serverIp+':3000/api/rtbcampaign/'+campaignItem.attributes.GUID, '', function (data) {
                    
                    //debugger;
                    
                    //Generate a CSV of Tactic GUIDs.
                    data.collection.tactics = tacticCollection.map(function(tacticItem) {	return tacticItem.get('GUID'); }).join(', ');
                    
                    //Update the campaign data on the server:
                    $.getJSON('http://'+serverIp+':3000/api/rtbcampaign/'+campaignItem.attributes.GUID+'/update', data.collection, function (data) {
                    
                      //debugger;
                      
                      var GUIDstr = tacticCollection.map(function(tacticItem) {	return tacticItem.get('GUID'); }).join(', ');
                      
                      //Verify the GUIDS were updated.
                      if( data.collection.tactics == GUIDstr ) {
                        //debugger;
                        console.log('Campaign uploaded successfully.')
                        
                      } else {
                        //debugger;
                        console.log('Problem with uploading Campaign data.')
                      }
                      
                      submitOrder(9);
                    });
                    
                  });
                  
                  
                  break;

                //Update the order with the campaign GUIDs.
                case 9:
                  //debugger;
                  
                  //Retrieve the current campaign from the server
                  $.getJSON('http://'+serverIp+':3000/api/rtborder/'+orderItem.attributes.GUID, '', function (data) {
                    
                    //debugger;
                    
                    //Generate a CSV of Tactic GUIDs.
                    data.collection.campaigns = campaignItem.attributes.GUID;
                    
                    //Update the campaign data on the server:
                    $.getJSON('http://'+serverIp+':3000/api/rtborder/'+orderItem.attributes.GUID+'/update', data.collection, function (data) {
                    
                      //debugger;
                      
                      var GUIDstr = campaignItem.attributes.GUID;
                      
                      //Verify the GUIDS were updated.
                      if( data.collection.campaigns == GUIDstr ) {
                        //debugger;
                        console.log('Order uploaded successfully.')
                        submitOrder(10);
                      } else {
                        //debugger;
                        console.log('Problem with uploading Order data.')
                      }
                      
                      //submitOrder(10);
                    });
                    
                  });
                  
                  break;
                
                case 10: //Display the success message.
                  $('#campaignsPanel').hide();
                  $('#tacticsPanel').hide();
                  $('#submitOrderBtn').hide();
                  $('.order-form').hide();
                  $('#successMsg').show();
                  break;
                  
                  
                default:
                  console.log('Unplanned case executed in submitOrder().');
                  break;
              }
              
              
              
              
              
            }

            /*
            
            This function is called by submitOrder(). It's purpose is to validate the following:
            -Ensure that each tactic has images uploaded. 
            --Note this will be expanded in the future to encompase checking of image size (too small, too big) as well as pixel sizes
            -Ensure each tactic has zip codes assigned if geographic targets are selected (default)
            --Ensure each tactic has at least one lat/long coordinate if hyperlocal is selected
            
            */
            function customValidation() {
              debugger;
              
              //Loop through each tactic
              for( var i = 0; i < campaignItem.get('tactics'); i++ ) {
                
                //Switch to the tactic tab
                var tacticLabel = '#tactic-'+(i+1);
                tacticCollectionView.switchTab(tacticLabel);
                
                //Retrieve the View for the currently selected Tactic Model
                var currentTactic = Number(tacticCollectionView.activeTab.slice(-2))-1; //Calculate the View that corresponds to the currently active tactic.
                var thisTacticView = tacticViews[currentTactic];
                
                //Alert user and exit if image files have not been uploaded.
                if( thisTacticView.model.attributes.creatives == "" ) {
                  alert('Tactic #'+ (i+1) +' is missing the creatives (images) required to run the ad. Please click the "Upload files..." button and upload these images.');
                  return false;
                }
                
                //Alert user and exit if hyperlocal target was selected but no lat/longs are provided
                if( thisTacticView.model.attributes.geoTarget == "hyperlocal" ) {
                  if( thisTacticView.model.attributes.hyper_local_lat.length == 0 ) {
                    alert('A hyperlocal target for tactic #'+ (i+1) +' has been selected, but no Lat/Long coordinates have been provided. Please submit an address to retrieve Lat/Long coordinates.');
                    return false;
                  }
                  
                //Alert user and exit if geographical target was selected but no zip codes were provided
                } else {
                  if( thisTacticView.model.attributes.zipcodes.length == 0 ) {
                    alert('A geographical target for tactic #'+ (i+1) +' has been selected, but no zip codes have been provided. Please provide zip codes.');
                    return false;
                  }
                }
                
              }
              
              //Return true by default.
              return true;
            }