//Dev Note: These are remanents from the example project used when first starting ConnextCMS. 
//They do nothing and are not used, but are left here as example code for features that will be developed in the future.

define(function () {
    function modelBase(title) {
        this.title = title;
    }

    modelBase.prototype = {
        getTitle: function () {
            return this.title;
        }
    };

    return modelBase;
});
