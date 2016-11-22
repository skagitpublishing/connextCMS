//This model contains metadata for files uploaded using the /FileChunk API.
//This model does NOT use the KeystoneJS 0.4+ FS storage adapter. It depends on the flow.js library instead.

var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * File Upload Model
 * ===========
 * A database model for uploading images/files to the local file system
 */

var FileUpload2 = new keystone.List('FileUpload2');

//var myStorage = new keystone.Storage({
//    adapter: keystone.Storage.Adapters.FS,
//    fs: {
//        path: keystone.expandPath('./public/uploads/files'), // required; path where the files should be stored
//        publicPath: '/public/uploads/files', // path where files will be served
//    }
//});

FileUpload2.add({
        //name: { type: Types.Key, required: true, index: true }, //requiring name breaks image upload.
	name: { type: Types.Key, index: true},
  //file: { 
		//type: Types.LocalFile, 
  //  type: Types.File,
  //  storage: myStorage
		//dest: 'public/uploads/files', 
		//label: 'File',
		//allowedTypes: [ 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain',
    //              'audio/mp3', 'audio/x-m4a', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //               'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/x-zip-compressed',
    //               'video/mp4'
    //              ],
		//filename: function(item, file) {
		//	return item.id + '.' + file.extension;
		//}
	//},
  createdTimeStamp: { type: String },
  alt1: { type: String },
  attributes1: { type: String },
  category: { type: String },      //Used to categorize widgets.
  priorityId: { type: String },    //Used to prioritize display order.
	parent: { type: String },
	children: { type: String },
  url: {type: String},
  fileType: {type: String}
        
});


FileUpload2.defaultColumns = 'name';
FileUpload2.register();

