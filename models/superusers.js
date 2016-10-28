
var globalThis; //Used in functions below when 'this' loses context.

function Constructor() {

  //Used in functions below when 'this' loses context.
  globalThis = this;
  
  this.superusers = ['57c88289144da4ea0dc979db'];
  
 
  this.helloWorld = function() {
    //debugger;
    console.log('Hello World!');
  }
  
  return(this);
  
}

exports.Constructor = Constructor;