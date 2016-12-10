/*global define*/
define([
	'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',
  'bootstrap-table',
  '../model/FrontEndWidgetModel.js',
  'text!../../../js/app/templates/editWidget.html',
  'text!../../../js/app/templates/browseImageLibrary.html',
], function ($, _, Backbone, BootstrapTable, FrontEndWidgetModel, EditWidgetTemplate, ImageLibraryTemplate) {
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

		},

    render: function (index) {      
      debugger;
      
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
      if((htmlArray.length == 0) || (htmlArray.length == undefined)) {
        //Do nothing. Leave the default HTML the way it is.
        //debugger;
        
        //On second though, do not need to do the below:
        //Add click handler to delete button above the HTML entry box.
        //this.$el.find('#widgetHTML').find('.scaffold').find('button').click([-1], this.deleteHtml);
      } else {
        
        for(var i=0; i < htmlArray.length; i++) {
          var tmpEntry = this.$el.find('#widgetHTML').find('.scaffold').clone(); //Clone the scaffolding
          var contentSelector = 'content'+i;
          
          tmpEntry.removeClass('scaffold'); //Remove the scaffold class
          tmpEntry.addClass(contentSelector);
          tmpEntry.find('button').click([i],this.deleteHtml); //Assign a click handler to the delete button
          tmpEntry.find('textarea').val(htmlArray[i]); //Populate the text box
          this.$el.find('#widgetHTML').append(tmpEntry);
        }
        
        //Remove the scaffolding element
        //this.$el.find('#widgetHTML').find('.scaffold').remove();
        //Hide the scaffolding element
        this.$el.find('#widgetHTML').find('.scaffold').hide();
      }
      //END POPULATION OF HTML ARRAY
      
      //BEGIN POPULATION OF IMAGE ARRAY
      if((imgArray.length == 0) || (imgArray.length == undefined)) {
        //Do nothing. Leave the default image layout the way it is.
        debugger;
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
          thisImg.find('img').attr('onclick', ''); //Remove the default click handler.
          thisImg.find('img').click([i], this.swapImg); //Assign a click handler to the image to swap out the image with a new one.
          thisImg.find('img').attr('src', imgArray[i]); //Swap out the image with the one assigned to the widget.
          
          //Manage the column index
          colIndex++;
          if(colIndex > 2) {
            colIndex = 0;
            
            this.$el.find('#widgetImages').prepend(tmpRow);
            var tmpRow = this.$el.find('#widgetImages').find('scaffold').clone();
            //tmpRow.find('.label').remove(); //Remove the label.
            tmpRow.removeClass('scaffold');
          }
        }
        
        this.$el.find('#widgetImages').find('.scaffold').remove();
        this.$el.find('#widgetImages').prepend(tmpRow);
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
      debugger;
      
      //If index is a click event object, then retrieve the data passed in.
      if(typeof(index) == "object")
        index = index.data[0];
    },
    
    swapImg: function(index) {
      debugger;
      
      //If index is a click event object, then retrieve the data passed in.
      if(typeof(index) == "object")
        index = index.data[0];
      
      if(index == -1) {
        console.log('Empty image was clicked');
      } else {
        console.log('Existing image was clicked');
      }
      
      var modalView = global.modalView;
      modalView.modalData = {
        title: 'Browse Image Library',
        btn1: '<button type="button" class="btn btn-default" id="mainModalBtn1" data-dismiss="modal">Close</button>',
        btn2: '',
        closeFunc: undefined,
        body: _.template(ImageLibraryTemplate)
      };
      global.modalView.updateModal();
      global.modalView.openModal();
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
      debugger;
    },
    
    
    //This function gets called anytime any of the input fields are changed.
    //The purpose is to save data in an event-driven way and then sync those changes with the server.
    updateWidget: function(event) {
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
            var content = thisElem.find('textarea').val();
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
      
      this.model.refreshWidget = true;
      this.model.save();
      // END SAVING CONTENT ARRAY
      
    }
    

	});

  //debugger;
	return FrontEndWidgetView;
});