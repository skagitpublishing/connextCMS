'use strict';

/*
 * Express Dependencies
 */
var express = require('express');
var querystring = require("querystring");
var nodemailer = require('nodemailer');
var app = express();
var port = 3000;

/*
 *  Nodemailer setup variables
 */
var gmail_from = 'no.reply.mymailer@gmail.com';
var gmail_username = 'no.reply.mymailer@gmail.com';
var gmail_password = 'xxxxxxxx';


/*
 * Use Handlebars for templating
 */
var exphbs = require('express3-handlebars');
var hbs;

// For gzip compression
app.use(express.compress());

/*
 * Config for Production and Development
 */
if (process.env.NODE_ENV === 'production') {
    // Set the default layout and locate layouts and partials
    app.engine('handlebars', exphbs({
        defaultLayout: 'main',
        layoutsDir: 'dist/views/layouts/',
        partialsDir: 'dist/views/partials/'
    }));

    // Locate the views
    app.set('views', __dirname + '/dist/views');
    
    // Locate the assets
    app.use(express.static(__dirname + '/dist/assets'));

} else {
    app.engine('handlebars', exphbs({
        // Default Layout and locate layouts and partials
        defaultLayout: 'main',
        layoutsDir: 'views/layouts/',
        partialsDir: 'views/partials/'
    }));

    // Locate the views
    app.set('views', __dirname + '/views');
    
    // Locate the assets
    app.use(express.static(__dirname + '/assets'));
}

// Set Handlebars
app.set('view engine', 'handlebars');



/*
 * Routes
 */
//Allow CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Index Page
app.get('/', function(request, response, next) {
    response.render('index');
});

//API for sending emails
app.use('/send_email', function(request, response, next) {
  console.log("Request handler 'send_email' was called.");
  console.log("request.query.email: "+request.query.email);
  
  debugger;
  
  if( request.query.email == undefined ) {
    console.log("No data recieved.");
    response.send('Failure! No data recieved by server.');
  }

  var email = request.query.email;
  var subject = request.query.subject;
  var message = request.query.message;
  
  var responseMessage = "<p>Success!<br>" +
      "You've sent the text: <br>"+
      "email: "+email+"<br>"+
      "subject: "+subject+"<br>"+
      "message: "+message+"<br></p>";
  
  response.send(responseMessage);
  
  debugger;
  
  //Send the info along to gmail to transmit the email using NodeMailer.
  var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: gmail_username,
          pass: gmail_password
      }
  }, {
      // default values for sendMail method
      from: gmail_from,
      //headers: {
      //    'My-Awesome-Header': '123'
      //}
  });
  transporter.sendMail({
      to: email,
      subject: subject,
      text: message
  });
  
});


/*
 * Start it up
 */
app.listen(process.env.PORT || port);
console.log('Express started on port ' + port);
