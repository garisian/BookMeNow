// Variable indicating saving status on bookmark after submit
var saveStatus = null;

// This callback function is called when the content script has been 
// injected and returned its results
function onPageDetailsReceived(pageDetails)  { 
    document.getElementById('title').value = pageDetails.title; 
    document.getElementById('url').value = pageDetails.url; 
    document.getElementById('summary').innerText = pageDetails.summary; 
} 

// Submit bookmark to the server onclick "Save Bookmark"
function saveBookmark()
{	
    // Prevents instant refresh of App and shows user urlPosting Status'
    event.preventDefault();

    // The URL to POST our data to
    var postUrl = "http://localhost:9635"
    //var postUrl = 'http://httpbin.org/post';

    // Should return method not allowed error
    // var postUrl = 'http://httpbin.org/';

    var xhr = new XMLHttpRequest();

    var title = encodeURIComponent(document.getElementById('title').value);
    var url = encodeURIComponent(document.getElementById('url').value);
    var summary = encodeURIComponent(document.getElementById('summary').value);
    var tags = encodeURIComponent(document.getElementById('tags').value);
    var params = '{\"title\":\"' + title + 
                 '\",\"url\":\"' + url + 
                 '\",\"summary\":\"' + summary +
                 '\",\"tags\":\"' + tags+
                 "\"}";

    xhr.open('POST', postUrl+"?type=addData&data="+params, true);
    // Replace spaces with + 
    //params = params.replace(/%20/g, '+');

    // Set correct header for form data 
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    // Handle request state change events
    xhr.onreadystatechange = function() 
    { 
        if (xhr.readyState == 4) 
        {
            saveStatus.innerHTML = '';
            if (xhr.status == 200) 
            {
                // Success; close app in 1 second
                saveStatus.innerHTML = 'Saved!';
                window.setTimeout(window.close, 1000);
            } else {
                // Update with error from server
                saveStatus.innerHTML = 'Error saving: Server Error -->' + xhr.statusText;
            }
        }
    };

    // Send the request and set status
    xhr.send();
    saveStatus.innerHTML = 'Saving...';
}

// Run when popup is loaded
window.addEventListener('load', function(evt) 
{    
	// Test To see saving code works
    saveStatus = document.getElementById('saveStatus');

	document.getElementById('addbookmark').addEventListener('submit', saveBookmark);

    // Injects content.js into the current tab's HTML
    chrome.runtime.getBackgroundPage(function(eventPage) 
    {
        eventPage.getPageDetails(onPageDetailsReceived);
    });
});

