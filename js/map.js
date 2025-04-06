// Google Maps API integration for California RV Trip Map

// Global variables for map elements
let map;
let routePath;
let markers = [];
let infoWindows = [];
let locationTypes = {};

// Export map controls for use from main.js
window.mapControls = {
    showAll: function() {
        showAllMapElements();
    },
    showRVParks: function() {
        filterMarkersByType('rv');
    },
    showAttractions: function() {
        filterMarkersByType('attraction');
    },
    showRoute: function() {
        hideAllMarkers();
        if (routePath) routePath.setMap(map);
    }
};

// Main initialization function
function initMap() {
    // Get map container
    const mapContainer = document.getElementById('trip-map');
    
    if (!mapContainer) return;
    
    // Check if Google Maps API is available
    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
        console.error('Google Maps API not loaded');
        mapContainer.innerHTML = '<div style="text-align: center; padding: 50px;"><p>Google Maps could not be loaded. Please refresh the page.</p></div>';
        return;
    }
    
    // Define the initialization function for Google Maps API
    try {
        // Define locations with extended data
        const locations = [
            { 
                position: {lat: 33.9416, lng: -118.4085}, 
                title: 'LAX Airport', 
                type: 'airport',
                description: 'Your trip starts here! Arrive at LAX by 1:00 PM.',
                day: 1
            },
            { 
                position: {lat: 33.8316, lng: -118.2816}, 
                title: 'Cruise America RV Rental', 
                type: 'rv',
                description: 'Pick up your 30\' Class C RV that will be your home for the next 11 days.',
                day: 1
            },
            { 
                position: {lat: 33.8303, lng: -118.0827}, 
                title: 'Walmart Supercenter', 
                type: 'shopping',
                description: 'Stock up on groceries and supplies for your journey.',
                day: 1
            },
            { 
                position: {lat: 33.9592, lng: -118.4486}, 
                title: 'Dockweiler RV Park', 
                type: 'rv',
                description: 'Beach-side camping with full hookups. Enjoy amazing sunset views.',
                day: 1
            },
            { 
                position: {lat: 34.0522, lng: -118.2437}, 
                title: 'Los Angeles Attractions', 
                type: 'attraction',
                description: 'Explore Hollywood, Santa Monica Pier, and Griffith Observatory.',
                day: 2
            },
            { 
                position: {lat: 35.3733, lng: -119.0187}, 
                title: 'Bakersfield River Run RV Park', 
                type: 'rv',
                description: 'Overnight stop with full hookups and amenities.',
                day: 3
            },
            { 
                position: {lat: 37.8651, lng: -120.2341}, 
                title: 'Yosemite Pines RV Resort', 
                type: 'rv',
                description: 'Gateway to Yosemite with pool, petting zoo, and hiking trails.',
                day: 4
            },
            { 
                position: {lat: 37.7490, lng: -119.5885}, 
                title: 'Yosemite Valley', 
                type: 'attraction',
                description: 'Experience the breathtaking beauty of Yosemite National Park.',
                day: 5
            },
            { 
                position: {lat: 38.9543, lng: -119.9448}, 
                title: 'Lake Tahoe KOA', 
                type: 'rv',
                description: 'Enjoy the crystal-clear waters of Lake Tahoe and surrounding mountains.',
                day: 6
            },
            { 
                position: {lat: 38.9548, lng: -120.0994}, 
                title: 'Emerald Bay State Park', 
                type: 'attraction',
                description: 'One of Tahoe\'s most photographed locations with stunning vistas.',
                day: 7
            },
            { 
                position: {lat: 37.6391, lng: -122.4921}, 
                title: 'San Francisco RV Resort', 
                type: 'rv',
                description: 'Oceanfront resort just minutes from downtown San Francisco.',
                day: 7
            },
            { 
                position: {lat: 37.8199, lng: -122.4783}, 
                title: 'Golden Gate Bridge', 
                type: 'attraction',
                description: 'Walk across San Francisco\'s iconic landmark.',
                day: 8
            },
            { 
                position: {lat: 37.8100, lng: -122.4104}, 
                title: 'Fisherman\'s Wharf', 
                type: 'attraction',
                description: 'Explore Pier 39, watch sea lions, and enjoy fresh seafood.',
                day: 8
            },
            { 
                position: {lat: 35.1428, lng: -120.6412}, 
                title: 'Pismo Coast Village RV Resort', 
                type: 'rv',
                description: 'Beachfront camping on California\'s central coast.',
                day: 9
            },
            { 
                position: {lat: 34.4890, lng: -118.6176}, 
                title: 'Valencia Travel Village', 
                type: 'rv',
                description: 'Your final RV park stay, close to Six Flags Magic Mountain.',
                day: 10
            },
            { 
                position: {lat: 34.4208, lng: -118.5971}, 
                title: 'Six Flags Magic Mountain', 
                type: 'attraction',
                description: 'Enjoy thrilling roller coasters and attractions on your final day.',
                day: 11
            }
        ];

        // Extract route coordinates from locations
        const routeCoordinates = [
            locations[0].position, // LAX
            locations[1].position, // RV Rental
            locations[2].position, // Walmart
            locations[3].position, // Dockweiler RV Park
            locations[5].position, // Bakersfield
            locations[6].position, // Yosemite
            locations[8].position, // Lake Tahoe
            locations[10].position, // SF RV Resort
            locations[13].position, // Pismo
            locations[14].position, // Valencia
            locations[15].position // Six Flags
        ];

        // Create map options with custom styling
        const mapOptions = {
            zoom: 6,
            center: {lat: 36.7783, lng: -119.4179}, // Center of California
            mapTypeId: 'terrain',
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                position: google.maps.ControlPosition.TOP_RIGHT
            },
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_CENTER
            },
            scaleControl: true,
            streetViewControl: true,
            streetViewControlOptions: {
                position: google.maps.ControlPosition.RIGHT_BOTTOM
            },
            fullscreenControl: true,
            styles: [
                {
                    "featureType": "administrative",
                    "elementType": "labels.text.fill",
                    "stylers": [{"color": "#444444"}]
                },
                {
                    "featureType": "landscape",
                    "elementType": "all",
                    "stylers": [{"color": "#f2f2f2"}]
                },
                {
                    "featureType": "poi",
                    "elementType": "all",
                    "stylers": [{"visibility": "off"}]
                },
                {
                    "featureType": "road",
                    "elementType": "all",
                    "stylers": [{"saturation": -100}, {"lightness": 45}]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "all",
                    "stylers": [{"visibility": "simplified"}]
                },
                {
                    "featureType": "water",
                    "elementType": "all",
                    "stylers": [{"color": "#46bcec"}, {"visibility": "on"}]
                }
            ]
        };

        // Create the map
        map = new google.maps.Map(mapContainer, mapOptions);

        // Create the polyline for the route
        routePath = new google.maps.Polyline({
            path: routeCoordinates,
            geodesic: true,
            strokeColor: '#2c6e49',
            strokeOpacity: 1.0,
            strokeWeight: 4,
            icons: [{
                icon: {
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    scale: 3,
                    strokeColor: '#ffc857'
                },
                offset: '50px',
                repeat: '150px'
            }]
        });

        routePath.setMap(map);

        // Define custom marker icons based on type
        const markerIcons = {
            rv: {
                url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
                scaledSize: new google.maps.Size(40, 40)
            },
            attraction: {
                url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                scaledSize: new google.maps.Size(35, 35)
            },
            shopping: {
                url: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
                scaledSize: new google.maps.Size(30, 30)
            },
            airport: {
                url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                scaledSize: new google.maps.Size(35, 35)
            }
        };

        // Add markers for each location
        locations.forEach((location, i) => {
            // Store location type
            locationTypes[i] = location.type;
            
            // Create marker
            const marker = new google.maps.Marker({
                position: location.position,
                map: map,
                title: location.title,
                icon: markerIcons[location.type] || null,
                animation: google.maps.Animation.DROP,
                zIndex: 100 - i // Higher indexes have higher z-index
            });

            // Add delay to marker animation
            setTimeout(() => {
                marker.setMap(map);
            }, i * 100);

            // Create info window with enhanced content
            const infoWindow = new google.maps.InfoWindow({
                content: `
                    <div style="padding: 10px; max-width: 300px;">
                        <h3 style="margin-top: 0; color: #2c6e49; font-family: 'Montserrat', sans-serif;">${location.title}</h3>
                        <p style="margin-bottom: 5px;"><strong>Day ${location.day}</strong> of your California RV Adventure</p>
                        <p style="margin-bottom: 0;">${location.description}</p>
                    </div>
                `
            });

            // Add click listener to open info window
            marker.addListener('click', () => {
                // Close all open info windows first
                infoWindows.forEach(iw => iw.close());
                
                // Open this info window
                infoWindow.open(map, marker);
                
                // Bounce the marker briefly
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(() => {
                    marker.setAnimation(null);
                }, 750);
            });

            // Store marker and info window in arrays
            markers.push(marker);
            infoWindows.push(infoWindow);
        });

        // Add map event listeners
        map.addListener('click', function() {
            infoWindows.forEach(iw => iw.close());
        });
    } catch (error) {
        console.error('Error initializing map:', error);
        mapContainer.innerHTML = '<div style="text-align: center; padding: 50px;"><p>There was an error loading the map. Please refresh the page.</p></div>';
    }
}

// Filter markers by type
function filterMarkersByType(type) {
    // Hide route first
    if (routePath) routePath.setMap(null);
    
    // Show route but with lower opacity
    routePath.setOptions({
        strokeOpacity: 0.5
    });
    routePath.setMap(map);
    
    // Show/hide markers based on type
    markers.forEach((marker, i) => {
        if (locationTypes[i] === type) {
            marker.setMap(map);
            marker.setAnimation(google.maps.Animation.DROP);
        } else {
            marker.setMap(null);
        }
    });
}

// Show all map elements
function showAllMapElements() {
    // Reset route style
    if (routePath) {
        routePath.setOptions({
            strokeOpacity: 1.0
        });
        routePath.setMap(map);
    }
    
    // Show all markers
    markers.forEach(marker => {
        marker.setMap(map);
    });
}

// Hide all markers
function hideAllMarkers() {
    markers.forEach(marker => {
        marker.setMap(null);
    });
}

// Function to open the route in Google Maps
function openInGoogleMaps() {
    try {
        // First location (LAX) as the starting point
        const start = locations[0].position.lat + ',' + locations[0].position.lng;
        
        // Last location (Six Flags) as the destination
        const destination = locations[locations.length - 1].position.lat + ',' + locations[locations.length - 1].position.lng;
        
        // Extract RV park waypoints (only include 9 max as Google Maps has a limit of 10 total points including start/end)
        let waypoints = [];
        for (let i = 0; i < locations.length; i++) {
            if (locations[i].type === 'rv' && i > 0 && i < locations.length - 1) {
                waypoints.push(locations[i].position.lat + ',' + locations[i].position.lng);
            }
            
            // Google Maps allows max 10 points total (including start/end), so limit to 8 waypoints
            if (waypoints.length >= 8) break;
        }
        
        // Build the Google Maps URL
        let url = 'https://www.google.com/maps/dir/?api=1';
        url += '&origin=' + encodeURIComponent(start);
        url += '&destination=' + encodeURIComponent(destination);
        
        if (waypoints.length > 0) {
            url += '&waypoints=' + encodeURIComponent(waypoints.join('|'));
        }
        
        url += '&travelmode=driving';
        
        // Open in a new tab
        window.open(url, '_blank');
    } catch (error) {
        console.error('Error opening Google Maps:', error);
        alert('Could not open the route in Google Maps. Please try again later.');
    }
}

// Add event listener to load the map
document.addEventListener('DOMContentLoaded', function() {
    // Add click handler for the "Open in Google Maps" button
    const openInGoogleMapsBtn = document.getElementById('open-in-google-maps');
    if (openInGoogleMapsBtn) {
        openInGoogleMapsBtn.addEventListener('click', openInGoogleMaps);
    }
    
    // Delay map initialization to ensure Google Maps API has loaded
    setTimeout(function() {
        try {
            if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
                initMap();
            } else {
                console.log('Waiting for Google Maps API to load...');
                // Check again after another delay
                setTimeout(function() {
                    if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
                        initMap();
                    } else {
                        // Still not loaded, show error message
                        const mapContainer = document.getElementById('trip-map');
                        if (mapContainer) {
                            mapContainer.innerHTML = '<div style="text-align: center; padding: 50px;"><p>Google Maps could not be loaded. Please ensure you have a valid API key.</p><p>Get your API key from <a href="https://console.cloud.google.com/" target="_blank">Google Cloud Console</a>.</p></div>';
                        }
                    }
                }, 2000);
            }
        } catch (error) {
            console.error('Error initializing map:', error);
            const mapContainer = document.getElementById('trip-map');
            if (mapContainer) {
                mapContainer.innerHTML = '<div style="text-align: center; padding: 50px;"><p>There was an error loading the map. Please check your API key.</p></div>';
            }
        }
    }, 500);
}); 