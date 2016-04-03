var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * File Upload Model
 * ===========
 * A database model for uploading images to the local file system
 */

var FileUpload = new keystone.List('FileUpload');

FileUpload.add({
        //name: { type: Types.Key, required: true, index: true }, //requiring name breaks image upload.
	name: { type: Types.Key, index: true},
  file: { 
		type: Types.LocalFile, 
		dest: 'public/uploads/files', 
		label: 'File',
		allowedTypes: [ 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain',
                  'audio/mp3', 'audio/x-m4a', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                   'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/x-zip-compressed'
                  ],
		filename: function(item, file) {
			return item.id + '.' + file.extension;
		}
	},
	alt1: { type: String },
  attributes1: { type: String },
  category: { type: String },      //Used to categorize widgets.
  priorityId: { type: String },    //Used to prioritize display order.
	fileName: { type: String },
	parent: { type: String },
	children: { type: String },
  url: {type: String},
  fileType: {type: String}
        
});


FileUpload.defaultColumns = 'name';
FileUpload.register();

