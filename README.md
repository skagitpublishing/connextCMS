# ConnextCMS
[ConnextCMS.com](http://connextcms.com) is a front end extension for KeystoneJS. It uses the Backbone.js framework to structure the code and Require.js to modularize it. The client side code interacts with KeystoneJS via a REST API, allowing development and debugging of your CMS to take place in the browser. The main features include:
* Local File and Image Hosting
* Automatic Image Resizing
* Email routing with Nodemailer
* Debugging & Development in the Browser
* JavaScript Homogeneity: JavaScript is the only programming language running the website.

## [Try the Live Demo](http://107.170.244.232:3000/)

## Useful Links
* [Documentation](https://github.com/skagitpublishing/ConnextCMS/wiki) can be found the Wiki for this repository.
* [Videos](http://connextcms.com/page/videos) are also available for a quick introduction to the ins and outs of the project.
* [Bugs and New Feature Requests](https://github.com/skagitpublishing/ConnextCMS/issues) should be reported on the Issues section of this repository.
* [Clone the Demo](http://connextcms.com/page/clone-your-own) for the easiest way to get started with ConnextCMS.
* [Community Support](https://groups.google.com/forum/#!forum/connextcms) is available through a Google Groups mailing list.
* [Premium Support](http://connextcms.com/page/premium-support) is available through [Skagit Connext](http://skagitconnext.com/).
* [Software Roadmap](https://github.com/skagitpublishing/ConnextCMS/wiki/Software-Roadmap) is available on the Wiki.

## Installation
There are two ways to install ConnextCMS. The easy way is to [clone the demo droplet](http://connextcms.com/page/clone-your-own). The second is to build from source. 

### Clone the Demo
ConnextCMS is designed to run on a [Digital Ocean Droplet](https://m.do.co/c/8f47a23b91ce) VPS. A snapshot has been created that you can clone and spin up in a few minutes with all software and dependencies installed. Visit [ConnextCMS.com](http://connextcms.com) and [fill out this form](http://connextcms.com/page/clone-your-own). 

### Build from Source
Complete instructions for building from source are still in the process of being written, but the general outline is as follows:
 1. Install [KeystoneJS](https://github.com/keystonejs/keystone) and get it operational. 
 2. Clone this repository.
 3. Run the _copy-keystone_ and _merge-connextcms-keystone_ scripts.
More details can be found in [the documentation](https://github.com/skagitpublishing/ConnextCMS/wiki/Installation).

## Documentation and Support
The easiest way to get up to speed on installing and using ConnextCMS is to watch the series of [instructional videos](http://connextcms.com/page/videos) that have been created. It is also strongly recommended that you familiarize yourself with the [KeystoneJS documentation](keystonejs.com/docs/). ConnextCMS is built using the Backbone.js and Require.js frameworks. [Developing Backbone.js Applications](https://addyosmani.com/backbone-fundamentals/) is a well written, free, open source book for learning about how to use these two frameworks.

## License
(The MIT License)

Copyright (c) 2016 [Skagit Connext](http://skagitconnext.com/)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


## Attribution
ConnextCMS is built on top of the following software packages:
* [KeystoneJS](https://github.com/keystonejs/keystone) for core CMS functionality.
* [AdminLTE](https://github.com/almasaeed2010/AdminLTE) for control panel templating.
* [Caman.js](https://github.com/meltingice/CamanJS) for image resizing.
* [Nodemailer](https://github.com/nodemailer/nodemailer) for email routing.
* [Backbone.js](http://backbonejs.org/) to structure the client side code.
* [Require.js](http://requirejs.org/) to modularize the client side code.
* [Node.js](http://nodejs.org/) to execute server side code JavaScript code.
* [jQuery](http://jquery.com/) for manipulating the DOM and handling AJAX calls to the API interface.
* [Bootstrap](http://getbootstrap.com/) framework for site design.
