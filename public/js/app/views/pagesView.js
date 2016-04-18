/*global define*/
define([
	'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',
  'text!../../../js/app/templates/pages.html'
], function ($, _, Backbone, PagesTemplate) {
	'use strict';

	var PagesView = Backbone.View.extend({

		tagName:  'div',
    
    el: '#pagesView', 

		template: _.template(PagesTemplate),

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
		},

		// Re-render the titles of the todo item.
		
    render: function () {
      
      //debugger;
      this.$el.html(this.template);
      global.pagesView.populateTable();
      
      //debugger;
      
      //$('#dashboardView').hide();
      //$('#pagesView').show();
      
			//this.toggleVisible();
			//this.$input = this.$('.edit');
			return this;
		},
    
    populateTable: function() {
      //debugger;
      
      //Loop through each model in the collection.
      //global.pagesCollection.forEach( function(model) {
      for( var i = 0; i < global.pagesCollection.length; i++ ) {
      
        try {
          //debugger;

          var model = global.pagesCollection.models[i];
          
          //Handle corner case of new install with empty DB
          if( (global.pagesCollection.models.length == 1) && (model.id == "") ) {
            return;
          }
          
          //Clone the example row provided in the template.
          var tempRow = global.pagesView.$el.find('#pageRow').clone();

          //Clear the ID copied from the example row.
          tempRow.attr('id', '');

          //Populate the new row with data from the model.
          var pageTitle = model.get('title');
          tempRow.find('th').html('<a href="#/">'+pageTitle+'</a>');
          tempRow.find('th').find('a').attr('onclick', 'global.pagesView.editPage('+i+')');
          
          //Dev Note: The author name should display a 'name' instead of a GUID in its present form, just
          //like the code below for sections does. However, I need to first create a Backbone Model and
          //Collection for user data.
          tempRow.find('.pageAuthor').text(model.get('author'));
          
          //Find and display the section name for this page.
          for( var j=0; j < global.pageSectionCollection.models.length; j++ ) {
            //To-Do: handle pages that are assigned no sections.
            var pageSectionGUID = model.get('sections')[0];
            
            //Match up the GUIDs and display the name of the matching section.
            if( global.pageSectionCollection.models[j].id == pageSectionGUID ) {
              tempRow.find('.pageSections').text(global.pageSectionCollection.models[j].get('name'));
              break;
            }
          }

          var publishedDate = model.get('publishedDate'); //Get date string from model.
          publishedDate = new Date(publishedDate.slice(0,4), publishedDate.slice(5,7)-1, publishedDate.slice(8,10)); //Convert date string to Date object.
          var datestr = (publishedDate.getMonth()+1)+'/'+publishedDate.getDate()+'/'+publishedDate.getFullYear();
          tempRow.find('.pageDate').text(datestr);

          //Remove the 'hidden' attribute copied from the example row.
          tempRow.show();

          //Append the new row to the DOM.
          global.pagesView.$el.find('#pagesTable').append(tempRow);
        } catch(err) {
          console.error('Error encountered in pagesView.populateTable(). Error message:');
          console.error(err.message);
          
          log.push('Error encountered in pagesView.populateTable(). Error message:')
          log.push(err.message)
          sendLog();
        }
        
      }
      //});
      
      
    },
    
    editPage: function(model_index) {
      debugger;
      
      $('#pagesView').hide();
      $('#pagesAddNewView').show();
      
      $('#app-location').text('Pages : Edit Page');
      
      //Load the currently selected model into the TinyMCE state variable so that once
      //the TinyMCE editor has been loaded, it knows which model to load.
      global.tinymce.currentModelIndex = model_index;
      
      //Render the Add New pages View view.
      global.pagesAddNewView.render();
      
      //global.pagesAddNewView.loadPage(model_index);
    }
    

	});

  //debugger;
	return PagesView;
});
