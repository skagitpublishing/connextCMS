// Wait until the DOM has loaded before querying the document
$(document).ready( function() {
  console.log('The program is starting...');

  debugger;

    //$('#flower1').attr('src', 'images/flower1.jpg');
    //$('#flower2').attr('src', 'images/flower2.jpg');
    //$('#flower3').attr('src', 'images/flower3.jpg');

    //$('#coupon1').attr('src', 'images/coupon1.jpg');
    //$('#coupon2').attr('src', 'images/coupon2.jpg');
    //$('#coupon3').attr('src', 'images/coupon3.jpg');

//Post default images if back-end data is unavailable for some reason.
if( imgdata == null ) {

	$('#flower1').attr('src', 'images/flower1.jpg');
    $('#flower2').attr('src', 'images/flower2.jpg');
    $('#flower3').attr('src', 'images/flower3.jpg');

    $('#coupon1').attr('src', 'images/coupon1.jpg');
    $('#coupon2').attr('src', 'images/coupon2.jpg');
    $('#coupon3').attr('src', 'images/coupon3.jpg');

} else {

	try {

		for(var i = 0; i < imgdata.length; i++) {

			//Populate flower images
			if( imgdata[i].key == 'flowers' ) {
			
				try {
					var gallery = imgdata[i];
					var lastimage = gallery.images.length-1;
					
					//Display the last 3 images added to the gallery.
					$('#flower1').attr('src', gallery.images[lastimage].url);
					$('#flower2').attr('src', gallery.images[lastimage-1].url);
					$('#flower3').attr('src', gallery.images[lastimage-2].url);
					
				} catch(err) {
					console.log('Error encountered while trying to load FLOWER images.');
					console.log('Error message: ' + err.message);
				}
				
			
			//Populate coupon images
			} else if( imgdata[i].key == 'coupons' ) {
			
				try {
					var gallery = imgdata[i];
					var lastimage = gallery.images.length-1;
					
					//Display the last 3 images added to the gallery.
					$('#coupon1').attr('src', gallery.images[lastimage].url);
					$('#coupon2').attr('src', gallery.images[lastimage-1].url);
					$('#coupon3').attr('src', gallery.images[lastimage-2].url);
					
				} catch(err) {
					console.log('Error encountered while trying to load COUPON images.');
					console.log('Error message: ' + err.message);
				}
				
			}
			
		}
	
	} catch(err) {
		console.log('There was a catastrophic error trying to load back-end data. Error message:');
		console.log(err.message);
	}

}

//    $('#event1').find('.date').text('01/01/2000');
//    $('#event1').find('.event-title').text('Candy Flowers!');
//    $('#event1').find('p').text('Come eat candy flowers!');

//   $('#event2').find('.date').text('01/01/2000');
//    $('#event2').find('.event-title').text('Candy Flowers!');
//    $('#event2').find('p').text('Come eat candy flowers!');

//    $('#event3').find('.date').text('01/01/2000');
//    $('#event3').find('.event-title').text('Candy Flowers!');
//    $('#event3').find('p').text('Come eat candy flowers!');


//Populate Calendar Data
try {
	debugger;
	//Hide the calendar if we can't retrieve the data from the backend.
	if( blogdata == null ) {
		$('#calendar').hide;

	} else {
		try {
			var calendarCategory = '5627ecaa297f48ca0ad3d8b3'; //Hard-coded. To-Do: fix this to be algorithmically assigned.
			var eventcnt = 0; //Tracks number calendar events we've processed.
			
			//Loop through the blog posts in order to retrieve the ones we're interested in.
			//Note: data is sorted by oldest date first. That's how I'll display them in this demo.
			//Note: I'm also only comparing the first category. I'm assuming each post has only one category.
			for( var i = 0; i < blogdata.posts.length; i++ ) {
				
				//Skip this entry if it's not in the calendar category.
				if( blogdata.posts[i].categories[0] != calendarCategory )
					continue;
					
				else {
					//Get the Date and Month
					var monthStr = blogdata.posts[i].publishedDate.slice(5,7);
					var dayStr = blogdata.posts[i].publishedDate.slice(8,10);
					
					//Post the blog/calendar data to the DOM.
					if( eventcnt == 0 ) {
						$('#event1').find('.date').text(monthStr + '-' + dayStr);
						$('#event1').find('.event-title').html(blogdata.posts[i].content.brief);
						$('#event1').find('p').html(blogdata.posts[i].content.extended);
						eventcnt++;
					}
					if( eventcnt == 1 ) {
						$('#event2').find('.date').text(monthStr + '-' + dayStr);
						$('#event2').find('.event-title').html(blogdata.posts[i].content.brief);
						$('#event2').find('p').html(blogdata.posts[i].content.extended);
						eventcnt++;
					}
					if( eventcnt == 2 ) {
						$('#event3').find('.date').text(monthStr + '-' + dayStr);
						$('#event3').find('.event-title').html(blogdata.posts[i].content.brief);
						$('#event3').find('p').html(blogdata.posts[i].content.extended);
						break;
					}
				}
			}
		} catch(err) {
			console.log('Problem while trying to post data to the calendar. Error message:');
			console.log(err.message);
			$('#calendar').hide; //Hide the calendar.
		}
	}
} catch(err) {
	console.log('There was a catastrophic error trying to load back-end data for the CALENDAR. Error message:');
	console.log(err.message);
}


  console.log('...The program has ended.');
});
