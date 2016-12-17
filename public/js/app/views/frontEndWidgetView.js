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
      'click #addWidget': 'addWidget',
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
        obj.delete = '<button type="button" class="btn btn-danger btn-xs" onclick="global.frontEndWidgetView.deleteWidget('+i+')"><i class="fa fa-close"></i></button>';

        tableData.push(obj);
      }
      this.$el.find('#widgetTable').bootstrapTable('load', tableData);
      this.$el.find('.fixed-table-loading').hide();
      
    },
    
    //This function is called when a user clicks on the delete button for a widget.
    deleteWidget: function(index) {
      //debugger;
      
      var ans = confirm('Are you sure you want to delete this widget?');
      
      if(ans) {
        
        var thisModel = global.frontEndWidgetCollection.models[index];

        $.get('/api/frontendwidget/'+thisModel.id+'/remove', '', function(data) {
          debugger;
          $('#widgetEditor').hide(); //Hide the widget editor in case we just deleted the widget we're editing.
          global.frontEndWidgetCollection.refreshView = true; 
          global.frontEndWidgetCollection.fetch();
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
      }
    },
    
    //This function is called when the user clicks on the 'Add Widget' button.
    addWidget: function() {
      //debugger;
      
      var newWidget = new FrontEndWidgetModel({title: 'new widget'});
      $.post('/api/frontendwidget/create', newWidget.attributes, function(data) {
        //debugger;
        
        global.frontEndWidgetCollection.refreshView = true;
        global.frontEndWidgetCollection.fetch();
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
      
      this.render();
    },
    
    loadWidget: function(index) {
      //debugger;
      
      //this.$el.find('#widgetEditor').slideDown(); //Show the widget editor
      $('#widgetEditor').show(); //Show the widget editor
      this.$el.find('hr').show(); //Show any hr separators
      
      global.editWidgetView.render(index);
    },
    
    

	});

  //debugger;
	return FrontEndWidgetView;
});