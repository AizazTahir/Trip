/**
 * Enhanced Lightbox Implementation
 * Features: Image navigation, keyboard controls, loading indicator, and more
 */

// Lightbox class 
class Lightbox {
  constructor(options = {}) {
    // Default options
    this.options = Object.assign({
      selector: '.gallery-item',
      imageSelector: '.gallery-image',
      captionSelector: '.gallery-caption',
      enableNavigation: true,
      enableKeyboard: true,
      animationDuration: 300,
      closeOnBackdropClick: true
    }, options);
    
    // State variables
    this.currentIndex = 0;
    this.items = [];
    this.isOpen = false;
    
    // Create DOM elements
    this.createLightbox();
    
    // Initialize
    this.init();
  }
  
  // Initialize lightbox
  init() {
    // Find all gallery items
    this.items = Array.from(document.querySelectorAll(this.options.selector));
    
    if (this.items.length === 0) return;
    
    // Add click event to items
    this.items.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        this.open(index);
      });
    });
    
    // Keyboard navigation
    if (this.options.enableKeyboard) {
      document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
    
    // Close on backdrop click
    if (this.options.closeOnBackdropClick) {
      this.lightbox.addEventListener('click', (e) => {
        if (e.target === this.lightbox) {
          this.close();
        }
      });
    }
    
    // Close button
    this.closeButton.addEventListener('click', () => this.close());
    
    // Navigation buttons
    if (this.options.enableNavigation && this.items.length > 1) {
      this.prevButton.addEventListener('click', () => this.navigate('prev'));
      this.nextButton.addEventListener('click', () => this.navigate('next'));
    }
  }
  
  // Create lightbox DOM structure
  createLightbox() {
    // Create main container
    this.lightbox = document.createElement('div');
    this.lightbox.classList.add('lightbox');
    
    // Create loading indicator
    this.loadingIndicator = document.createElement('div');
    this.loadingIndicator.classList.add('lightbox-loading');
    
    // Create content container
    this.content = document.createElement('div');
    this.content.classList.add('lightbox-content');
    
    // Create image element
    this.image = document.createElement('img');
    this.image.classList.add('lightbox-image');
    this.image.alt = 'Lightbox Image';
    
    // Create caption
    this.caption = document.createElement('div');
    this.caption.classList.add('lightbox-caption');
    
    // Create close button
    this.closeButton = document.createElement('span');
    this.closeButton.classList.add('lightbox-close');
    this.closeButton.innerHTML = '&times;';
    
    // Navigation
    if (this.options.enableNavigation) {
      this.nav = document.createElement('div');
      this.nav.classList.add('lightbox-nav');
      
      this.prevButton = document.createElement('button');
      this.prevButton.classList.add('lightbox-nav-button', 'lightbox-prev');
      this.prevButton.innerHTML = '&#10094;';
      this.prevButton.setAttribute('aria-label', 'Previous image');
      
      this.nextButton = document.createElement('button');
      this.nextButton.classList.add('lightbox-nav-button', 'lightbox-next');
      this.nextButton.innerHTML = '&#10095;';
      this.nextButton.setAttribute('aria-label', 'Next image');
      
      this.nav.appendChild(this.prevButton);
      this.nav.appendChild(this.nextButton);
    }
    
    // Assemble the lightbox
    this.content.appendChild(this.image);
    this.content.appendChild(this.closeButton);
    this.content.appendChild(this.caption);
    
    if (this.options.enableNavigation) {
      this.content.appendChild(this.nav);
    }
    
    this.lightbox.appendChild(this.loadingIndicator);
    this.lightbox.appendChild(this.content);
    
    // Add to DOM
    document.body.appendChild(this.lightbox);
  }
  
  // Open lightbox at specific index
  open(index) {
    if (!this.items[index]) return;
    
    this.currentIndex = index;
    const item = this.items[index];
    
    // Get image source and caption
    const image = item.querySelector(this.options.imageSelector);
    const caption = item.querySelector(this.options.captionSelector);
    
    if (!image) return;
    
    // Show loading indicator
    this.lightbox.classList.add('loading');
    
    // Load image
    this.image.src = image.src;
    this.caption.textContent = caption ? caption.textContent : '';
    
    // Show lightbox
    this.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.isOpen = true;
    
    // Hide loading indicator when image is loaded
    this.image.onload = () => {
      this.lightbox.classList.remove('loading');
    };
    
    // Update navigation visibility
    this.updateNavigation();
  }
  
  // Close lightbox
  close() {
    this.lightbox.classList.remove('active');
    document.body.style.overflow = '';
    this.isOpen = false;
    
    // Clear image source after animation
    setTimeout(() => {
      this.image.src = '';
    }, this.options.animationDuration);
  }
  
  // Navigate to previous/next image
  navigate(direction) {
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = this.currentIndex - 1;
      if (newIndex < 0) newIndex = this.items.length - 1;
    } else {
      newIndex = this.currentIndex + 1;
      if (newIndex >= this.items.length) newIndex = 0;
    }
    
    this.open(newIndex);
  }
  
  // Update navigation button visibility
  updateNavigation() {
    if (!this.options.enableNavigation || this.items.length <= 1) {
      if (this.nav) this.nav.style.display = 'none';
      return;
    }
    
    this.nav.style.display = 'flex';
  }
  
  // Handle keyboard events
  handleKeyDown(e) {
    if (!this.isOpen) return;
    
    switch (e.key) {
      case 'Escape':
        this.close();
        break;
      case 'ArrowLeft':
        if (this.options.enableNavigation) this.navigate('prev');
        break;
      case 'ArrowRight':
        if (this.options.enableNavigation) this.navigate('next');
        break;
    }
  }
}

// Initialize lightbox when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Create lightbox instance
  window.galleryLightbox = new Lightbox({
    selector: '.gallery-item',
    imageSelector: '.gallery-image',
    captionSelector: '.gallery-caption'
  });
}); 