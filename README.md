
# ConnextCMS
[ConnextCMS](http://connextcms.com) is a front end extension for [KeystoneJS](https://github.com/keystonejs/keystone) 
with a user interface similar to that 
of WordPress or Shopify. It uses the Backbone.js framework to structure the code and Require.js to modularize it. 
The client side code interacts with KeystoneJS via a REST API, allowing development and debugging of your CMS to 
take place in the browser. The main features include:

* Local File and Image Hosting
* Automatic Image Resizing
* Email routing with [Mailgun](http://mailgun.com)
* Debugging & Development in the Browser
* JavaScript Homogeneity: JavaScript is the only programming language running the website.

## [Try the Live Demo](http://demo.connextcms.com/)

## Useful Links
* [The Blog](http://connextcms.com/blog) is where the latest project news gets published.
* [Documentation](http://connextcms.com/documentation/) can be found on the project website.
* [Videos](http://connextcms.com/page/videos) are also available for a quick introduction to the ins and outs of the project.
* [Bugs and New Feature Requests](https://github.com/skagitpublishing/ConnextCMS/issues) should be reported on the Issues section of this repository.
* [Clone the Demo](http://connextcms.com/page/clone-your-own) for the easiest way to get started with ConnextCMS.
* [Community Support](https://groups.google.com/forum/#!forum/connextcms) is available through a Google Groups mailing list.
* [Premium Support](http://connextcms.com/page/premium-support) is available through [Skagit Connext](http://skagitconnext.com/).
* [Software Roadmap](https://github.com/skagitpublishing/ConnextCMS/wiki/6.-Software-Roadmap) is available on the Wiki.

## Installation
Because of the complexity of KeystoneJS, the added complexity of the ConnextCMS code, and the installation pitfalls
between different operating systems and versions of node, there is no good way to document the installation of this 
software for a broad category of users. To solve this issue, ConnextCMS is being built exclusively for use in a
[Docker Container](https://www.docker.com/what-docker).

Please review the readme for the [docker-container repository for ConnextCMS](https://github.com/skagitpublishing/docker-connextcms). 
Running the software inside Docker streamlines setup and ensures the widest compatibility between operating systems.

For additional setup instructions, See [the Installation Documentation](http://connextcms.com/documentation/overview.html#installationOptions) for details.



## Documentation and Support
The easiest way to get up to speed on installing and using ConnextCMS is to watch the series of 
[instructional videos](http://connextcms.com/page/videos) that have been created. It is also strongly 
recommended that you familiarize yourself with the [KeystoneJS documentation](http://keystonejs.com/docs/). 
ConnextCMS is built using the Backbone.js and Require.js frameworks. 
[Developing Backbone.js Applications](https://addyosmani.com/backbone-fundamentals/) is a well 
written, free, open source book for learning about how to use these two frameworks.

## License
(The MIT License)

Copyright (c) 2017 [Skagit Publishing](http://skagitconnext.com/)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


## Attribution
ConnextCMS is built on top of the following software packages:
* [KeystoneJS](https://github.com/keystonejs/keystone) for core CMS functionality.
* [AdminLTE](https://github.com/almasaeed2010/AdminLTE) for control panel templating.
* [Caman.js](https://github.com/meltingice/CamanJS) for image resizing.
* [Backbone.js](http://backbonejs.org/) to structure the client side code.
* [Require.js](http://requirejs.org/) to modularize the client side code.
* [Node.js](http://nodejs.org/) to execute server side code JavaScript code.
* [jQuery](http://jquery.com/) for manipulating the DOM and handling AJAX calls to the API interface.
* [Bootstrap](http://getbootstrap.com/) framework for site design.
