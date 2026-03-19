// Background Service Worker
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ theme: 'light' });
  chrome.storage.local.set({ favorites: [] });
  chrome.storage.local.set({ fontSize: 'medium' });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case 'OPEN_SIDEPANEL':
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.sidePanel.open({ tabId: tabs[0].id }, () => {
            sendResponse({ success: true });
          });
        } else {
          sendResponse({ success: false, error: 'No active tab' });
        }
      });
      return true;

    case 'GET_THEME':
      chrome.storage.local.get(['theme'], (data) => {
        sendResponse({ theme: data.theme || 'light' });
      });
      return true;

    case 'SET_THEME':
      chrome.storage.local.set({ theme: request.theme }, () => {
        sendResponse({ success: true });
      });
      return true;

    case 'GET_FAVORITES':
      chrome.storage.local.get(['favorites'], (data) => {
        sendResponse({ favorites: data.favorites || [] });
      });
      return true;

    case 'SET_FAVORITES':
      chrome.storage.local.set({ favorites: request.favorites }, () => {
        sendResponse({ success: true });
      });
      return true;

    case 'GET_SETTINGS':
      chrome.storage.local.get(['fontSize'], (data) => {
        sendResponse({ fontSize: data.fontSize || 'medium' });
      });
      return true;

    case 'SET_SETTINGS':
      chrome.storage.local.set({ fontSize: request.fontSize }, () => {
        sendResponse({ success: true });
      });
      return true;
  }
});
