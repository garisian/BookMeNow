// Inject the content script to extract data and then do a callback
function getPageDetails(callback) 
{ 
    chrome.tabs.executeScript(null, { file: 'content.js' }); 
    chrome.runtime.onMessage.addListener(function(message) 
    { 
        callback(message); 
    }); 
};