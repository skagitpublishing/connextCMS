/*
The modal view is a single modal that lives in a <div> on the dashboard.hbs page, with the ID 'modalView'. 
All other views use this single modal to display information rather than implement individual modal windows
per Backbone View, which what I tried to do originally. That led to problems, so this is the fix.
*/


define([
	'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',  
  'text!../../../js/app/templates/modal.html'
], function ($, _, Backbone, ModalTemplate) {
	'use strict';

	var ModalView = Backbone.View.extend({

		tagName:  'div',
    
    el: '#modalView', 

		template: _.template(ModalTemplate),

		// The DOM events specific to an item.
		events: {
      'hidden.bs.modal #mainModal': 'runCloseFunc'
		},

		initialize: function () {

		},

    modalData: {
      title: 'Modal Title',
      body: '<p>Modal body text.</p>',
      btn1: '<button type="button" class="btn btn-default" id="mainModalBtn1" data-dismiss="modal">Close</button>',
      btn2: '<button type="button" class="btn btn-primary" id="mainModalBtn2" >Save changes</button>',
      closeFunc: undefined
    },
    
    render: function () {
      //debugger;
      
      this.$el.html(this.template);
      
      //Show the div containing the modal.
      $('#modalView').show();
      
      //Update the modal with the default data.
      this.updateModal();
      
			return this;
		},
    
    
    
    openModal: function() {
      this.$el.find('#mainModal').modal('show');
    },
    
    closeModal: function() {
      this.$el.find('#mainModal').modal('hide');
    },
    
    //This function updates the modal title, body, and footer based on the title, body, and button data in modalData.
    updateModal: function() {
      this.$el.find('#mainModalTitle').text(this.modalData.title);
      this.$el.find('#mainModalBody').html(this.modalData.body);
      this.$el.find('#mainModalFooter').html(this.modalData.btn1+this.modalData.btn2);
    },
    
    //This function executes the function assigned to modalData.closeFunc when the modal is closed. The function must be specified every time.
    runCloseFunc: function() {
      //debugger;
      if(this.modalData.closeFunc != undefined) {
        this.modalData.closeFunc(); //Execute the function once.
        this.modalData.closeFunc = undefined; //clear the function so that it is only run once.
      }
    }
    
    
	});

  //debugger;
	return ModalView;
});
