document.addEventListener("DOMContentLoaded", function () {
    // Dark Mode Toggle
    const toggle = document.getElementById('darkModeToggle');
    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });

    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }

    // Change URL Buttons
    document.querySelectorAll('.change-url').forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const newUrl = prompt('Enter new YouTube URL:');
            if (newUrl) {
                const iframe = document.querySelectorAll('iframe')[index];
                const videoId = newUrl.split('v=')[1]?.split('&')[0] || newUrl.split('/').pop();
                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&vq=small`;
            }
        });
    });

    // Data Usage
    let totalData = parseFloat(localStorage.getItem('totalData')) || 0;
    const totalDataElem = document.getElementById('totalData');
    const currentSpeedElem = document.getElementById('currentSpeed');
    totalDataElem.textContent = totalData;

    function formatBytes(bytes) {
        return (bytes / (1024 * 1024)).toFixed(2);
    }

    function trackData() {
        let resources = performance.getEntriesByType('resource');
        let usage = 0;

        resources.forEach(r => {
            if (!r.alreadyCounted && r.transferSize) {
                usage += r.transferSize;
                r.alreadyCounted = true;
            }
        });

        let mb = parseFloat(formatBytes(usage));
        totalData += mb;
        totalDataElem.textContent = totalData.toFixed(2);
        localStorage.setItem('totalData', totalData);

        let speed = ((mb * 8) / 5).toFixed(2);
        currentSpeedElem.textContent = speed;
    }

    setInterval(trackData, 5000);

    document.getElementById('resetData').addEventListener('click', () => {
        totalData = 0;
        localStorage.setItem('totalData', 0);
        totalDataElem.textContent = '0';
        currentSpeedElem.textContent = '0';
        fetch('/reset', { method: 'POST' });
    });
});

// Add more URL inputs
function addMore() {
    const inputDiv = document.getElementById('url-inputs');
    const newUrl = document.createElement('input');
    newUrl.type = 'url';
    newUrl.name = 'video_url';
    newUrl.placeholder = 'YouTube URL';
    newUrl.required = true;

    const newCount = document.createElement('input');
    newCount.type = 'number';
    newCount.name = 'video_count';
    newCount.placeholder = 'No. of Boxes';
    newCount.min = 1;
    newCount.required = true;

    inputDiv.appendChild(document.createElement('br'));
    inputDiv.appendChild(newUrl);
    inputDiv.appendChild(newCount);
}
