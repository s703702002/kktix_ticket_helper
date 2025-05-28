chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url.includes('/registrations/new')) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['kktix.js'],
    });
  }
});
