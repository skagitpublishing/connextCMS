//debugger;
var log = []; //Create global variable for logs.

//Global function for sending the log file to me via email.
function sendLog() {
  //debugger;
  //For now, I'll just dump the log into the console until I have email setup.
  console.log('Begin log dump...');
  for( var i = 0; i < log.length; i++ ) {
    console.log(log[i]);
  }
  console.log('...End log dump.');
  
  var obj = new Object();
  obj.log = log;
  $.get('/api/email/sendlog', obj, function(data) {
    console.log('Log file emailed to administrator.');
  });
}

//This function is used to detect the browser used by the website viewer.
//This data is sent in the error log in the event of an issue with the RTB form.
//Source code came from this JSFiddle: http://jsfiddle.net/VhaqM/165/
//Based on this discussion thread in Stack Overflow answer by Danail Gabenski:
//http://stackoverflow.com/questions/5916900/how-can-you-detect-the-version-of-a-browser
function detectBrowser() {
  var _browser = {};  //Used to detect the viewers browser.
  
  //debugger;
  var uagent = navigator.userAgent.toLowerCase(),
      match = '';

  //$("#browserResult").html("User agent string: <b>" + uagent + "</b>");

  _browser.chrome  = /webkit/.test(uagent)  && /chrome/.test(uagent) && !/edge/.test(uagent);
  _browser.firefox = /mozilla/.test(uagent) && /firefox/.test(uagent);
  _browser.msie    = /msie/.test(uagent) || /trident/.test(uagent) || /edge/.test(uagent);
  _browser.safari  = /safari/.test(uagent)  && /applewebkit/.test(uagent) && !/chrome/.test(uagent);
  _browser.opr     = /mozilla/.test(uagent) && /applewebkit/.test(uagent) &&  /chrome/.test(uagent) && /safari/.test(uagent) && /opr/.test(uagent);
  _browser.version = '';

  for (x in _browser) {
    if (_browser[x]) {

      // microsoft is "special"
      match = uagent.match(new RegExp("(" + (x === "msie" ? "msie|edge" : x) + ")( |\/)([0-9]+)"));

      if (match) {
        _browser.version = match[3];
      } else {
        match = uagent.match(new RegExp("rv:([0-9]+)"));
        _browser.version = match ? match[1] : "";
      }

      //$("#browserResult").append("<br/>The browser is <b>" + (x === "opr" ? "Opera" : x) +
      //  "</b> v. <b>" + (_browser.version ? _browser.version : "N/A") + "</b>");
      var browserStr = (x === "opr" ? "Opera" : x);
      var browserVersion = (_browser.version ? _browser.version : "N/A");
      log.push('Browser: '+browserStr+' v. '+browserVersion);
      log.push('Operating system: '+navigator.platform);
      //console.log('Browser: '+browserStr+' v. '+browserVersion);
      //console.log('Operating system: '+navigator.platform);
      break;
    }
  }
  _browser.opera = _browser.opr;
  delete _browser.opr;
}