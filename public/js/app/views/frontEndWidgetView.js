/*global define*/
define([
	'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',
  'bootstrap-table',
  '../model/FrontEndWidgetModel.js',
  'text!../../../js/app/templates/frontEndWidget.html'
], function ($, _, Backbone, BootstrapTable, FrontEndWidgetModel, FrontEndWidgetTemplate) {
	'use strict';

	var FrontEndWidgetView = Backbone.View.extend({

		tagName:  'div',
    
    el: '#frontEndWidgetView',  

		template: _.template(FrontEndWidgetTemplate),

		// The DOM events specific to an item.
		events: {
      'click #addHTMLBtn': 'addHTML',
      'click #addImgRowBtn': 'addImgRow',
      'click #addWidget': 'addWidget',
      'change #widgetTitle': 'updateWidget',
      'change #widgetDesc': 'updateWidget',
      'change .widgetText': 'updateWidget'
		},

		initialize: function () {
      this.targetWidget = -1; //Index that points to the currently loaded Widget.

		},

    render: function () {      
      //debugger;
      
      this.$el.html(this.template);

      this.populateTable();
      
			return this;
		},
    
    //This function is called by render. It's purpose is to initialize and populate the bootstrap
    //table with data from the Front End Widgets Collection.
    populateTable: function() {
      //debugger;
      
      //Catch corner case of empty DB
      if((global.frontEndWidgetCollection.models.length == 1) && 
         (global.frontEndWidgetCollection.models[0].get('_id') == "") &&
         (global.frontEndWidgetCollection.models[0].get('title') == "") )
          return;
      
      //Initialize the table.
      this.$el.find('#widgetTable').bootstrapTable({
        sortName: 'entry',
        sortOrder: 'desc',
        showExport: false,
        columns: [{
          field: 'entry',
          title: 'Entry',
          sortable: true
        }, {
          field: 'title',
          title: 'Title',
          sortable: true
        }, {
          field: 'desc',
          title: 'Description',
          sortable: true
        }, {
          field: 'GUID',
          title: 'GUID',
          sortable: true
        }, {
          field: 'delete',
          title: 'Delete',
          sortable: false
        }        
        ],
      });

      //Loop through the Keep Out coordinates.
      var tableData = [];
      for(var i=0; i < global.frontEndWidgetCollection.length; i++) {
        var item = global.frontEndWidgetCollection.models[i];
        var obj = new Object();

        obj.entry = i;
        obj.title = '<a href="#/" onclick="global.frontEndWidgetView.loadWidget('+i+')">'+item.get('title')+'</a>';
        obj.desc = item.get('desc');
        obj.GUID = item.get('_id');
        obj.delete = '<button type="button" class="btn btn-danger btn-xs"><i class="fa fa-close" onclick="global.frontEndWidgetView.deleteWidget('+i+')"></i></button>';

        tableData.push(obj);
      }
      this.$el.find('#widgetTable').bootstrapTable('load', tableData);
      this.$el.find('.fixed-table-loading').hide();
      
    },
    
    loadWidget: function(index) {
      //debugger;
      
      var item = global.frontEndWidgetCollection.models[index];
      
      this.targetWidget = index;
      
      //this.$el.find('#widgetEditor').slideDown(); //Show the widget editor
      this.$el.find('#widgetEditor').show(); //Show the widget editor
      this.$el.find('hr').slideDown(); //Show any hr separators
      
      this.$el.find('#widgetTitle').val(item.get('title'));
      this.$el.find('#widgetDesc').val(item.get('desc'));

      var htmlArray = item.get('contentArray');
      var imgArray = item.get('imgUrlArray');
   
      //BEGIN POPULATION OF HTML ARRAY
      if((htmlArray.length == 0) || (htmlArray.length == undefined)) {
        //Do nothing. Leave the default HTML the way it is.
        debugger;
        
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
          this.$el.find('#widgetHTML').prepend(tmpEntry);
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
    },
    
    //This function is called when the user clicks on the delete button assigned to an HTML array 
    //element. It's purpose is to remove the array entry from the model.
    deleteHtml: function(event) {
      debugger;
      
      //If index is a click event object, then retrieve the data passed in.
      //if(typeof(index) == "object")
      //  index = index.data[0];
      
      //-1 means there is no entry created yet, just clear the textarea.
      //if(index == -1) {
      //  this.$el.find('.widgetText').val(''); //Clear text area
      //}
      
      var thisModel = global.frontEndWidgetCollection.models[this.targetWidget];
      var contentArray = thisModel.get('contentArray');
      
      var textDiv = $(event.target).parent();
      var isContent0 = textDiv.attr('class').indexOf('content0');
      
      if(isContent0) {
        $(event.target).val(''); //Clear the text area
        
        //Delete contentArray element 0 if it exists
        if(contentArray[0]) {
          contentArray.splice(0,1);
        }
      } else {
        
        //Find out what contentArray element this text box is associated with
        
        //Delete that element from the contentArray (if it exists)
        
        //Remove the text area 
        $(event.target).parent().remove();  
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
    },
    
    //This function is called when a user clicks on the delete button for a widget.
    deleteWidget: function(index) {
      debugger;
      
      var thisModel = global.frontEndWidgetCollection.models[index];
      
      $.get('/api/frontendwidget/'+thisModel.id+'/remove', '', function(data) {
        debugger;
        
        global.frontEndWidgetCollection.refreshView = true;
        global.frontEndWidgetCollection.fetch();
      });
    },
    
    //This function is called when the user clicks on the 'Add HTML' button.
    //This function adds a new textarea element to the DOM for additional content.
    addHTML: function() {
      debugger;
      
      var targetModel = global.frontEndWidgetCollection.models[this.targetWidget];
      var contentArray = targetModel.get('contentArray');
      var contentIndex = contentArray.length+1;
      
      var tmpEntry = this.$el.find('#widgetHTML').find('.scaffold').clone(); //Clone the scaffolding
      tmpEntry.removeClass('scaffold'); //Remove the scaffold class
      tmpEntry.find('button').click([contentIndex],this.deleteHtml); //Assign a click handler to the delete button
      this.$el.find('#widgetHTML').prepend(tmpEntry);
    },
    
    //This function is called when the suer clicks on the 'Add Image Row' button.
    addImgRow: function() {
      debugger;
    },
    
    //This function is called when the user clicks on the 'Add Widget' button.
    addWidget: function() {
      debugger;
      
      var newWidget = new FrontEndWidgetModel({title: 'new widget'});
      $.post('/api/frontendwidget/create', newWidget.attributes, function(data) {
        debugger;
        
        global.frontEndWidgetCollection.refreshView = true;
        global.frontEndWidgetCollection.fetch();
      });
      
      this.render();
    },
    
    //This function gets called anytime any of the input fields are changed.
    //The purpose is to save data in an event-driven way and then sync those changes with the server.
    updateWidget: function() {
      var thisModel = global.frontEndWidgetCollection.models[this.targetWidget];
      
      thisModel.set('title', this.$el.find('#widgetTitle').val());
      thisModel.set('desc', this.$el.find('#widgetDesc').val());
      
      //var widgetTextElems = this.$el.find('.widgetText');
      //for(var i=0; i < widgetTextElems.length; i++) {
      //  debugger;
      //}
      
      debugger;
      var widgetTextElems = this.$el.find('.widgetText').val();
      var tmpArray = thisModel.get('contentArray');
      tmpArray.push(widgetTextElems);
      thisModel.set('contentArray', tmpArray);
      
      thisModel.save();
    }
    

	});

  //debugger;
	return FrontEndWidgetView;
});