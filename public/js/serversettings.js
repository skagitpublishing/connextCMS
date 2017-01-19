/*
 * This file is the central location for setting the server info. It is set up to work with both vanilla JS files as well as AMD/Require.js enabled JS files.
 */ 

function getServerData() {
  
  //These settings are for the ConnextCMS Demo site. Change them to reflect your own server.
  var serverData = {
    
    //Mail settings
    mailGunDomain: '',
    mailGunApiKey: '',
    adminEmail: 'chris.troutner@gmail.com',
    debugEmail: 'chris.troutner@gmail.com',
    additionalEmails: '',
    
    //Section ID used to implement the Private Pages feature.
    //Replace with the GUID for your own Page Section that you want to make the private page section.
    privatePagesSection: "581bee123cc62305a85c9528"
  }

  return serverData; 

};



//This little bit of code handles AMD enabled JS files that expect a define() function.
if ( typeof(define) === "function" && define.amd ) {
  define([], getServerData );  
}

//Accessing this file from within KeystoneJS node application.
if(typeof(module) != "undefined") {
  module.exports.getServerData = getServerData;
}
