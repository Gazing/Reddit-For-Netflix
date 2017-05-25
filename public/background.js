
chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    if(details.frameId === 0) {

        chrome.tabs.get(details.tabId, function(tab) {
            if(tab.url === details.url) {
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {method: "onRouteChanged"}, function(response) {
                        console.log("Route changed!");
                    });
                });
            }
        });
    }
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.isLoaded) {
            chrome.browserAction.setBadgeBackgroundColor({color:[245, 67, 22, 255]});
            console.log("Content.js loaded");
        }

    }
);
