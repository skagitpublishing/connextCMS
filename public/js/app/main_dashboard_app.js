define([
	'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',
  'bootstrap.min',
	'../../js/app/views/leftMenuView',
  '../../js/app/views/dashboardView',
  '../../js/app/views/pagesView',
  '../../js/app/views/imageLibraryView',
  '../../js/app/views/imageAddNewView',
  '../../js/app/views/pagesAddNewView',
  '../../js/app/views/fileLibraryView',
  '../../js/app/model/ImageUploadModel',
  '../../js/app/model/ImageUploadCollection',
  '../../js/app/model/PostModel',
  '../../js/app/model/PostCollection',
  '../../js/app/model/PostCategoryModel',
  '../../js/app/model/PostCategoryCollection',
  '../../js/app/model/FileUploadModel',
  '../../js/app/model/FileUploadCollection',
  '../../js/app/views/categoriesView',
  'adminlte',
  'logs'
], function ($, _, Backbone, Bootstrap, LeftMenuView, DashboardView, PagesView, ImageLibraryView, ImageAddNewView, 
              PagesAddNewView, FileLibraryView, ImageUploadModel, ImageUploadCollection, PostModel, PostsCollection,
              PostCategoryModel, PostCategoryCollection, FileUploadModel, FileUploadCollection, CategoriesView,
              AdminLTE, Logs) {

  /* 
  TO-DO:
  -tree-view menu on left menu bar isn't working exactly the way I want it to. When you click the Media drop-down, it opens,
  but when you click off of it, it doesn't necessaryily close. It should close when another link is clicked.
  
  */
  
  
  //Global Variables
  global = new Object(); //This is where all global variables will be stored.
  global.serverIp = "104.236.140.111";
  global.serverPort = "80";
  var csrftoken = ""; //Will host the CSRF token for POST calls.
  
  //TinyMCE state.
  global.tinymce = new Object();
  global.tinymce.initialized = false;
  global.tinymce.currentModelIndex = null;
  global.tinymce.selectedImage = null;
  
  //debugger;
  
  detectBrowser(); //Log the current browser and OS being used.
  
  global.leftMenuView = new LeftMenuView();
  global.leftMenuView.render();

  
  //Initialize the dashboard
  global.dashboardView = new DashboardView();
  //debugger;
  global.dashboardView.render();
  
  global.pagesView = new PagesView();
  //pagesView.render();
  
  global.imageLibraryView = new ImageLibraryView();
  //imageLibraryView.render();
  
  global.imageAddNewView = new ImageAddNewView();
  
  global.pagesAddNewView = new PagesAddNewView();
  
  global.fileLibraryView = new FileLibraryView();
  
  global.categoriesView = new CategoriesView();
  
  
  //Generate the ImageUpload Collection if it hasn't been created yet.
  if(global.imageUploadCollection == undefined) {
    //debugger;
    global.imageUploadCollection = new ImageUploadCollection(); //Collection Instance
    global.imageUploadCollection.fetch();
  }
  
  //POST MODEL AND COLLECTION
  //Generate the Post Collection if it hasn't been created yet.
  if(global.postsCollection == undefined) {

    //Do I need this? CT 3-31-16  
    global.postModel = new PostModel();

    global.postsCollection = new PostsCollection(); //Collection Instance
    global.postsCollection.fetch(); 
  }
  
  
  //POST CATEGORY MODEL AND COLLECTION
  //Generate the PostCategory Collection if it hasn't been created yet.
  if(global.postCategoryCollection == undefined) {
    //debugger;

    //Do I need this? CT 3-31-16
    global.postCategoryModel = new PostCategoryModel();

    global.postCategoryCollection = new PostCategoryCollection(); //Collection Instance
    global.postCategoryCollection.fetch(); 
  }
  
  //FILE UPLOAD MODEL AND COLLECTION
  if(global.fileUploadCollection == undefined) {
    //debugger;
    global.fileUploadCollection = new FileUploadCollection(); //Collection Instance
    global.fileUploadCollection.fetch();
  }
  
  
  /*** BEGIN TESTING CODE ***/
  //debugger;
  
  /*** END TESTING CODE ***/
  
  
  log.push('Finished executing main_dashboard_app.js');
  
  
  /*** BEGIN GLOBAL FUNCTIONS ***/
  
  /*** END GLOBAL FUNCTIONS ***/
});
