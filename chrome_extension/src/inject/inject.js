chrome.extension.sendMessage({}, function (response) {
	var readyStateCheckInterval = setInterval(function () {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);

			// CLASSNAME OF THE UL LIST CONTAINER
			var div = document.getElementsByClassName('eofif8h5')[0];


			if (window.location.href.indexOf("https://www.ticketswap.com/listing") > -1) {
				console.log('buy ticket');

				// CLASSNAME OF THE BUY FORM
				var formClass3 = 'e2a8jjg3';
				childNodesLength = document.getElementsByClassName(formClass3)[0].childNodes.length;

				console.log(childNodesLength);

				document.getElementsByClassName(formClass3)[0].childNodes[childNodesLength - 2].click();

			} else if (div) {
				console.log('ticket exists');

				console.log('ticket location', div.childNodes[0].childNodes[0].childNodes[0].href);
				// open href 
				window.location.assign(div.childNodes[0].childNodes[0].childNodes[0].href)

			}

			// else if(window.location.href.indexOf("https://www.ticketswap.com/cart")){
			// 	notifyMe();

			// }
			else {
				console.log("ticket doesn't exist");

				console.log('refresh page');

				// refresh page
				window.location.reload();
			}


		}
	}, 10);
});


// function notifyMe() {
// 	// Let's check if the browser supports notifications
// 	if (!("Notification" in window)) {
// 	  alert("This browser does not support system notifications");
// 	  // This is not how you would really do things if they aren't supported. :)
// 	}

// 	// Let's check whether notification permissions have already been granted
// 	else if (Notification.permission === "granted") {
// 	  // If it's okay let's create a notification
// 	  var notification = new Notification("You can purchase your ticket!");
// 	}

// 	// Otherwise, we need to ask the user for permission
// 	else if (Notification.permission !== 'denied') {
// 	  Notification.requestPermission(function (permission) {
// 		// If the user accepts, let's create a notification
// 		if (permission === "granted") {
// 			var notification = new Notification("You can purchase your ticket!");
// 		}
// 	  });
// 	}

// 	// Finally, if the user has denied notifications and you 
// 	// want to be respectful there is no need to bother them any more.
//   }