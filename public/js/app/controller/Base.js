//Dev Note: These are remanents from the example project used when first starting ConnextCMS. 
//They do nothing and are not used, but are left here as example code for features that will be developed in the future.

define(function () {
    function controllerBase(id) {
        this.id = id;
    }

    controllerBase.prototype = {
        setModel: function (model) {
            this.model = model;
        },

        render: function (bodyDom) {
            bodyDom.prepend('<h1>Controller ' + this.id + ' says "' +
                      this.model.getTitle() + '"</h2>');
        }
    };

    return controllerBase;
});
