/*global define*/
define([
	'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',
  'text!../../../js/app/templates/sections.html'
], function ($, _, Backbone, SectionsTemplate) {
	'use strict';

	var SectionsView = Backbone.View.extend({ 

		tagName:  'div',
    
    el: '#sectionsView', 

		template: _.template(SectionsTemplate),

		// The DOM events specific to an item.
		events: {
      //'hidden.bs.modal #sectionsModal': 'refreshView'
		},

		initialize: function () {

		},

    render: function () {      
      //debugger;
      
      this.$el.html(this.template);

      this.populateTable();
      
			return this;
		},
    
    populateTable: function() {
      //debugger;
      
      //Loop through each model in the collection.
      for( var i = 0; i < global.pageSectionCollection.length; i++ ) {
      
        try {
          //debugger;

          var model = global.pageSectionCollection.models[i];
          
          //Handle corner case of new install with empty DB
          if( (global.pageSectionCollection.models.length == 1) && (model.id == "") ) {
            return;
          }
          
          //Clone the example row provided in the template.
          var tempRow = global.sectionsView.$el.find('#sectionRow').clone();

          //Clear the ID copied from the example row.
          tempRow.attr('id', '');

          //Populate the new row with data from the model.
          var sectionName = model.get('name');
          tempRow.find('th').html('<a href="#/">'+sectionName+'</a>');
          tempRow.find('th').find('a').attr('onclick', 'global.sectionsView.editSection('+i+')');
          
          //Populate the second column with the section Priority
          var sectionPriority = model.get('priority');
          tempRow.find('.sectionCol2').text(sectionPriority);
          
          debugger;
          
          //Add the on-click function to the Delete button.
          tempRow.find('.sectionCol4').find('button').attr('onclick', 'global.sectionsView.deleteSection(global.pageSectionCollection.models['+i+'].id)');
          
          //Remove the 'hidden' attribute copied from the example row.
          tempRow.show();

          //Append the new row to the DOM.
          this.$el.find('#sectionTable').append(tempRow);
        } catch(err) {
          console.error('Error encountered in sectionsView.populateTable(). Error message:');
          console.error(err.message);
          
          log.push('Error encountered in sectionsView.populateTable(). Error message:')
          log.push(err.message)
          sendLog();
        }
        
      }
      
    },
    
    //This function is called when one of the sections in the sectionsView table is clicked. It updates
    //the form inputs with data from the section model, allowing the user to edit the data.
    editSection: function(model_index) {
      //debugger;
      
      var model = global.pageSectionCollection.models[model_index];
      
      this.$el.find('#sectionId').val(model.id);
      
      this.$el.find('#sectionName').val(model.get('name'));
      
      this.$el.find('#sectionPriority').val(model.get('priority'));
    },
    
    
    //This function is called when the modal has completed closing. It refreshes the View to make sure
    //any new uploaded files appear in the file table.
    refreshView: function() {
      //debugger;
      
      //Fixing bug where modal backdrop stays in place.
      //$('.modal-backdrop').hide();
      
      //.this.render();
      global.pageSectionCollection.refreshView = true;
      global.pageSectionCollection.fetch();
    },
    
    
    deleteSection: function(id) {
      //debugger;
      
      var ans = confirm('Are you sure you want to delete this section?');
      
      if(ans) { 
        $.get('http://'+global.serverIp+':'+global.serverPort+'/api/pagesection/'+id+'/remove', '', function(data) {
          //debugger;

          if( data.success == true ) {
            log.push('PageSection object deleted successfully. ID: '+id);
            global.pageSectionCollection.refreshView = true; //Set flag so view is refreshed after collection is updated.
            global.pageSectionCollection.fetch();
            //global.fileLibraryView.render();
          } else {
            console.error('PageSection object no deleted! ID: '+id);
            log.push('PageSection object no deleted! ID: '+id);
            sendLog();
          }
        });
      }
    },
    
    //This function is called when the user clicks on the Submit button.
    createSection: function() {
      //debugger;
      
      var sectionId = this.$el.find('#sectionId').val();
      
      //Error Handling
      var sectionName = this.$el.find('#sectionName').val();
      if( sectionName == "" ) {
        //this.$el.find('#successMsgUpload').text('Please enter a section name.');
        //global.sectionsView.$el.find('.modal-sm').find('#waitingGif').hide();
        //global.sectionsView.$el.find('.modal-sm').find('#errorMsg').show();
        //global.sectionsView.$el.find('.modal-sm').find('#errorMsg').html(
        //  '<p>Please enter a section name.</p>'
        //);
        global.modalView.errorModal('Please enter a section name.');
        return;
      }
      
      var sectionPriority = this.$el.find('#sectionPriority').val();
      //Catch blank entries.
      if( sectionPriority == "" ) {
        //this.$el.find('#successMsgUpload').text('Please enter a number for the section priority.');
        //global.sectionsView.$el.find('.modal-sm').find('#waitingGif').hide();
        //global.sectionsView.$el.find('.modal-sm').find('#errorMsg').show();
        //global.sectionsView.$el.find('.modal-sm').find('#errorMsg').html(
        //  '<p>Please enter a number for the section priority.</p>'
        //);
        global.modalView.errorModal('Please enter a number for the section priority.');
        return;
      }
      
      sectionPriority = Number(sectionPriority);
      //Catch non-integer entries.
      if( isNaN(sectionPriority) ) {
        //this.$el.find('#successMsgUpload').text('Please enter a number for the section priority.');
        //global.sectionsView.$el.find('.modal-sm').find('#waitingGif').hide();
        //global.sectionsView.$el.find('.modal-sm').find('#errorMsg').show();
        //global.sectionsView.$el.find('.modal-sm').find('#errorMsg').html(
        //  '<p>Please enter a number for the section priority.</p>'
        //);
        global.modalView.errorModal('Please enter a number for the section priority.');
        return;
      }
      
      //Create a new section
      if( sectionId == "" ) {
      
        this.model = global.pageSectionCollection.models[0].clone();
        this.model.id = "";
        this.model.set('_id', '');
        this.model.set('key', '');
        this.model.set('name', sectionName);
        this.model.set('priority', sectionPriority);

        //Send new Model to server
        $.get('http://'+global.serverIp+':'+global.serverPort+'/api/pagesection/create', this.model.attributes, function(data) {
          //debugger;

          //The server will return the same object we submitted but with the _id field filled out. A non-blank _id field
          //represents a success.
          if( data.pagesection._id != "" ) {

            log.push('New page section '+data.pagesection._id+' successfully updated.')

            //global.sectionsView.$el.find('.modal-sm').find('#waitingGif').hide();
            //global.sectionsView.$el.find('.modal-sm').find('#successMsg').show();
            global.modalView.successModal(global.sectionsView.refreshView);
          } else { //Fail
            console.error('New page not accepted by server!')
          }
        }).fail( function(err) {
          console.error('Problem communicating with server! Failed to create new section.');
        });
      
      //Update existing section.
      } else {
        //debugger;
        
        this.model = global.pageSectionCollection.get(sectionId);
        this.model.set('name', sectionName);
        this.model.set('priority', sectionPriority);
        
        //Update the model on the server.
        $.get('http://'+global.serverIp+':'+global.serverPort+'/api/pagesection/'+sectionId+'/update', this.model.attributes, function(data) {
          //debugger;

          //The server will return the same object we submitted but with the _id field filled out. A non-blank _id field
          //represents a success.
          if( data.pagesection._id != "" ) {

            log.push('Existing section '+data.pagesection._id+' successfully updated.')

            //global.sectionsView.$el.find('.modal-sm').find('#waitingGif').hide();
            //global.sectionsView.$el.find('.modal-sm').find('#successMsg').show();
            global.modalView.successModal(global.sectionsView.refreshView);
          } else { //Fail
            console.error('Section updates not accepted by server!')
          }
        }).fail( function(err) {
          console.error('Problem communicating with server! Failed to update section '+sectionId);
        });
      }
    },
    
    

	});

  //debugger;
	return SectionsView;
});
