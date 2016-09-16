# 9/16/16
A modal with control functions have been created as a new Backbone View in /public/js/app/views/modalView.js. This consolidates
all the modal handling into one view. Previously, each View had it's own modal and control and this was leading to problems.
Bootstrap has extensive documentation on the common issues that people experience when trying to use more than one modal on
a website. The other Views have been updated to use this new modal handling functionality.

# 9/13/16
A new 'Private Page' feature has been added to master branch. It allows the user to create both public and private pages. 
The private pages are only accessible to logged-in users. A navigation menu also appears for logged in users and is removed 
if the user is not-logged in.

By default a new page Section is set as 'public'. A page Section should be created that is named 'Private', 'Members', or something 
appropriate. The GUID for that section can be retrieved from the KeystoneJS Admin UI and put into the 
/public/js/serversettings.js file. This section will then become the 'private' page Section. Pages that 
should be private can be assigned to this section.