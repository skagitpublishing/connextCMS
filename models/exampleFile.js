var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * File Upload Model
 * ===========
 * A database model for uploading images to the local file system
 */

var ExampleFile = new keystone.List('ExampleFile');

var myStorage = new keystone.Storage({
    adapter: keystone.Storage.Adapters.FS,
    fs: {
        path: keystone.expandPath('./uploads'), // required; path where the files should be stored
        publicPath: '/public/uploads', // path where files will be served
    }
});

ExampleFile.add({
        //name: { type: Types.Key, required: true, index: true }, //requiring name breaks image upload.
	name: { type: Types.Key, index: true},
  file: { 
		//type: Types.LocalFile, 
    type: Types.File,
    storage: myStorage
		},
  allowedTypes: [ 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain',
                  'audio/mp3', 'audio/x-m4a', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                   'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/x-zip-compressed',
                   'video/mp4'
                  ]      
});


ExampleFile.defaultColumns = 'name';
ExampleFile.register();

