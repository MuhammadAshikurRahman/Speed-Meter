document.addEventListener('DOMContentLoaded', () => {
    if ('geolocation' in navigator) {
        navigator.geolocation.watchPosition(
            updateSpeedAndLocation,
            handleError,
            { enableHighAccuracy: true, maximumAge: 1000 }
        );
        setInterval(updateLocation, 60000);
    } else {
        alert('Geolocation is not supported by your browser');
    }
});

function updateSpeedAndLocation(position) {
    const speedInMps = position.coords.speed; // speed in meters per second
    const speedInKph = (speedInMps * 3.6).toFixed(2); // convert to kilometers per hour
    document.getElementById('speedValue').textContent = isNaN(speedInKph) ? '0' : speedInKph;
    updateLocation(position);
}

function updateLocation(position) {
    const { latitude, longitude } = position.coords;
    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('location').textContent = data.display_name;
        })
        .catch(error => {
            console.error('Error fetching location:', error);
            document.getElementById('location').textContent = 'Unable to fetch location';
        });
}

function handleError(error) {
    console.error('Geolocation error:', error);
}