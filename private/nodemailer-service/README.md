## Introduction

This is a simple Node/Express app that creates an REST API for sending mail with the Node Mailer library.

## Setup
The setup instructions below assume you are developing on a Ubuntu 14.04 x64 machine, like the kind provided in Droplets by Digital Ocean.

1) Install Node
    curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
    sudo apt-get install -y nodejs
    sudo apt-get install -y build-essential
    
2) Install Git
    sudo apt-get install git

3) Clone this repository and cd into it
    git clone https://github.com/christroutner/nodemailer-service
    cd nodemailer-service
    
4) Install Dependencies
    npm install express
    npm install nodemailer
    npm install express3-handlebars
    
5) Edit the global variables in app.js to reflect your gmail login/password settings.

6) Start the service:
    node app.js
    
7) Copy the 'html' directory to your local computer and open the test_email.html file in your browser.
    

### Developed with:
Node: v5.4.1
npm: 3.3.12
    
    

Author: Chris Troutner - http://ChrisTroutner.com

