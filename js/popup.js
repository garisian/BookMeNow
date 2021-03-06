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
    var email = encodeURIComponent(document.getElementById('email').value);
    var params = '{\"title\":\"' + title + 
                 '\",\"url\":\"' + url + 
                 '\",\"summary\":\"' + summary +
                 '\",\"email\":\"' + email +
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

// Submit bookmark to the server onclick "Save Bookmark"
function emailBookmarks()
{   
    // Prevents instant refresh of App and shows user urlPosting Status'
    event.preventDefault();

    // The URL to POST our data to
    var postUrl = "http://localhost:9635"
    //var postUrl = 'http://httpbin.org/post';

    // Should return method not allowed error
    // var postUrl = 'http://httpbin.org/';

    var xhr = new XMLHttpRequest();

    var email = encodeURIComponent(document.getElementById('email').value);
    var params = '{\"email\":\"' + email +
                 "\"}";

    xhr.open('POST', postUrl+"?type=emailData&data="+params, true);
    // Replace spaces with + 
    //params = params.replace(/%20/g, '+');

    // Set correct header for form data 
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    // Handle request state change events
    xhr.onreadystatechange = function() 
    { 
                
        if (xhr.readyState == 4) 
        {
            emailDataStatus.innerHTML = '';
            if (xhr.status == 200) 
            {
                // Success; close app in 1 second
                emailDataStatus.innerHTML = 'Emailed!';
                window.setTimeout(window.close, 1000);
            } else {
                // Update with error from server
                emailDataStatus.innerHTML = 'Error Emailing: Server Error -->' + xhr.statusText;
            }
        }
    };

    // Send the request and set status
    xhr.send();
    emailDataStatus.innerHTML = 'Emailing...';
}

// Run when popup is loaded
window.addEventListener('load', function(evt) 
{    
	// Created to update Status of save submit and email
    saveStatus = document.getElementById('saveStatus');
    emailDataStatus = document.getElementById('emailDataStatus');

	//document.getElementById('testbookmark').addEventListener('submit', saveBookmark);

    // Injects content.js into the current tab's HTML
    chrome.runtime.getBackgroundPage(function(eventPage) 
    {
        eventPage.getPageDetails(onPageDetailsReceived);
    });
    var element = document.getElementById('save');
    element.onclick = function () { saveBookmark(); };

    var element = document.getElementById('emailData');
    element.onclick = function () { emailBookmarks(); };

});

