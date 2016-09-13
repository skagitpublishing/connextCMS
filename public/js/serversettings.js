/*
 * This file is the central location for setting the server info. It is set up to work with both vanilla JS files as well as AMD/Require.js enabled JS files.
 */ 

function getServerData() {
  
  //These settings are for the ConnextCMS Demo site. Change them to reflect your own server.
  var serverData = {
   
    //Basic server IP and port for KeystoneJS/ConnextCMS
    serverIp: '45.55.5.16',
    serverPort: '3000', //Not Used
    
    //Mail settings
    mailPort: '8888',
    adminEmail: 'chris.troutner@gmail.com',
    debugEmail: 'chris.troutner@gmail.com',
    additionalEmails: '',
    
    //Section ID used to implement the Private Pages feature.
    privatePagesSection = "57d80ec4fefb50bd0ab178c7"
  }

  return serverData; 

};



//This little bit of code handles AMD enabled JS files that expect a define() function.
if ( typeof define === "function" && define.amd ) {
  define([], getServerData );  
}

