// This callback function is called when the content script has been 
// injected and returned its results
function onPageDetailsReceived(pageDetails)  { 
    document.getElementById('title').value = pageDetails.title; 
    document.getElementById('url').value = pageDetails.url; 
    document.getElementById('summary').innerText = pageDetails.summary; 
} 

// Run when popup is loaded
window.addEventListener('load', function(evt) {
    chrome.runtime.getBackgroundPage(function(eventPage) {
        // Injects content.js into the current tab's HTML
        eventPage.getPageDetails(onPageDetailsReceived);
    });
});

