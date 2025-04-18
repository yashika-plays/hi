document.addEventListener("DOMContentLoaded", function () {
    // Dark Mode Toggle
    const toggle = document.getElementById('darkModeToggle');
    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });

    // Restore dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }

    // Real Data Usage Tracking
    let totalData = parseFloat(localStorage.getItem('totalData')) || 0;
    const totalDataElem = document.getElementById('totalData');
    const currentSpeedElem = document.getElementById('currentSpeed');
    totalDataElem.textContent = totalData;

    function formatBytes(bytes) {
        return (bytes / (1024 * 1024)).toFixed(2); // Convert to MB
    }

    function trackRealDataUsage() {
        let resources = performance.getEntriesByType('resource');
        let pageLoadData = 0;

        resources.forEach(entry => {
            if (!entry.alreadyCounted) {
                if (entry.transferSize) {
                    pageLoadData += entry.transferSize;
                    entry.alreadyCounted = true;
                }
            }
        });

        let mbUsed = parseFloat(formatBytes(pageLoadData));
        totalData += mbUsed;
        totalDataElem.textContent = totalData.toFixed(2);
        localStorage.setItem('totalData', totalData);

        // Estimate speed over last 5 seconds
        let speedMbps = ((mbUsed * 8) / 5).toFixed(2); // Mbps = MB * 8 / seconds
        currentSpeedElem.textContent = speedMbps;
    }

    setInterval(trackRealDataUsage, 5000);

    // Reset Data Usage
    document.getElementById('resetData').addEventListener('click', function () {
        totalData = 0;
        localStorage.setItem('totalData', totalData);
        totalDataElem.textContent = '0';
        currentSpeedElem.textContent = '0';
    });

    // Change URL Buttons
    document.querySelectorAll('.change-url').forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const newUrl = prompt('Enter new YouTube URL:');
            if (newUrl) {
                const iframe = document.querySelectorAll('iframe')[index];
                const videoId = newUrl.split('v=')[1]?.split('&')[0] || newUrl.split('/').pop();
                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}`;
            }
        });
    });
});
