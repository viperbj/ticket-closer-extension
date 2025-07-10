document.getElementById('run').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab.url.includes("tt.wlink.com.np")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
    window.close(); // Close popup after triggering script
  } else {
    alert("This only works on ticket pages.");
  }
});

