//The build will inline common dependencies into this file.

//For any third party dependencies, like jQuery, place them in the lib folder.

//Configure loading modules from the lib directory,
//except for 'app' ones, which are in a sibling
//directory.
requirejs.config({
    baseUrl: '../../js/lib',
    //paths: {
    //    app: '../app'
    //},
    shim: {
        'backbone_0.9.2': {
            //deps: ['jquery_1.8.0', 'underscore_1.3.3'],
            deps: ['jQuery-2.1.4.min', 'underscore_1.3.3'],
            exports: 'Backbone'
        },
        'underscore_1.3.3': {
            exports: '_'
        },
        'jQuery-2.1.4.min': {
          exports: '$'
        },
        'bootstrap.min': {
          deps: ['jQuery-2.1.4.min'],
          exports: 'Bootstrap'
        },
        'adminlte': {
          deps: ['jQuery-2.1.4.min', 'bootstrap.min'],
          exports: 'AdminLTE'
        },
        'logs': {
          exports: 'Logs'
        },
        'caman.full.min': {
          deps: ['jQuery-2.1.4.min'],
          exports: 'Caman'
        },
        'canvas-to-blob': {
          exports: 'CanvasToBlob'
        },
        'tinymce/tinymce.min': {
          deps: ['jQuery-2.1.4.min'],
          exports: 'TinyMCE'
        },
        'bootstrap-datepicker.min': {
          deps: ['jQuery-2.1.4.min', 'bootstrap.min'],
          exports: 'Datepicker'
        }
    }
});
