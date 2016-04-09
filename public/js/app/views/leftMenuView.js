/*global define*/
define([
	'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',
	'text!../../../js/app/templates/leftMenu.html'
], function ($, _, Backbone, LeftMenuTemplate) {
	'use strict';

	var LeftMenuView = Backbone.View.extend({

		tagName:  'div',
    
    el: '#leftMenu',

		template: _.template(LeftMenuTemplate),

		// The DOM events specific to an item.
		events: {
			//'click .toggle':	'toggleCompleted',
			//'dblclick label':	'edit',
			//'click .destroy':	'clear',
			//'keypress .edit':	'updateOnEnter',
			//'keydown .edit':	'revertOnEscape',
			//'blur .edit':		'close'
      'click #dashboardLink': 'showDashboard',
      'click #pagesLink': 'showPages',
      'click #pageList': 'showPages2',
      'click #postsLink': 'showPosts',
      'click #postList': 'showPosts2',
      'click #postAddNew': 'showPostsAddNew',
      'click #pageAddNew': 'showPagesAddNew',
      'click #mediaLink': 'showImageLibrary',
      'click #imageLibraryLink': 'showImageLibrary2',
      'click #imageAddNew': 'showImageAddNew',
      'click .sidebar li a': 'treeMenu',
      'click #fileLibraryLink': 'showFileLibrary',
      'click #categories': 'showCategories'
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
			//this.$el.html(this.template(this.model.toJSON()));
      this.$el.html(this.template);
			//this.$el.toggleClass('completed', this.model.get('completed'));

			//this.toggleVisible();
			//this.$input = this.$('.edit');
			return this;
		},
    
    showDashboard: function() {
      //debugger;
      
      //Hide old Views and show new one.
      $('#dashboardView').show();
      $('#pagesView').hide();
      $('#imageLibraryView').hide();
      $('#imageAddNewView').hide();
      $('#pagesAddNewView').hide();
      $('#fileLibraryView').hide();
      $('#categoriesView').hide();
      
      
      //Remove the 'active' class from the menu item, unless it's a treeview menu item.
      //(treeview) menu items will remove their active class in their click event.
      if( !$('.sidebar-menu').find('.active').hasClass('treeview') )
        $('.sidebar-menu').find('.active').removeClass('active');
      else
        this.closeCollapsableLeftMenu();
      
      //Switch the 'active' class to the selected menu item
      $('#dashboardLink').parent().addClass('active');
      
    
      $('#app-location').text('Dashboard');
    },
    
    //This function shows the down-down menu for Pages in the left menu.
    showPages: function (e) {
      //debugger;
      
      this.treeMenu(e, "#pagesLink");
    },
    
    //This function shows the drop-down menu for Posts in the left menu.
    showPosts: function (e) {
      //debugger;
      
      this.treeMenu(e, "#postsLink");
    },
    
    //This function shows the postsView and hides all other views.
    showPosts2: function (e) {
      //debugger;
      
      //Hide old Views and show new one.
      $('#dashboardView').hide();
      $('#pagesView').hide();
      $('#postsView').show()
      $('#imageLibraryView').hide();
      $('#imageAddNewView').hide();
      $('#pagesAddNewView').hide();
      $('#fileLibraryView').hide();
      $('#categoriesView').hide();
      
      //Remove the 'active' class from the menu item, unless it's a treeview menu item.
      //(treeview) menu items will remove their active class in their click event.
      //if( !$('.sidebar-menu').find('.active').hasClass('treeview') )
      //  $('.sidebar-menu').find('.active').removeClass('active');
      //else
      //  this.closeCollapsableLeftMenu();
      //Switch the 'active' class to the selected menu item
      //$('#pagesLink').parent().addClass('active');
      
      $('#app-location').text('Posts');
      
      //Render the Pages view.
      global.postsView.render();
      //global.pagesAddNewView.render();
      
      //this.treeMenu(e, "#pagesLink");
    },
    
    showPages2: function (e) {
      //debugger;
      
      //Hide old Views and show new one.
      $('#dashboardView').hide();
      $('#pagesView').show();
      $('#imageLibraryView').hide();
      $('#imageAddNewView').hide();
      $('#pagesAddNewView').hide();
      $('#fileLibraryView').hide();
      $('#categoriesView').hide();
      
      //Remove the 'active' class from the menu item, unless it's a treeview menu item.
      //(treeview) menu items will remove their active class in their click event.
      //if( !$('.sidebar-menu').find('.active').hasClass('treeview') )
      //  $('.sidebar-menu').find('.active').removeClass('active');
      //else
      //  this.closeCollapsableLeftMenu();
      //Switch the 'active' class to the selected menu item
      //$('#pagesLink').parent().addClass('active');
      
      $('#app-location').text('Pages');
      
      //Render the Pages view.
      global.pagesView.render();
      //global.pagesAddNewView.render();
      
      //this.treeMenu(e, "#pagesLink");
    },
    
    showPostsAddNew: function() {
      //debugger;
      
      //Hide old Views and show new one.
      $('#dashboardView').hide();
      $('#pagesView').hide();
      $('#pagesAddNewView').hide();
      $('#postsAddNewView').show();
      $('#imageLibraryView').hide();
      $('#imageAddNewView').hide();
      $('#fileLibraryView').hide();
      $('#categoriesView').hide();
      
      //Remove the 'active' class from the menu item, unless it's a treeview menu item.
      //(treeview) menu items will remove their active class in their click event.
      if( !$('.sidebar-menu').find('.active').hasClass('treeview') )
        $('.sidebar-menu').find('.active').removeClass('active');
      //else
      //  this.closeCollapsableLeftMenu();
      //Switch the 'active' class to the selected menu item
      //$('#pagesLink').parent().addClass('active');
      
      $('#app-location').text('Posts : Add New');
      
      //Signal that a blank, new post should be added.
      global.tinymce.currentModelIndex = null;
      
      //Render the Pages view.
      global.postsAddNewView.render();
    },
    
    showPagesAddNew: function() {
      //debugger;
      
      //Hide old Views and show new one.
      $('#dashboardView').hide();
      $('#pagesView').hide();
      $('#pagesAddNewView').show();
      $('#imageLibraryView').hide();
      $('#imageAddNewView').hide();
      $('#fileLibraryView').hide();
      $('#categoriesView').hide();
      
      //Remove the 'active' class from the menu item, unless it's a treeview menu item.
      //(treeview) menu items will remove their active class in their click event.
      if( !$('.sidebar-menu').find('.active').hasClass('treeview') )
        $('.sidebar-menu').find('.active').removeClass('active');
      //else
      //  this.closeCollapsableLeftMenu();
      //Switch the 'active' class to the selected menu item
      //$('#pagesLink').parent().addClass('active');
      
      $('#app-location').text('Pages : Add New');
      
      //Signal that a blank, new post should be added.
      global.tinymce.currentModelIndex = null;
      
      //Render the Pages view.
      global.pagesAddNewView.render();
    },
    
    showImageLibrary: function(e) {
      //debugger;
 /*     
      //Hide old Views and show new one.
      $('#dashboardView').hide();
      $('#pagesView').hide();
      $('#imageLibraryView').show();
      $('#imageAddNewView').hide();
      $('#pagesAddNewView').hide();
      
      //Remove the 'active' class from the menu item, unless it's a treeview menu item.
      //(treeview) menu items will remove their active class in their click event.
      if( !$('.sidebar-menu').find('.active').hasClass('treeview') )
        $('.sidebar-menu').find('.active').removeClass('active');
      //Switch the 'active' class to the selected menu item
      //$('#dashboardLink').parent().addClass('active');
      
      $('#app-location').text('Image Library - View Gallery');
      
      //If the library has already been loaded once, reset the collection before loading the page
      //in case there have been any additions to the library.
      if( global.imageUploadCollection != undefined ) {
        global.imageUploadCollection.reset();
      }
      
      //render the image library page.
      global.imageLibraryView.render();
*/      
      this.treeMenu(e, "#mediaLink");
    },
    
    showImageLibrary2: function(e) {
      //debugger;
      
      //Hide old Views and show new one.
      $('#dashboardView').hide();
      $('#pagesView').hide();
      $('#imageLibraryView').show();
      $('#imageAddNewView').hide();
      $('#pagesAddNewView').hide();
      $('#fileLibraryView').hide();
      $('#categoriesView').hide();
      
      //Remove the 'active' class from the menu item, unless it's a treeview menu item.
      //(treeview) menu items will remove their active class in their click event.
      //if( !$('.sidebar-menu').find('.active').hasClass('treeview') )
      //  $('.sidebar-menu').find('.active').removeClass('active');
      //Switch the 'active' class to the selected menu item
      //$('#dashboardLink').parent().addClass('active');
      
      $('#app-location').text('Image Library - View Gallery');
      
      //If the library has already been loaded once, reset the collection before loading the page
      //in case there have been any additions to the library.
      if( global.imageUploadCollection != undefined ) {
        global.imageUploadCollection.reset();
      }
      
      //render the image library page.
      global.imageLibraryView.render();
      
      //this.treeMenu(e, "#mediaLink");
    },
    
    showImageAddNew: function() {
      //Hide old Views and show new one.
      $('#dashboardView').hide();
      $('#pagesView').hide();
      $('#imageLibraryView').hide();
      $('#imageAddNewView').show();
      $('#pagesAddNewView').hide();
      $('#fileLibraryView').hide();
      $('#categoriesView').hide();
      
      //Remove the 'active' class from the menu item, unless it's a treeview menu item.
      //(treeview) menu items will remove their active class in their click event.
      if( !$('.sidebar-menu').find('.active').hasClass('treeview') )
        $('.sidebar-menu').find('.active').removeClass('active');
      //Switch the 'active' class to the selected menu item
      //$('#dashboardLink').parent().addClass('active');
      
      $('#app-location').text('Image Library - Add New');
      
      //render the image library page.
      global.imageAddNewView.render();
    },
    
    //This function copied from adminlte.js. Moved here as it controls the animation of this view
    //and the animation was getting screwed up.
    treeMenu: function(e, linkElem) {
      //debugger;
      
      //Get the clicked link and the next element
      var $this = $(linkElem);
      var checkElement = $this.next();
      var animationSpeed = $.AdminLTE.options.animationSpeed;
      var _this = $.AdminLTE;
      
      //Check if the next element is a menu and is visible
      if ((checkElement.is('.treeview-menu')) && (checkElement.is(':visible'))) {
        //Close the menu
        checkElement.slideUp(animationSpeed, function () {
          checkElement.removeClass('menu-open');
          //Fix the layout in case the sidebar stretches over the height of the window
          //_this.layout.fix();
        });
        checkElement.parent("li").removeClass("active");
      }
      //If the menu is not visible
      else if ((checkElement.is('.treeview-menu')) && (!checkElement.is(':visible'))) {
        //Get the parent menu
        var parent = $this.parents('ul').first();
        //Close all open menus within the parent
        var ul = parent.find('ul:visible').slideUp(animationSpeed);
        //Remove the menu-open class from the parent
        ul.removeClass('menu-open');
        //Get the parent li
        var parent_li = $this.parent("li");

        //Open the target menu and add the menu-open class
        checkElement.slideDown(animationSpeed, function () {
          //Add the class active to the parent li
          checkElement.addClass('menu-open');
          parent.find('li.active').removeClass('active');
          parent_li.addClass('active');
          //Fix the layout in case the sidebar stretches over the height of the window
          _this.layout.fix();
        });
      }
      //if this isn't a link, prevent the page from being redirected
      if (checkElement.is('.treeview-menu')) {
        try{
          e.preventDefault();
        } catch(err) {
          if( e == undefined ) {
            log.push('treeMenu() called without event.');
          } else {
            console.error('Unhandled error in treeMenu() in leftMenuView.js. Error:');
            console.error(err.message);
            
            log.push('Unhandled error in treeMenu() in leftMenuView.js. Error:');
            log.push(err.message);
            sendLog();
          }
        }
      }
    },
    
    //This function is called to close collapsable menus.
    closeCollapsableLeftMenu: function() {
      //debugger;
      
      var $this = $('.menu-open').parent().find('a');
      var checkElement = $this.next();
      var animationSpeed = $.AdminLTE.options.animationSpeed;
      
      //Check if the next element is a menu and is visible
      if ((checkElement.is('.treeview-menu')) && (checkElement.is(':visible'))) {
        //Close the menu
        checkElement.slideUp(animationSpeed, function () {
          checkElement.removeClass('menu-open');
          //Fix the layout in case the sidebar stretches over the height of the window
          //_this.layout.fix();
        });
        checkElement.parent("li").removeClass("active");
      }
    },
    
    showFileLibrary: function() {
      //debugger;
      
      //Hide old Views and show new one.
      $('#dashboardView').hide();
      $('#pagesView').hide();
      $('#imageLibraryView').hide();
      $('#imageAddNewView').hide();
      $('#pagesAddNewView').hide();
      $('#fileLibraryView').show();
      $('#categoriesView').hide();
      
      //Remove the 'active' class from the menu item, unless it's a treeview menu item.
      //(treeview) menu items will remove their active class in their click event.
      //if( !$('.sidebar-menu').find('.active').hasClass('treeview') )
      //  $('.sidebar-menu').find('.active').removeClass('active');
      //Switch the 'active' class to the selected menu item
      //$('#dashboardLink').parent().addClass('active');
      
      $('#app-location').text('Media Library - Files');
      
      //If the library has already been loaded once, reset the collection before loading the page
      //in case there have been any additions to the library.
      //if( global.imageUploadCollection != undefined ) {
      //  global.imageUploadCollection.reset();
      //}
      
      //render the image library page.
      global.fileLibraryView.render();
    },
    
    showCategories: function() {
      //debugger;
      
      //Hide old Views and show new one.
      $('#dashboardView').hide();
      $('#pagesView').hide();
      $('#imageLibraryView').hide();
      $('#imageAddNewView').hide();
      $('#pagesAddNewView').hide();
      $('#fileLibraryView').hide()
      $('#categoriesView').show();
      
      //Remove the 'active' class from the menu item, unless it's a treeview menu item.
      //(treeview) menu items will remove their active class in their click event.
      //if( !$('.sidebar-menu').find('.active').hasClass('treeview') )
      //  $('.sidebar-menu').find('.active').removeClass('active');
      //Switch the 'active' class to the selected menu item
      //$('#dashboardLink').parent().addClass('active');
      
      $('#app-location').text('Pages : Categories');
      
      //If the library has already been loaded once, reset the collection before loading the page
      //in case there have been any additions to the library.
      //if( global.imageUploadCollection != undefined ) {
      //  global.imageUploadCollection.reset();
      //}
      
      //render the image library page.
      global.categoriesView.render();
    }

		
	});

  //debugger;
	return LeftMenuView;
});
