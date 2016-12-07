/*global define*/
define([
	'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',
  'bootstrap-table',
  'text!../../../js/app/templates/frontEndWidget.html'
], function ($, _, Backbone, BootstrapTable, FrontEndWidgetTemplate) {
	'use strict';

	var FrontEndWidgetView = Backbone.View.extend({

		tagName:  'div',
    
    el: '#frontEndWidgetView',  

		template: _.template(FrontEndWidgetTemplate),

		// The DOM events specific to an item.
		events: {
      'click #addHTMLBtn': 'addHTML',
      'click #addImgRowBtn': 'addImgRow'
		},

		initialize: function () {

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
      
      //this.$el.find('#widgetEditor').slideDown(); //Show the widget editor
      this.$el.find('#widgetEditor').show(); //Show the widget editor
      this.$el.find('hr').slideDown(); //Show any hr separators
      
      this.$el.find('#widgetTitle').val(item.get('title'));
      this.$el.find('#widgetDesc').val(item.get('desc'));

      var htmlArray = item.get('contentArray');
      var imgArray = item.get('imgUrlArray');
debugger;      
      //BEGIN POPULATION OF HTML ARRAY
      if((htmlArray.length == 0) || (htmlArray.length == undefined)) {
        //Do nothing. Leave the default HTML the way it is.
      } else {
        
        for(var i=0; i < htmlArray.length; i++) {
          var tmpEntry = this.$el.find('#widgetHTML').find('.scaffold').clone(); //Clone the scaffolding
        
          tmpEntry.removeClass('scaffold'); //Remove the scaffold class
          tmpEntry.find('button').click([i],this.deleteHtml); //Assign a click handler to the delete button
          tmpEntry.find('textarea').val(htmlArray[i]); //Populate the text box
          this.$el.find('#widgetHTML').prepend(tmpEntry);
        }
        
        //Remove the scaffolding element
        this.$el.find('#widgetHTML').find('.scaffold').remove();
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
    deleteHtml: function(index) {
      debugger;
    },
    
    //This function is called when the user clicks on the delete button assigned to the image.
    //It's purpose is to remove the image from the current front end widget.
    deleteImg: function(index) {
      debugger;
    },
    
    swapImg: function(index) {
      debugger;
    },
    
    //This function is called when a user clicks on the delete button for a widget.
    deleteWidget: function(index) {
      debugger;
    },
    
    //This function is called when the user clicks on the 'Add HTML' button.
    //This function adds a new textarea element to the DOM for additional content.
    addHTML: function() {
      debugger;
    },
    
    //This function is called when the suer clicks on the 'Add Image Row' button.
    addImgRow: function() {
      debugger;
    }
    

	});

  //debugger;
	return FrontEndWidgetView;
});