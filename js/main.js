// Main JavaScript for California RV Trip Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile navigation toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }

    // Initialize interactive map
    setTimeout(function() {
        // Try to initialize the map with a delay to ensure DOM is fully loaded
        if (typeof initMap === 'function') {
            try {
                initMap();
                console.log('Map initialized successfully');
            } catch (error) {
                console.error('Error initializing map:', error);
                const mapContainer = document.getElementById('trip-map');
                if (mapContainer) {
                    mapContainer.innerHTML = '<div style="text-align: center; padding: 50px;"><p>Unable to load the map. Please refresh the page or check your internet connection.</p></div>';
                }
            }
        } else {
            console.error('Map initialization function not found');
        }
    }, 500);
    
    // Day cards expansion for mobile
    const dayCards = document.querySelectorAll('.day-card');
    
    dayCards.forEach(card => {
        const header = card.querySelector('.day-card-header');
        const body = card.querySelector('.day-card-body');
        
        if (header && body && window.innerWidth < 768) {
            body.style.display = 'none';
            
            header.addEventListener('click', function(event) {
                if (body.style.display === 'none') {
                    // Close all other cards first
                    dayCards.forEach(otherCard => {
                        const otherBody = otherCard.querySelector('.day-card-body');
                        const otherHeader = otherCard.querySelector('.day-card-header');
                        if (otherCard !== card && otherBody.style.display === 'block') {
                            otherBody.style.display = 'none';
                            otherHeader.classList.remove('expanded');
                        }
                    });
                    
                    body.style.display = 'block';
                    header.classList.add('expanded');
                } else {
                    body.style.display = 'none';
                    header.classList.remove('expanded');
                }
                event.stopPropagation();
            });
        }
    });
    
    // Filter functionality for itinerary cards
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                const cards = document.querySelectorAll('.day-card');
                
                cards.forEach(card => {
                    if (filterValue === 'all') {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        if (card.getAttribute('data-category') === filterValue) {
                            card.style.display = 'flex';
                            setTimeout(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'translateY(0)';
                            }, 10);
                        } else {
                            card.style.opacity = '0';
                            card.style.transform = 'translateY(20px)';
                            setTimeout(() => {
                                card.style.display = 'none';
                            }, 300);
                        }
                    }
                });
            });
        });
    }
    
    // Map control buttons
    const mapControlButtons = document.querySelectorAll('.map-btn');
    
    if (mapControlButtons.length > 0) {
        mapControlButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                mapControlButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                const mapAction = this.id;
                
                // Call map filtering functions from map.js
                if (typeof window.mapControls === 'object') {
                    switch (mapAction) {
                        case 'show-all-markers':
                            window.mapControls.showAll();
                            break;
                        case 'show-rv-parks':
                            window.mapControls.showRVParks();
                            break;
                        case 'show-attractions':
                            window.mapControls.showAttractions();
                            break;
                        case 'show-route':
                            window.mapControls.showRoute();
                            break;
                    }
                }
            });
        });
    }
    
    // Progress tracker animation
    animateProgress();
    
    // PDF download functionality
    const downloadPdfBtn = document.getElementById('download-pdf');
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', function() {
            alert('PDF download would be implemented with a PDF generation library like jsPDF or using a server-side solution.');
        });
    }
    
    // Lazy load images
    lazyLoadImages();
});

// Animate progress bar based on scroll position
function animateProgress() {
    const progressFill = document.querySelector('.progress-fill');
    const progressSection = document.querySelector('.progress-tracker');
    
    if (!progressFill || !progressSection) return;
    
    // Set initial width based on current day (for demo we'll use 33%)
    progressFill.style.width = '33%';
    
    // Animate when scrolled into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate to current progress
                progressFill.style.width = '33%';
            }
        });
    }, { threshold: 0.2 });
    
    observer.observe(progressSection);
}

// Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('fade-in');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// Print itinerary function
function printItinerary() {
    window.print();
}

// Add CSS class on scroll for sticky header
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 100) {
        nav.classList.add('nav-scrolled');
    } else {
        nav.classList.remove('nav-scrolled');
    }
}); 