var keystone = require('keystone');

var User = keystone.list('User');
var security = keystone.security;

var Mailgun = require('mailgun-js'); //Mailgun API library.
var serverData = require('./../../private/privatesettings.json');

/**
 * Send an email
 */
exports.send = function(req, res) {
  debugger;
  
  var data = (req.method == 'POST') ? req.body : req.query;

  if(data.html == "true")
    data.html = true;
  if(data.html == "false")
    data.html = false;
  
  var val = sendEmail(data);
  
  if(val) {
    res.apiResponse({
			success: val
		});
  } else {
    res.apiError('Invalid MailGun settings.', val);
  }

}


//This function send an email based on the emailData object passed in
//emailData.email = a single email address to send to
//emailData.from = from address
//emailData.subject = email subject
//emailData.body = email body
//emailData.html = true/false if body is HTML or plain text.
function sendEmail(emailData) {
  debugger;
  
  console.log('sending email...');
  
  //Process email address in query string.
  var email = emailData.email;

  if(email.indexOf('@') == -1) {  //Reject if there is no @ symbol.
    console.log('Invalid email: '+email);
  }
  console.log('Got email address: '+email);
  email = email.split(',');  //Convert into an array. Works for single emails & multiple csv emails.

  
  //Error handling - undefined email
  if( email == undefined ) {
    console.log('Failure: email == undefined');
  }
  
  var subject = emailData.subject;
  var body = emailData.body;
  
  
  
  
  //Send the email log via MailGun email.
  var emailObj = new Object();
  emailObj.email = email;
  emailObj.subject = subject;
  emailObj.message = body
  emailObj.from = emailData.from;
  
  if((emailData.html != undefined) && (typeof(emailData.html) == "boolean")) {
    emailObj.html = true;
  } else {
    emailObj.html = false;
  }
  
  //Error handling
  if((serverData.mailGunDomain == '') || (serverData.mailGunApiKey == '')) {
    return false;
  }
  
  sendMailGun(emailObj);
  
  //Return success.
  return true;
}


//This function sends an email using MailGun using an emailObj.
//emailObj = {
//  email = array of strings containing email addresses
//  subject = string for subject line
//  message = text message to email
//  html = (default = false). True = message contains html and should be treated as html.
//}
function sendMailGun(emailObj) {
  debugger;
  
  //Error Handling - Detect invalid emailObj
  if(
    //Conditions for exiting:
    (emailObj.email == undefined) ||
    (emailObj.subject == undefined) || (emailObj.subject == "") ||
    (emailObj.message == undefined) || (emailObj.message == "")
    ) 
  {
    console.log('Invalid email Object passed to sendMailGun(). Aborting.');
    debugger;
    return false;
  }
  
  //Error Handling - Detect any invalid email addresses
  for(var i=0; i < emailObj.email.length; i++) {
    if(emailObj.email[i].indexOf("@") == -1) {
      if(emailObj.email[i] == "") {
        //debugger;
        emailObj.email.splice(i,1); //Remove any blank entries from the array.
      } else {
        console.log('Error! sendMailGun() - Invalid email address passed: '+emailObj.email[i]); 
        return;
      }
    }
  }
  
  //Sort out the optional input html flag
  var html = false;
  if((emailObj.html != undefined) && (typeof(emailObj.html) == "boolean"))
    html = emailObj.html;
  
  //Send an email for each email address in the array via Mailgun API
  var api_key = serverData.mailGunApiKey;
  var domain = serverData.mailGunDomain;
  var from_who = emailObj.from;
  var mailgun = new Mailgun({apiKey: api_key, domain: domain});
  
  for( var i=0; i < emailObj.email.length; i++ ) {
  
    //Error handling.
    if(emailObj.email[i] == "")
      continue;
    
      if(html) {
        var data = {
          from: from_who,
          to: emailObj.email[i],
          subject: emailObj.subject,
          html: emailObj.message
        };
      } else {
        var data = {
          from: from_who,
          to: emailObj.email[i],
          subject: emailObj.subject,
          text: emailObj.message
        };
      }
      
      
      mailgun.messages().send(data, function(err, body) {
        if(err) {
          console.log('Got an error trying to send email with sendMailGun(): ', err);
          debugger;
        } else {
          console.log('Sent email successfully with sendMailGun()');
        }
      });
  }
}

//This function is responsible for sending an error log to the administrator.
exports.sendlog = function(req, res) {
  //Process email address in query string.
  var email = [serverData.debugEmail];
  var subject = "[ConnextCMS Error] "+new Date();
  
  var log = req.query.log;
  var body = "";
  for(var i=0; i < log.length; i++) {
    body += i+'. '+log[i]+'\n';  
  }
  
  //Send the email log via MailGun email.
  var emailObj = new Object();
  emailObj.email = email;
  emailObj.subject = subject;
  emailObj.message = body
  emailObj.from = serverData.adminEmail;
  
  //Error handling
  if((serverData.mailGunDomain == '') || (serverData.mailGunApiKey == '')) {
    return res.apiError('Invalid MailGun settings.');
  }
  
  sendMailGun(emailObj);
  
  //Return success.
  return res.apiResponse({
    success: true
  });

}


exports.resetpassword = function(req, res) {
  debugger;
  
  var data = req.query;
  
  User.model.findOne().where('email', data.email).exec(function(err, item) {
    debugger;
    
    if(err) return res.apiError('database error', err);
    if(!item) return res.apiError('email user not found');
    
    //Generate a random string of characters
    var randomstring = Math.random().toString(36).slice(-10);
    
    item.set('password', randomstring);
    
    item.save(function(err) {
      if(err) return res.apiError('could not save', err);
      
      var emailObj = new Object();
      emailObj.email = item.get('email');
      emailObj.subject = "ConnextCMS Password Reset";
      emailObj.body = "Your password has been reset. Your new password is: "+randomstring;
      emailObj.from = serverData.adminEmail;
      
      var val = sendEmail(emailObj);
  
      if(val) {
        res.apiResponse({
          success: val
        });
      } else {
        res.apiError('Invalid MailGun settings.', val);
      }
      
    });
    
  });
}