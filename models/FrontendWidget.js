var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Frontend Widget Model
 * ===========
 * Frontend Widgets are simply links to image URLs that will be posted to the front-end.
 * This model intended can be updated with a custom UI or the KeystoneJS backend.
 */

var FrontendWidget = new keystone.List('FrontendWidget', {
        map: { name: 'title' }
});

FrontendWidget.add({
        title: { type: String, required: true },
        url1: { type: String },
        alt1: { type: String },
        attributes1: { type: String },
        category: { type: String },      //Used to categorize widgets.
        priorityId: { type: String },    //Used to prioritize display order.
        url2: { type: String },
        alt2: { type: String },
        attributes2: { type: String },
        content1: { type: String },
        content2: { type: String },
        content3: { type: String },
        content4: { type: String },
        trans1: { type: String }, //default transformaiton
        trans2: { type: String }

});


FrontendWidget.defaultColumns = 'title';
FrontendWidget.register();

