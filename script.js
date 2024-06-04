
        // Initialize the map and set its view to an initial location and zoom level
        const map = L.map('map').setView([0, 0], 13);

        // Load and display tile layers on the map
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(map);

        // Add a marker for the current location
        const marker = L.marker([0, 0]).addTo(map);

        // Elements to display speed and location
        const speedElement = document.getElementById('speed');
        const locationElement = document.getElementById('location');
        const needleElement = document.getElementById('needle');

        // Function to update the map and information display
        function updatePosition(position) {
            const { latitude, longitude, speed } = position.coords;

            // Update map view and marker position
            map.setView([latitude, longitude], 13);
            marker.setLatLng([latitude, longitude]);

            // Update speed and location display
            const speedKmH = (speed * 3.6).toFixed(2); // Convert m/s to km/h
            speedElement.textContent = speed ? speedKmH : '0';
            locationElement.textContent = `Lat: ${latitude.toFixed(5)}, Lon: ${longitude.toFixed(5)}`;

            // Update the needle rotation based on speed
            const speedAngle = speed ? (speed / 50) * 180 : 0; // Assuming max speed is 50 m/s (180 km/h)
            needleElement.style.transform = `translateX(-50%) rotate(${speedAngle}deg)`;
        }

        // Function to handle geolocation errors
        function handleError(error) {
            console.error('Geolocation error:', error);
            locationElement.textContent = 'Unable to retrieve location';
        }

        // Function to show current position on the map
        function showCurrentPosition() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(updatePosition, handleError, {
                    enableHighAccuracy: true,
                    maximumAge: 0,
                    timeout: 5000,
                });
            } else {
                alert('Geolocation is not supported by your browser.');
                locationElement.textContent = 'Geolocation not supported';
            }
        }

        // Show current position by default
        showCurrentPosition();

        // Create a control button for showing current position
        const showPositionButton = L.Control.extend({
            options: {
                position: 'topright'
            },
            onAdd: function () {
                const button = L.DomUtil.create('button', 'btn');
                button.innerHTML = 'My Position';
                button.onclick = showCurrentPosition;
                return button;
            }
        });

        // Add the button to the map
        map.addControl(new showPositionButton());