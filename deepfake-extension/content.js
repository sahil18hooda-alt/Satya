const API_URL = "https://sahil909-satya-backend.hf.space";

function injectButton() {
    if (document.getElementById('deepfake-detect-btn')) return;

    const ownerElement = document.querySelector('#owner');
    if (!ownerElement) return;

    const btn = document.createElement('button');
    btn.id = 'deepfake-detect-btn';
    btn.innerHTML = '🕵️ Detect AI';
    btn.style.cssText = `
        background-color: #ef4444; 
        color: white; 
        border: none; 
        border-radius: 18px; 
        padding: 8px 16px; 
        margin-left: 10px; 
        font-weight: bold; 
        cursor: pointer; 
        font-family: Roboto, Arial, sans-serif;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 6px;
    `;

    btn.onclick = analyzeVideo;
    ownerElement.appendChild(btn);
}

async function analyzeVideo() {
    const btn = document.getElementById('deepfake-detect-btn');
    const originalText = btn.innerHTML;

    btn.innerHTML = '⏳ Scanning...';
    btn.disabled = true;
    btn.style.backgroundColor = '#64748b';

    try {
        const response = await fetch(`${API_URL}/detect-youtube`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: window.location.href })
        });

        const data = await response.json();

        if (data.isFake) {
            btn.innerHTML = `❌ Likely AI (${(data.confidence * 100).toFixed(0)}%)`;
            btn.style.backgroundColor = '#b91c1c';
            alert(`WARNING: Deepfake Detected!\nConfidence: ${(data.confidence * 100).toFixed(0)}%\n\nThis video shows signs of AI manipulation.`);
        } else {
            btn.innerHTML = `✅ Real Video`;
            btn.style.backgroundColor = '#15803d';
            alert(`Verified: Likely Authentic.\nConfidence: ${(data.confidence * 100).toFixed(0)}%`);
        }

    } catch (e) {
        console.error(e);
        btn.innerHTML = '⚠️ Error';
        btn.style.backgroundColor = '#f59e0b';
        alert('Failed to analyze video. Backend might be busy or offline.');
    } finally {
        setTimeout(() => {
            btn.disabled = false;
            // btn.innerHTML = originalText; // Keep result visible
        }, 5000);
    }
}

// Observer to handle YouTube's SPA navigation
const observer = new MutationObserver(() => {
    if (window.location.href.includes('watch')) {
        injectButton();
    }
});

observer.observe(document.body, { childList: true, subtree: true });
// Initial check
if (window.location.href.includes('watch')) injectButton();
