/*
  response.writeHead(200, { 
    'Content-Type': 'text/plain', 
    //'Cache-Control': 'max-age=3600',
    'Access-Control-Allow-Origin': '*'  //Allow data transfer, satisfy security protocol.
  });
  */
  
  if( (request.query.limit == undefined) || (request.query.limit == 0) ) {
    console.log("No data recieved.");
    response.send('Failure! No data recieved by server.');
    //response.send('done');
  }
  
  var email = querystring.parse(response).email;
  var subject = querystring.parse(response).subject;
  var message = querystring.parse(response).message;
  
  console.log("Response data: " + response);
  response.send('Success!');
  //response.write("Success! You've sent the text: <br></br>"); 
  //response.write("<p>email: " + email +"</p><br>");
  //response.write("<p>subject: " + subject +"</p><br>");
  //response.write("<p>message: " + message +"</p><br>");
  
  debugger;
  
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
  
  return next();