// Store resolutions in local storage
function storeResolutions() {
    const resolutions = document.getElementById('resolutions').value;
    let storedResolutions = JSON.parse(localStorage.getItem('resolutions')) || [];
    storedResolutions.push({ resolution: resolutions, progress: [] });
    localStorage.setItem('resolutions', JSON.stringify(storedResolutions));

    // Display resolutions after adding
    displayResolutions();
    document.getElementById('resolutions').value = '';
}

// Display resolutions for tracking
function displayResolutions() {
    const resolutionsContainer = document.getElementById('resolutions-container');
    resolutionsContainer.innerHTML = '';
    const storedResolutions = JSON.parse(localStorage.getItem('resolutions')) || [];

    storedResolutions.forEach((item, index) => {
        const resolutionItem = document.createElement('div');
        resolutionItem.innerHTML = `<label>${item.resolution}</label>
                                    <input type="checkbox" id="resolution${index}">`;
        resolutionsContainer.appendChild(resolutionItem);
    });

    const trackButton = document.createElement('button');
    trackButton.textContent = 'Track Progress';
    trackButton.addEventListener('click', trackProgress);
    resolutionsContainer.appendChild(trackButton);
}

// Track progress and update local storage
function trackProgress() {
    const storedResolutions = JSON.parse(localStorage.getItem('resolutions')) || [];

    storedResolutions.forEach((item, index) => {
        const progress = document.getElementById(`resolution${index}`).checked;
        item.progress.push(progress);
    });

    localStorage.setItem('resolutions', JSON.stringify(storedResolutions));
    alert('Progress noted successfully!');

    displayResolutions();
}

// Add a function to generate a chart using Chart.js
function generateChart() {
    const storedResolutions = JSON.parse(localStorage.getItem('resolutions')) || [];

    const labels = storedResolutions.map(item => item.resolution);
    const successfulDaysData = storedResolutions.map(item =>
        item.progress.filter(day => day).length
    );

    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Successful Days',
                data: successfulDaysData,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: Math.max(...successfulDaysData) + 1
                }
            }
        }
    });
}

// Display statistics
function displayStatistics() {
    const statisticsContainer = document.getElementById('statistics-container');
    statisticsContainer.innerHTML = '';
    const storedResolutions = JSON.parse(localStorage.getItem('resolutions')) || [];

    storedResolutions.forEach(item => {
        const resolutionStatistics = document.createElement('div');
        const successfulDays = item.progress.filter(day => day).length;
        const totalDays = item.progress.length;

        resolutionStatistics.innerHTML = `<p>${item.resolution}</p>
                                          <p>Successful Days: ${successfulDays}</p>
                                          <p>Total Days: ${totalDays}</p>`;
        statisticsContainer.appendChild(resolutionStatistics);
    });

    // Call generateChart after displaying statistics
    generateChart();
}

// Check which page is currently active
function setActivePage(page) {
    const links = document.querySelectorAll('nav a');
    links.forEach(link => {
        link.href.includes(page) ? link.classList.add('active') : link.classList.remove('active');
    });
}

// Initialize the application
function init() {
    const mainElement = document.getElementById('main');

    if (mainElement) {
        const url = window.location.pathname;
        const page = url.substring(url.lastIndexOf('/') + 1);

        if (page === 'index.html') {
            mainElement.innerHTML = `
                <div id="add-resolution">
                    <label for="resolutions">Enter Your Resolution:</label>
                    <input type="text" id="resolutions">
                    <button onclick="storeResolutions()">Add Resolution</button>
                </div>

                <div id="track-progress">
                    <h2>Track Progress</h2>
                    <div id="resolutions-container"></div>
                    <button onclick="trackProgress()">Track Progress</button>
                </div>
            `;
        } else if (page === 'tracker.html') {
            mainElement.innerHTML = `
                <div id="resolutions-container"></div>
            `;
            displayResolutions();
        } else if (page === 'statistics.html') {
            mainElement.innerHTML = `
                <div id="statistics-container">
                    <canvas id="myChart"></canvas>
                </div>
            `;
            displayStatistics();
        }

        setActivePage(page);
    } else {
        console.error("Element with ID 'main' not found.");
    }
}

document.addEventListener('DOMContentLoaded', init);
