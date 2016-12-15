/*global define*/
define([
	'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',
  'tinymce/tinymce.min',
  '../model/FrontEndWidgetModel.js',
  'text!../../../js/app/templates/editWidget.html'
], function ($, _, Backbone, TinyMCE, FrontEndWidgetModel, EditWidgetTemplate) {
	'use strict';

	var FrontEndWidgetView = Backbone.View.extend({

		tagName:  'div',
    
    el: '#widgetEditor',  

		template: _.template(EditWidgetTemplate),

    // The DOM events specific to an item.
    events: {
      'click #addHTMLBtn': 'addHTML',
      'click #addImgRowBtn': 'addImgRow',
      //'click #addWidget': 'addWidget',
      'change #widgetTitle': 'updateWidget',
      'change #widgetDesc': 'updateWidget',
      'change .widgetText': 'updateWidget'
    },

    initialize: function () {
      this.targetWidget = -1; //Index that points to the currently loaded Widget.
      this.targetImage = -1; //Index that points to the currently selected image within a widget.
    },

    render: function (index) {      
      //debugger;
      
      this.$el.html(this.template);

      if(index != undefined) {
        this.model = global.frontEndWidgetCollection.models[index];
      
        this.targetWidget = index;
      }
      
      this.$el.find('#widgetTitle').val(this.model.get('title'));
      this.$el.find('#widgetDesc').val(this.model.get('desc'));

      var htmlArray = this.model.get('contentArray');
      var imgArray = this.model.get('imgUrlArray');
   
      //BEGIN POPULATION OF HTML ARRAY
      
      //if the htmlArray is empty.
      if((htmlArray.length == 0) || (htmlArray.length == undefined)) {
        //Do nothing. Leave the default HTML the way it is.
        //debugger;

        this.loadTinyMCE('.widgetText')
        
      //if the htmlArray is NOT empty.
      } else {
        
        this.$el.find('#widgetHTML').find('.scaffold').hide();
        
        //Create a new text area for each htmlArray element.
        for(var i=0; i < htmlArray.length; i++) {
          var tmpEntry = this.$el.find('#widgetHTML').find('.scaffold').clone(); //Clone the scaffolding
          var contentSelector = 'content'+i;
          
          tmpEntry.removeClass('scaffold'); //Remove the scaffold class
          tmpEntry.addClass(contentSelector);
          
          tmpEntry.show();
          
          tmpEntry.find('button').click([i],this.deleteHtml); //Assign a click handler to the delete button
          
          tmpEntry.prepend('<span>contentArray['+i+']</span>');
          
          this.$el.find('#widgetHTML').append(tmpEntry); //Add it to the DOM
          
          //tmpEntry.find('textarea').val(htmlArray[i]); //Populate the text box
          debugger;
          global.tinymce.currentModelIndex = i;
          this.loadTinyMCE('.'+contentSelector); //Load the TinyMCE Editor into this new textarea
          debugger;
          
          //tinymce.activeEditor.setContent(htmlArray[i]); //Load the content from the array.
        }
        
        //Remove the scaffolding element
        //this.$el.find('#widgetHTML').find('.scaffold').remove();
        //Hide the scaffolding element
        //this.$el.find('#widgetHTML').find('.scaffold').hide();
      }
      //END POPULATION OF HTML ARRAY
      
      //BEGIN POPULATION OF IMAGE ARRAY
      if((imgArray.length == 0) || (imgArray.length == undefined)) {
        //Do nothing. Leave the default image layout the way it is.
        //debugger;
      } else {
        
        //Initialize
        var colIndex = 0;
        var tmpRow = this.$el.find('#widgetImages').find('.scaffold').clone();
        tmpRow.removeClass('scaffold');
        
        
        //Loop through all the images
        for(var i=0; i < imgArray.length; i++) {
          var imgSelector = '.img'+colIndex;
          
          var thisImg = tmpRow.find(imgSelector);
          
          thisImg.find('button').click([i], this.deleteImg); //Assign a click handler to the delete button.
          
          thisImg.prepend('<span>imgUrlArray['+i+']</span>');
          
          thisImg.find('img').attr('onclick', ''); //Remove the default click handler.
          thisImg.find('img').click([i], this.swapImg); //Assign a click handler to the image to swap out the image with a new one.
          thisImg.find('img').attr('src', imgArray[i]); //Swap out the image with the one assigned to the widget.
          
          //Manage the column index
          colIndex++;
          if(colIndex > 2) {
            colIndex = 0;
            
            this.$el.find('#widgetImages').prepend(tmpRow);
            var tmpRow = this.$el.find('#widgetImages').find('.scaffold').clone();
            //tmpRow.find('.label').remove(); //Remove the label.
            tmpRow.removeClass('scaffold');
            
            //Corner case: if colIndex > 2 AND this is the last entry in imgArray
            if(i == imgArray.length-1) {
              this.$el.find('#widgetImages').find('.scaffold').hide();
              return this;
            }
          }
        }
        
        //this.$el.find('#widgetImages').find('.scaffold').remove();
        this.$el.find('#widgetImages').prepend(tmpRow);
        
        this.$el.find('#widgetImages').find('.scaffold').hide();
      }
      //END POPULATION OF IMAGE ARRAY
      
			return this;
		},
    
    
    
    //This function is called when the user clicks on the delete button assigned to an HTML array 
    //element. It's purpose is to remove the array entry from the model.
    deleteHtml: function(event) {
      //debugger;
      
      //Get the contentArray from the model.
      //var this.model = global.frontEndWidgetCollection.models[global.editWidgetView.targetWidget];
      var thisModel = global.editWidgetView.model;
      var contentArray = thisModel.get('contentArray');
      
      //Create a handle for the parent <div>
      var textDiv = $(event.target).parent();
      //Fixes bug where user clicks on fa icon instead of button.
      var textDivClass = textDiv.attr('class');
      if(textDivClass.indexOf('btn') != -1)
        textDiv = textDiv.parent();
      
      var isContent0 = (textDiv.attr('class').indexOf('content0') != -1);
      
      if(isContent0) {
        textDiv.find('textarea').val(''); //Clear the text area
        
        var contentArrayNotEmpty = ((contentArray[0] != "") && (contentArray[0] != undefined))
        
        //Delete contentArray element 0 if it exists
        if(contentArrayNotEmpty) {
          contentArray.splice(0,1);
          thisModel.set('contentArray', contentArray);
          
          thisModel.refreshWidget = true;
          thisModel.save();
        }
      } else {
        
        //Find out what contentArray element this text box is associated with
        var classIndex = textDiv.attr('class').indexOf('content');
        //I might consider adding error handling code here to test. if(classIndex == -1) error
        var contentClass = textDiv.attr('class').slice(classIndex);
        var contentIndex = Number(contentClass.slice(7));
        
        //Delete that element from the contentArray (if it exists)
        contentArray.splice(contentIndex,1);
        thisModel.set('contentArray', contentArray);
        
        //Rerender the UI
        thisModel.refreshWidget = true;
        thisModel.save();
      }
      
      
      
    },
    
    //This function is called when the user clicks on the delete button assigned to the image.
    //It's purpose is to remove the image from the current front end widget.
    deleteImg: function(index) {
      //debugger;
      
      //If index is a click event object, then retrieve the data passed in.
      if(typeof(index) == "object")
        index = index.data[0];
      
      var thisModel = global.editWidgetView.model;
      
      var r = confirm("Are you sure you want to delete this image?");
      if (r == true) {
        var imgArray = thisModel.get('imgUrlArray');
        imgArray.splice(index,1);
        thisModel.set('imgUrlArray', imgArray);
        thisModel.refreshWidget = true;
        thisModel.save();
      }
    },
    
    swapImg: function(index) {
      //debugger;
      
      //If index is a click event object, then retrieve the data passed in.
      if(typeof(index) == "object") {
        index = index.data[0];
        global.editWidgetView.targetImage = index;
      }
      
      //Modal has exited and returns the URL to a selected image
      if(typeof(index) == "string") {
        var imgArray = this.model.get('imgUrlArray');
        
        //An empty image was selected. A new image needs to be pushed into the array.
        if(this.targetImage == -1) {
          imgArray.push(index);
          
        //An existing image was clicked and the selected image needs to replace it.
        } else {
          imgArray[this.targetImage] = index;
        }
        
        this.model.set('imgUrlArray', imgArray);
        this.model.refreshWidget = true;
        this.model.save();
        
        return;
      }
      
      if(index == -1) {
        //console.log('Empty image was clicked');
        global.editWidgetView.targetImage = -1;
      }
      
      global.modalView.browseImageLibrary();
      
    },
    
    
    //This function is called when the user clicks on the 'Add HTML' button.
    //This function adds a new textarea element to the DOM for additional content.
    addHTML: function() {
      //debugger;
      
      var contentArray = this.model.get('contentArray');
      var contentIndex = contentArray.length;
      
      var tmpEntry = this.$el.find('#widgetHTML').find('.scaffold').clone(); //Clone the scaffolding
      tmpEntry.removeClass('scaffold'); //Remove the scaffold class
      tmpEntry.addClass('content'+contentIndex);
      tmpEntry.find('button').click([contentIndex],this.deleteHtml); //Assign a click handler to the delete button
      this.$el.find('#widgetHTML').append(tmpEntry);
      tmpEntry.show();
    },
    
    //This function is called when the suer clicks on the 'Add Image Row' button.
    addImgRow: function() {
      //debugger;
      
      var tmpRow = this.$el.find('#widgetImages').find('.scaffold').clone();
      tmpRow.removeClass('scaffold');
      this.$el.find('#widgetImages').prepend(tmpRow);
      tmpRow.show();
    },
    
    
    //This function gets called anytime any of the input fields are changed.
    //The purpose is to save data in an event-driven way and then sync those changes with the server.
    updateWidget: function(event) {
      debugger;
      //var thisModel = global.frontEndWidgetCollection.models[global.editWidgetView.targetWidget];
      
      this.model.set('title', this.$el.find('#widgetTitle').val());
      this.model.set('desc', this.$el.find('#widgetDesc').val());
      
      // BEGIN SAVING CONTENT ARRAY
      var contentArray = this.model.get('contentArray');
      
      var widgetTextElems = this.$el.find('.widgetText');
      var widgetTextDivs = widgetTextElems.parent();
      for(var i=0; i < widgetTextDivs.length; i++) {
        var thisElem = $(widgetTextDivs[i]);
        var thisClass = thisElem.attr('class');
        
        //Skip the scaffold element if there are other entries.
        if(thisElem.hasClass('scaffold')) {
          if(widgetTextDivs.length != 1) {
            continue;  
          //If this is the only textarea, then save the content and break out of the loop.
          } else {
            
            debugger;
            //var content = thisElem.find('textarea').val();
            var content = tinymce.activeEditor.getContent();
            
            contentArray.push(content);
            
            break;
          }
        }
        
        //Get the contentArray index this textarray element represents
        var classIndex = $(widgetTextDivs[i]).attr('class').indexOf('content');
        //I might consider adding error handling code here to test. if(classIndex == -1) error
        var contentClass = $(widgetTextDivs[i]).attr('class').slice(classIndex);
        var contentIndex = Number(contentClass.slice(7));
        
        var content = thisElem.find('textarea').val();
        
        if(contentIndex >= contentArray.length) {
          contentArray.push(content);
        } else {
          contentArray[contentIndex] = content;
        }
        
      }

      this.model.set('contentArray', contentArray);
      
      global.frontEndWidgetCollection.refreshView = true;
      this.model.refreshWidget = true;
      this.model.save();
      // END SAVING CONTENT ARRAY
      
    },
    
    //This function loads the TinyMCE editor into a textarea element with the given jQuery element ID.
    //e.g.: elemId = "#myDiv"; elemId = ".classSelector"
    loadTinyMCE: function(elemId) {
      debugger;
      
      try {
        
        //if( tinymce.editors.length == 0 ) {
        if( (global.tinymce.initialized == false) || (global.tinymce.currentView != "frontendwidgets") ) {
          
          //Fix corner case where the tinyMCE needs to be removed in order to get the init event to fire.
          if((global.tinymce.currentView != "frontendwidgets")) {
            if((global.tinymce.initialized == true)) {
              //debugger;
              tinymce.remove();
              global.tinymce.initialized = false;
            }
          }
          
          log.push('Initializing TinyMCE editor...')
          
          //Rendering the template destroys the existing TinyMCE editor. I only want to render the template if the TinyMCE editor
          //hasn't been created yet.
          //this.$el.html(this.template);
          //render?
          debugger;
          
        

          tinymce.init({
            selector: elemId,
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
              
              //This code runs with the TinyMCE editor is initialized
              ed.on('init', function(args) {
                debugger;  

                global.tinymce.initialized = true;
                global.tinymce.currentView = 'frontendwidgets';
                log.push('TinyMCE editor initialized.')

                //User clicked on existing page and wants to edit it.
                if( global.tinymce.currentModelIndex != null ) {
                  //global.pagesAddNewView.loadPage(global.tinymce.currentModelIndex);
                  tinymce.activeEditor.setContent(global.editWidgetView.model.attributes.htmlArray[i]);
                  global.tinymce.currentModelIndex = null; //Clear to signal that this request has been processed.
                }
                //User clicked on Add New link in left menu and wants to create a new page.
                //} else {
                //  global.pagesAddNewView.newPage();
                //}
              });
              
              //This function gets called when the user clicks out of the TinyMCE editor
              ed.on('blur', function(event) {
                debugger;
                global.editWidgetView.updateWidget(event);
              });
            },


          });
        //If the TinyMCE editor has already been loaded...
        } else {

          //User clicked the 'Add HTML' button?
          debugger;
          
          
          
          //User clicked on existing page and wants to edit it.
          //if( global.tinymce.currentModelIndex != null ) {
          //  global.pagesAddNewView.loadPage(global.tinymce.currentModelIndex);
          //  global.tinymce.currentModelIndex = null; //Clear to signal that this request has been processed.

          //User clicked on Add New link in left menu and wants to create a new page.
          //} else {
          //  global.pagesAddNewView.newPage();
          //}
        }
        
      } catch(err) {
        console.error('Error while trying to render tinyMCE editor in Front End Widgets View. Error message: ');
        console.error(err.message);
        
        log.push('Error while trying to render inyMCE editor in Front End Widgets View. Error message: ');
        log.push(err.message);
        sendLog();
      }
    }
    

	});

	return FrontEndWidgetView;
});