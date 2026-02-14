// Theme management
function updateTheme() {
    const now = new Date();
    const hour = now.getHours();
    
    // Light mode: 8 AM (8) to 5 PM (17)
    // Dark mode: 5 PM (17) to 8 AM (8)
    if (hour >= 8 && hour < 17) {
        document.body.className = 'light-mode';
    } else {
        document.body.className = 'dark-mode';
    }
}

// Time management
function updateTimes() {
    const now = new Date();
    
    // Local time
    const localTime = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    document.getElementById('localTime').textContent = localTime;
    
    // Sofia, Bulgaria time (UTC+2 in winter, UTC+3 in summer - EET/EEST)
    const sofiaTime = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Europe/Sofia'
    });
    document.getElementById('sofiaTime').textContent = sofiaTime;
    
    // Date
    const date = now.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short'
    });
    document.getElementById('date').textContent = date;
}

// Weather management
async function updateWeather() {
    try {
        // Using Open-Meteo API (no authentication required)
        // First, we need coordinates for zip code 70817 (Baton Rouge, LA)
        // Approximate coordinates: 30.4515° N, 91.1871° W
        const lat = 30.4515;
        const lon = -91.1871;
        
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&temperature_unit=fahrenheit&timezone=auto`
        );
        
        if (!response.ok) {
            throw new Error('Weather API request failed');
        }
        
        const data = await response.json();
        const tempF = Math.round(data.current.temperature_2m);
        const tempC = Math.round((tempF - 32) * 5 / 9);
        
        document.getElementById('temperature').textContent = `${tempF}°F / ${tempC}°C`;
    } catch (error) {
        console.error('Error fetching weather:', error);
        document.getElementById('temperature').textContent = '--°F / --°C';
    }
}

// Initialize and set up intervals
function init() {
    // Update immediately
    updateTheme();
    updateTimes();
    updateWeather();
    
    // Update times every second
    setInterval(updateTimes, 1000);
    
    // Update theme every minute (to catch the hour change)
    setInterval(updateTheme, 60000);
    
    // Update weather every 15 minutes (900000 ms)
    setInterval(updateWeather, 900000);
}

// Start when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
