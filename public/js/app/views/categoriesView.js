/*global define*/
define([
	'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',
  'text!../../../js/app/templates/categories.html'
], function ($, _, Backbone, CategoriesTemplate) {
	'use strict';

	var CategoriesView = Backbone.View.extend({

		tagName:  'div',
    
    el: '#categoriesView', 

		template: _.template(CategoriesTemplate),

		// The DOM events specific to an item.
		events: {
    //  'hidden.bs.modal #categoriesModal': 'refreshView'
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
      for( var i = 0; i < global.postCategoryCollection.length; i++ ) {
      
        try {
          //debugger;

          var model = global.postCategoryCollection.models[i];
          
          //Handle corner case of new install with empty DB
          if( (global.postCategoryCollection.models.length == 1) && (model.id == "") ) {
            return;
          }
          
          //Clone the example row provided in the template.
          var tempRow = global.categoriesView.$el.find('#categoryRow').clone(); 

          //Clear the ID copied from the example row.
          tempRow.attr('id', '');

          //Populate the new row with data from the model.
          var categoryName = model.get('name');
          tempRow.find('th').html('<a href="#/">'+categoryName+'</a>');
          tempRow.find('th').find('a').attr('onclick', 'global.categoriesView.editCategory('+i+')');
          
          //Populate the second column with the category Priority
          var categoryPriority = model.get('priority');
          tempRow.find('.categoryCol2').text(categoryPriority);
          
          //Add the on-click function to the Delete button.
          tempRow.find('.categoryCol4').find('button').attr('onclick', 'global.categoriesView.deleteCategory(global.postCategoryCollection.models['+i+'].id)');

          //Remove the 'hidden' attribute copied from the example row.
          tempRow.show();

          //Append the new row to the DOM.
          this.$el.find('#categoryTable').append(tempRow);
        } catch(err) {
          console.error('Error encountered in categoriesView.populateTable(). Error message:');
          console.error(err.message);
          
          log.push('Error encountered in categoriesView.populateTable(). Error message:')
          log.push(err.message)
          sendLog();
        }
        
      }
      
    },
    
    //This function is called when one of the categories in the categoriesView table is clicked. It updates
    //the form inputs with data from the category model, allowing the user to edit the data.
    editCategory: function(model_index) {
      //debugger;
      
      var model = global.postCategoryCollection.models[model_index];
      
      this.$el.find('#categoryId').val(model.id);
      
      this.$el.find('#categoryName').val(model.get('name'));
      
      this.$el.find('#categoryPriority').val(model.get('priority'));
    },
    
    
    //This function is called when the modal has completed closing. It refreshes the View to make sure
    //any new uploaded files appear in the file table.
    refreshView: function() {
      //debugger;
      
      //.this.render();
      global.postCategoryCollection.refreshView = true;
      global.postCategoryCollection.fetch();
    },
    
    
    deleteCategory: function(id) {
      //debugger;
      var ans = confirm('Are you sure you want to delete this category?');
      
      if(ans) {      
        $.get('/api/postcategory/'+id+'/remove', '', function(data) {
          //debugger;

          if( data.success == true ) {
            log.push('PostCategory object deleted successfully. ID: '+id);
            //global.postCategoryCollection.refreshView = true; //Set flag so view is refreshed after collection is updated.
            //global.postCategoryCollection.fetch();
            //global.fileLibraryView.render();
            global.categoriesView.refreshView();
          } else {
            console.error('PostCategory object not deleted! ID: '+id);
            log.push('PostCategory object not deleted! ID: '+id);
            sendLog();
          }
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
    
    //This function is called when the user clicks on the Submit button.
    createCategory: function() {
      //debugger;
      
      var categoryId = this.$el.find('#categoryId').val();
      
      //Error Handling
      var categoryName = this.$el.find('#categoryName').val();
      if( categoryName == "" ) {

        global.modalView.errorModal('Please enter a category name.');
        return;
      }
      
      var categoryPriority = this.$el.find('#categoryPriority').val();
      //Catch blank entries.
      if( categoryPriority == "" ) {

        global.modalView.errorModal('Please enter a number for the category priority.');
        return;
      }
      
      categoryPriority = Number(categoryPriority);
      //Catch non-integer entries.
      if( isNaN(categoryPriority) ) {

        global.modalView.errorModal('Please enter a number for the category priority.');
        return;
      }
      
      //Throw up the spinning gif waiting modal
      global.modalView.waitingModal();
      
      //Create a new category
      if( categoryId == "" ) {
      
        this.model = global.postCategoryCollection.models[0].clone();
        this.model.id = "";
        this.model.set('_id', '');
        this.model.set('key', '');
        this.model.set('name', categoryName);
        this.model.set('priority', categoryPriority);

        //Send new Model to server
        $.get('/api/postcategory/create', this.model.attributes, function(data) {
          //debugger;

          //The server will return the same object we submitted but with the _id field filled out. A non-blank _id field
          //represents a success.
          if( data.postcategory._id != "" ) {

            log.push('New post category '+data.postcategory._id+' successfully updated.')

            global.modalView.successModal(global.categoriesView.refreshView);
            
          } else { //Fail
            console.error('New post not accepted by server!')
          }
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
      
      //Update existing category.
      } else {
        //debugger;
        
        this.model = global.postCategoryCollection.get(categoryId);
        this.model.set('name', categoryName);
        this.model.set('priority', categoryPriority);
        
        //Update the model on the server.
        $.get('/api/postcategory/'+categoryId+'/update', this.model.attributes, function(data) {
          //debugger;

          //The server will return the same object we submitted but with the _id field filled out. A non-blank _id field
          //represents a success.
          if( data.postcategory._id != "" ) {

            log.push('Existing category '+data.postcategory._id+' successfully updated.')

            global.modalView.successModal(global.categoriesView.refreshView);
            
          } else { //Fail
            console.error('Category updates not accepted by server!')
          }
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
    }
    

	});

  //debugger;
	return CategoriesView;
});
