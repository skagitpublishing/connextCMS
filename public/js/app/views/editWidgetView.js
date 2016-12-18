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
      'change .widgetText': 'updateWidget',
      'click #delHTMLBtn': 'delHTML',
      'change .urlText': 'updateWidget',
      'click #addUrlBtn': 'addUrl',
      'click #delUrlBtn': 'delUrl'
    },

    initialize: function () {
      this.targetWidget = -1; //Index that points to the currently loaded Widget.
      this.targetImage = -1; //Index that points to the currently selected image within a widget.
      
      //URL Array variables
      this.selectedUrl = undefined;
    },

    render: function (widgetIndex, htmlIndex, urlIndex) {      
      //debugger;
      
      this.$el.html(this.template);

      if(widgetIndex != undefined) {
        this.model = global.frontEndWidgetCollection.models[widgetIndex];
      
        this.targetWidget = widgetIndex;
      }
      
      this.$el.find('#widgetTitle').val(this.model.get('title'));
      this.$el.find('#widgetDesc').val(this.model.get('desc'));

      var contentArray = this.model.get('contentArray');
      var imgArray = this.model.get('imgUrlArray');
   
      //BEGIN POPULATION OF HTML ARRAY
      if(htmlIndex != undefined) {
        global.tinymce.currentModelIndex = htmlIndex;
      } else {
        global.tinymce.currentModelIndex = 0;  
      }
      
      //Load the currently selected contentArray element into the TinyMCE editor.
      global.tinymce.initialized = false;
      this.loadTinyMCE('.widgetText')
        
      //Initialize buttons used for selecting content.
      for( var i=0; i < contentArray.length; i++) {
        if(i == 0) {
          var tmpBtn = this.$el.find('.btnScaffold');
          tmpBtn.click([i], this.loadContent);
        } else {
          var tmpBtn = this.$el.find('#contentBtnDiv').find('.btnScaffold').clone(); //Clone the first button

          tmpBtn.text(i); //Change button text to the index of the contentArray.
          tmpBtn.removeClass('btnScaffold');
          tmpBtn.removeClass('active'); //In case the btnScaffold was set active and this got copied.
          tmpBtn.click([i],this.loadContent); //Assign a click handler to the delete button

          this.$el.find('#contentBtnDiv').append(tmpBtn);
        }
        
        
        //Change the appearance of the button representing the current content.
        if(i == global.tinymce.currentModelIndex) {
          tmpBtn.addClass('active');
        }
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
      
      
      //BEGIN POPULATION OF URL ARRAY
      if(urlIndex != undefined) {
        this.selectedUrl = urlIndex;
      } else {
        this.selectedUrl = 0;  
      }
      
      //Load the currently selected contentArray element into the TinyMCE editor.
      var urlArray = this.model.get('urlArray');
      if(urlArray[this.selectedUrl] != undefined)
        this.$el.find('.urlText').val(urlArray[this.selectedUrl]);
        
      //Initialize buttons used for selecting content.
      for( var i=0; i < urlArray.length; i++) {
        if(i == 0) {
          var tmpBtn = this.$el.find('.urlBtn');
          tmpBtn.click([i], this.loadUrl);
        } else {
          var tmpBtn = this.$el.find('#linkBtnDiv').find('.urlBtn').clone(); //Clone the first button

          tmpBtn.text(i); //Change button text to the index of the contentArray.
          tmpBtn.removeClass('urlBtn');
          tmpBtn.removeClass('active'); //In case the btnScaffold was set active and this got copied.
          tmpBtn.click([i],this.loadUrl); //Assign a click handler to the delete button

          this.$el.find('#linkBtnDiv').append(tmpBtn);
        }
        
        
        //Change the appearance of the button representing the current content.
        if(i == this.selectedUrl) {
          tmpBtn.addClass('active');
        }
      }
      //END POPULATION OF URL ARRAY
      
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
      contentArray.push("");
      this.model.set('contentArray', contentArray);
      
      this.render(this.targetWidget, contentIndex);
      
    },
    
    delHTML: function(event) {
      //debugger;
      
      var ans = confirm('Are you sure you want to delete the current content element?');
      
      if(ans) {
        var contentIndex = global.tinymce.currentModelIndex; 
        var contentArray = this.model.get('contentArray');
        contentArray.splice(contentIndex,1);
        this.model.set('contentArray', contentArray);
        
        global.tinymce.currentModelIndex = null;
        
        this.model.refreshWidget = true;
        this.model.save();
      }
    },
    
    //This function gets called when the user clicks on one of the buttons representing an index in the contentArray.
    //It's scope is to load the content stored in that index of the contentArray into the TinyMCE editor.
    loadContent: function(index) {
      //debugger;
      
      //Retrieve the index from the event object
      if(typeof(index) == "object") {
        index = index.data[0];
        global.editWidgetView.targetImage = index;
      }
      
      $('#contentBtnDiv').find('button').removeClass('active'); //Remove the active styling from all buttons.
      $($('#contentBtnDiv').find('button')[index]).addClass('active'); //Add the active styling to the button that was just clicked.
      
      global.tinymce.currentModelIndex = index;
      global.editWidgetView.loadTinyMCE('.widgetText'); //Load the TinyMCE Editor into this new textarea
      
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
      //debugger;
      //var thisModel = global.frontEndWidgetCollection.models[global.editWidgetView.targetWidget];
      
      this.model.set('title', this.$el.find('#widgetTitle').val());
      this.model.set('desc', this.$el.find('#widgetDesc').val());
      
      // BEGIN SAVING CONTENT TO CONTENT ARRAY
      var contentArray = this.model.get('contentArray');
      
      var widgetTextElems = this.$el.find('.widgetText');

      var thisElem = widgetTextElems.parent().parent().first();
      var thisClass = thisElem.attr('class');

      var content = tinymce.activeEditor.getContent();

      if(global.tinymce.currentModelIndex == null) {
        contentArray.push(content);  
      } else {
        contentArray[global.tinymce.currentModelIndex] = content;
      }
   
      //Update the model.
      this.model.set('contentArray', contentArray);
      // END SAVING CONTENT TO CONTENT ARRAY
      
      
      // BEGIN SAVING URL TEXT TO THE URL ARRAY
      var urlArray = this.model.get('urlArray');
      
      var inputText = this.$el.find('.urlText').val();
      
      //Skip if the input text field is blank.
      if(inputText != "") {
        debugger;
        //Push the entry into the array if the array is empty.
        if((this.selectedUrl == undefined) || (urlArray.length == 0) ) {
          urlArray.push(inputText);
        //Swap out the content for the selected array element if that element already exists.
        } else {
          urlArray[this.selectedUrl] = inputText;
        }
        
        this.model.set('urlArray', urlArray);
      }
      // END SAVING URL TEXT TO THE URL ARRAY
      
      
      //Update the server and refresh the view when done.
      global.frontEndWidgetCollection.refreshView = true;
      this.model.refreshWidget = true;
      this.model.save();
    },
    
    //This function loads the TinyMCE editor into a textarea element with the given jQuery element ID.
    //e.g.: elemId = "#myDiv"; elemId = ".classSelector"
    loadTinyMCE: function(elemId) {
      //debugger;
      
      try {
        
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
                //debugger;  

                global.tinymce.initialized = true;
                global.tinymce.currentView = 'frontendwidgets';
                log.push('TinyMCE editor initialized.')

                //User clicked on existing page and wants to edit it.
                if( (global.tinymce.currentModelIndex != null) ) {
                  
                  if(global.editWidgetView.model.attributes.contentArray.length == 0) {
                    global.editWidgetView.model.attributes.contentArray = [""];
                  }
                  
                  tinymce.activeEditor.setContent(global.editWidgetView.model.attributes.contentArray[global.tinymce.currentModelIndex]);
                }

              });
              
              //This function gets called when the user clicks out of the TinyMCE editor
              ed.on('blur', function(event) {
                //debugger;
                global.editWidgetView.updateWidget(event);
              });
            },


          });
        
        //If the TinyMCE editor has already been loaded...
        } else {

          if( global.tinymce.currentModelIndex != null ) {
            //Load the selected content into the TinyMCE editor.
            tinymce.activeEditor.setContent(global.editWidgetView.model.attributes.contentArray[global.tinymce.currentModelIndex]);
          }
          
        }
        
        
      } catch(err) {
        console.error('Error while trying to render tinyMCE editor in Front End Widgets View. Error message: ');
        console.error(err.message);
        
        log.push('Error while trying to render inyMCE editor in Front End Widgets View. Error message: ');
        log.push(err.message);
        sendLog();
      }
    },
    
    //This function is called when the user clicks on one of the buttons above the URL Array text box.
    loadUrl: function(index) {
      //debugger;
      
      //Retrieve the index from the event object
      if(typeof(index) == "object") {
        index = index.data[0];
        //global.editWidgetView.selectedUrl = index;
      }
      
      global.editWidgetView.render(this.targetWidget, global.tinymce.currentModelIndex, index);
    },
    
    //This function is called when the user clicks on the '+' button to add a URL to the urlArray.
    addUrl: function() {
      //debugger;
      
      var urlArray = this.model.get('urlArray');
      var urlIndex = urlArray.length;
      urlArray.push("");
      this.model.set('urlArray', urlArray);
      
      this.render(this.targetWidget, global.tinymce.currentModelIndex, urlIndex);
    },
    
    //This function is called when the user clicks on the '-' button to delete a URL in the urlArray.
    delUrl: function() {
      //debugger;
      
      var ans = confirm('Are you sure you want to delete the current URL entry?');
      
      if(ans) {
        var contentIndex = global.editWidgetView.selectedUrl; 
        var urlArray = this.model.get('urlArray');
        urlArray.splice(contentIndex,1);
        this.model.set('urlArray', urlArray);
        
        global.editWidgetView.selectedUrl = null;
        
        this.model.refreshWidget = true;
        this.model.save();
      }
    }
    

	});

	return FrontEndWidgetView;
});