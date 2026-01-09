/**
 * Photo Gallery Application
 * Modern, responsive gallery with Unsplash API integration
 * Features: Grid layout, Lightbox, Keyboard navigation, Lazy loading
 */

// ============================================
// Configuration
// ============================================
const CONFIG = {
    // Unsplash API configuration
    // Using demo access key for development - replace with your own for production
    unsplashAccessKey: 'YOUR_UNSPLASH_ACCESS_KEY',
    imagesPerPage: 12,
    
    // Fallback images when API is not available
    useFallbackImages: true,
    
    // Categories mapping for Unsplash
    categories: {
        all: '',
        nature: 'nature,landscape,forest,mountains',
        architecture: 'architecture,building,city',
        people: 'people,portrait,street'
    }
};

// ============================================
// State Management
// ============================================
const state = {
    images: [],
    filteredImages: [],
    currentCategory: 'all',
    currentPage: 1,
    currentImageIndex: 0,
    isLoading: false,
    isLightboxOpen: false
};

// ============================================
// DOM Elements
// ============================================
const elements = {
    galleryGrid: document.getElementById('galleryGrid'),
    loader: document.getElementById('loader'),
    loadMoreBtn: document.getElementById('loadMoreBtn'),
    lightbox: document.getElementById('lightbox'),
    lightboxImage: document.getElementById('lightboxImage'),
    lightboxTitle: document.getElementById('lightboxTitle'),
    lightboxAuthor: document.getElementById('lightboxAuthor'),
    lightboxCounter: document.getElementById('lightboxCounter'),
    lightboxClose: document.getElementById('lightboxClose'),
    lightboxPrev: document.getElementById('lightboxPrev'),
    lightboxNext: document.getElementById('lightboxNext'),
    lightboxLoader: document.querySelector('.lightbox-loader'),
    navBtns: document.querySelectorAll('.nav-btn')
};

// ============================================
// Fallback Images Data (Unsplash URLs)
// ============================================
const fallbackImages = [
    {
        id: '1',
        title: 'Mountain Sunrise',
        author: 'John Doe',
        category: 'nature',
        urls: {
            small: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
            regular: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080&q=80',
            full: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80'
        },
        alt: 'Beautiful mountain landscape at sunrise',
        aspectRatio: 1.5
    },
    {
        id: '2',
        title: 'Ocean Waves',
        author: 'Jane Smith',
        category: 'nature',
        urls: {
            small: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&q=80',
            regular: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1080&q=80',
            full: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&q=80'
        },
        alt: 'Crystal clear ocean waves',
        aspectRatio: 1.33
    },
    {
        id: '3',
        title: 'Modern Architecture',
        author: 'Alex Chen',
        category: 'architecture',
        urls: {
            small: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80',
            regular: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1080&q=80',
            full: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80'
        },
        alt: 'Modern skyscraper with glass facade',
        aspectRatio: 0.75
    },
    {
        id: '4',
        title: 'Forest Path',
        author: 'Maria Garcia',
        category: 'nature',
        urls: {
            small: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80',
            regular: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1080&q=80',
            full: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80'
        },
        alt: 'Misty forest path in autumn',
        aspectRatio: 1.5
    },
    {
        id: '5',
        title: 'City Lights',
        author: 'David Kim',
        category: 'architecture',
        urls: {
            small: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&q=80',
            regular: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1080&q=80',
            full: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80'
        },
        alt: 'City skyline at night with lights',
        aspectRatio: 1.78
    },
    {
        id: '6',
        title: 'Portrait Study',
        author: 'Emma Wilson',
        category: 'people',
        urls: {
            small: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
            regular: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1080&q=80',
            full: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1920&q=80'
        },
        alt: 'Professional portrait photograph',
        aspectRatio: 0.67
    },
    {
        id: '7',
        title: 'Desert Dunes',
        author: 'Omar Hassan',
        category: 'nature',
        urls: {
            small: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&q=80',
            regular: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1080&q=80',
            full: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1920&q=80'
        },
        alt: 'Golden sand dunes in desert',
        aspectRatio: 1.5
    },
    {
        id: '8',
        title: 'Street Life',
        author: 'Yuki Tanaka',
        category: 'people',
        urls: {
            small: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80',
            regular: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1080&q=80',
            full: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1920&q=80'
        },
        alt: 'Street photography portrait',
        aspectRatio: 0.67
    },
    {
        id: '9',
        title: 'Glass Building',
        author: 'Lucas Brown',
        category: 'architecture',
        urls: {
            small: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&q=80',
            regular: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1080&q=80',
            full: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1920&q=80'
        },
        alt: 'Modern glass office building',
        aspectRatio: 1.33
    },
    {
        id: '10',
        title: 'Northern Lights',
        author: 'Erik Svensson',
        category: 'nature',
        urls: {
            small: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&q=80',
            regular: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1080&q=80',
            full: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=80'
        },
        alt: 'Aurora borealis over snowy landscape',
        aspectRatio: 1.5
    },
    {
        id: '11',
        title: 'Urban Explorer',
        author: 'Sophie Martin',
        category: 'people',
        urls: {
            small: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
            regular: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1080&q=80',
            full: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80'
        },
        alt: 'Person exploring urban environment',
        aspectRatio: 1
    },
    {
        id: '12',
        title: 'Waterfall',
        author: 'Ryan Thompson',
        category: 'nature',
        urls: {
            small: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&q=80',
            regular: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1080&q=80',
            full: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1920&q=80'
        },
        alt: 'Majestic waterfall in tropical forest',
        aspectRatio: 0.67
    },
    {
        id: '13',
        title: 'Museum Interior',
        author: 'Anna Petrova',
        category: 'architecture',
        urls: {
            small: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=400&q=80',
            regular: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=1080&q=80',
            full: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=1920&q=80'
        },
        alt: 'Stunning museum interior architecture',
        aspectRatio: 1.5
    },
    {
        id: '14',
        title: 'Autumn Colors',
        author: 'Michael Lee',
        category: 'nature',
        urls: {
            small: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
            regular: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1080&q=80',
            full: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80'
        },
        alt: 'Colorful autumn forest landscape',
        aspectRatio: 1.33
    },
    {
        id: '15',
        title: 'City Bridge',
        author: 'Christina Wang',
        category: 'architecture',
        urls: {
            small: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80',
            regular: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1080&q=80',
            full: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80'
        },
        alt: 'Iconic city bridge at sunset',
        aspectRatio: 1.78
    },
    {
        id: '16',
        title: 'Coffee Moment',
        author: 'James Anderson',
        category: 'people',
        urls: {
            small: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=400&q=80',
            regular: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=1080&q=80',
            full: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=1920&q=80'
        },
        alt: 'Person enjoying coffee in cafe',
        aspectRatio: 1
    }
];

// ============================================
// API Functions
// ============================================

/**
 * Fetches images from Unsplash API
 * Falls back to local data if API key is not set
 * @param {string} category - Category to filter by
 * @param {number} page - Page number for pagination
 * @returns {Promise<Array>} Array of image objects
 */
async function fetchImages(category = 'all', page = 1) {
    // Use fallback images if API key is not configured
    if (CONFIG.useFallbackImages || CONFIG.unsplashAccessKey === 'YOUR_UNSPLASH_ACCESS_KEY') {
        return getFallbackImages(category, page);
    }
    
    try {
        const query = CONFIG.categories[category] || '';
        const endpoint = query 
            ? `https://api.unsplash.com/search/photos?query=${query}&page=${page}&per_page=${CONFIG.imagesPerPage}`
            : `https://api.unsplash.com/photos?page=${page}&per_page=${CONFIG.imagesPerPage}`;
        
        const response = await fetch(endpoint, {
            headers: {
                'Authorization': `Client-ID ${CONFIG.unsplashAccessKey}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        const photos = query ? data.results : data;
        
        return photos.map(photo => ({
            id: photo.id,
            title: photo.description || photo.alt_description || 'Untitled',
            author: photo.user.name,
            category: category,
            urls: {
                small: photo.urls.small,
                regular: photo.urls.regular,
                full: photo.urls.full
            },
            alt: photo.alt_description || 'Photo from Unsplash',
            aspectRatio: photo.width / photo.height
        }));
    } catch (error) {
        console.warn('API fetch failed, using fallback images:', error);
        return getFallbackImages(category, page);
    }
}

/**
 * Gets fallback images filtered by category
 * @param {string} category - Category to filter by
 * @param {number} page - Page number
 * @returns {Array} Filtered images
 */
function getFallbackImages(category, page) {
    let filtered = category === 'all' 
        ? [...fallbackImages]
        : fallbackImages.filter(img => img.category === category);
    
    // Simulate pagination
    const start = (page - 1) * CONFIG.imagesPerPage;
    const end = start + CONFIG.imagesPerPage;
    
    // If we need more images, duplicate and modify existing ones
    if (start >= filtered.length && page > 1) {
        return [];
    }
    
    return filtered.slice(start, end);
}

// ============================================
// Gallery Rendering Functions
// ============================================

/**
 * Creates HTML for a gallery item
 * @param {Object} image - Image data object
 * @param {number} index - Index in the current view
 * @returns {string} HTML string
 */
function createGalleryItemHTML(image, index) {
    // Calculate grid row span based on aspect ratio for masonry effect
    const rowSpan = Math.ceil((1 / image.aspectRatio) * 25) + 2;
    
    return `
        <article 
            class="gallery-item" 
            data-index="${index}"
            data-id="${image.id}"
            tabindex="0"
            role="button"
            aria-label="${image.title} - ${image.author}"
            style="grid-row: span ${rowSpan};"
        >
            <img 
                class="gallery-item-image"
                src="${image.urls.small}"
                srcset="${image.urls.small} 400w, ${image.urls.regular} 1080w"
                sizes="(max-width: 480px) 50vw, (max-width: 900px) 33vw, 25vw"
                alt="${image.alt}"
                loading="lazy"
                decoding="async"
            >
            <div class="gallery-item-info">
                <h3 class="gallery-item-title">${escapeHTML(image.title)}</h3>
                <p class="gallery-item-author">${escapeHTML(image.author)}</p>
            </div>
        </article>
    `;
}

/**
 * Renders images to the gallery grid
 * @param {Array} images - Array of image objects
 * @param {boolean} append - Whether to append or replace
 */
function renderGallery(images, append = false) {
    const html = images.map((img, idx) => {
        const globalIndex = append ? state.filteredImages.length - images.length + idx : idx;
        return createGalleryItemHTML(img, globalIndex);
    }).join('');
    
    if (append) {
        elements.galleryGrid.insertAdjacentHTML('beforeend', html);
    } else {
        elements.galleryGrid.innerHTML = html;
    }
    
    // Add click and keyboard event listeners to new items
    attachGalleryItemListeners();
}

/**
 * Attaches event listeners to gallery items
 */
function attachGalleryItemListeners() {
    const items = elements.galleryGrid.querySelectorAll('.gallery-item');
    
    items.forEach(item => {
        // Remove existing listeners to prevent duplicates
        item.removeEventListener('click', handleGalleryItemClick);
        item.removeEventListener('keydown', handleGalleryItemKeydown);
        
        // Add new listeners
        item.addEventListener('click', handleGalleryItemClick);
        item.addEventListener('keydown', handleGalleryItemKeydown);
    });
}

/**
 * Handles click on gallery item
 * @param {Event} event - Click event
 */
function handleGalleryItemClick(event) {
    const index = parseInt(event.currentTarget.dataset.index);
    openLightbox(index);
}

/**
 * Handles keydown on gallery item
 * @param {KeyboardEvent} event - Keyboard event
 */
function handleGalleryItemKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const index = parseInt(event.currentTarget.dataset.index);
        openLightbox(index);
    }
}

// ============================================
// Lightbox Functions
// ============================================

/**
 * Opens the lightbox with specified image
 * @param {number} index - Index of image to display
 */
function openLightbox(index) {
    state.currentImageIndex = index;
    state.isLightboxOpen = true;
    
    elements.lightbox.classList.add('active');
    document.body.classList.add('lightbox-open');
    
    updateLightboxImage();
    updateNavigationButtons();
    
    // Focus lightbox for keyboard navigation
    elements.lightboxClose.focus();
    
    // Trap focus inside lightbox
    trapFocus(elements.lightbox);
}

/**
 * Closes the lightbox
 */
function closeLightbox() {
    state.isLightboxOpen = false;
    
    elements.lightbox.classList.remove('active');
    document.body.classList.remove('lightbox-open');
    
    // Return focus to the gallery item
    const activeItem = elements.galleryGrid.querySelector(`[data-index="${state.currentImageIndex}"]`);
    if (activeItem) {
        activeItem.focus();
    }
}

/**
 * Updates the lightbox image display
 */
function updateLightboxImage() {
    const image = state.filteredImages[state.currentImageIndex];
    if (!image) return;
    
    // Show loader
    elements.lightboxImage.classList.remove('loaded');
    elements.lightboxLoader.classList.remove('hidden');
    
    // Update info
    elements.lightboxTitle.textContent = image.title;
    elements.lightboxAuthor.textContent = `by ${image.author}`;
    elements.lightboxCounter.textContent = `${state.currentImageIndex + 1} / ${state.filteredImages.length}`;
    
    // Load high-res image
    const newImage = new Image();
    newImage.onload = () => {
        elements.lightboxImage.src = image.urls.regular;
        elements.lightboxImage.alt = image.alt;
        elements.lightboxImage.classList.add('loaded');
        elements.lightboxLoader.classList.add('hidden');
    };
    newImage.onerror = () => {
        // Fallback to small image on error
        elements.lightboxImage.src = image.urls.small;
        elements.lightboxImage.alt = image.alt;
        elements.lightboxImage.classList.add('loaded');
        elements.lightboxLoader.classList.add('hidden');
    };
    newImage.src = image.urls.regular;
}

/**
 * Updates navigation button states
 */
function updateNavigationButtons() {
    elements.lightboxPrev.disabled = state.currentImageIndex === 0;
    elements.lightboxNext.disabled = state.currentImageIndex === state.filteredImages.length - 1;
}

/**
 * Navigates to next image
 */
function nextImage() {
    if (state.currentImageIndex < state.filteredImages.length - 1) {
        state.currentImageIndex++;
        updateLightboxImage();
        updateNavigationButtons();
    }
}

/**
 * Navigates to previous image
 */
function prevImage() {
    if (state.currentImageIndex > 0) {
        state.currentImageIndex--;
        updateLightboxImage();
        updateNavigationButtons();
    }
}

// ============================================
// Category Filter Functions
// ============================================

/**
 * Filters gallery by category
 * @param {string} category - Category to filter
 */
async function filterByCategory(category) {
    if (category === state.currentCategory) return;
    
    state.currentCategory = category;
    state.currentPage = 1;
    state.filteredImages = [];
    
    // Update active button state
    elements.navBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });
    
    // Clear gallery and load new images
    elements.galleryGrid.innerHTML = '';
    await loadImages();
}

// ============================================
// Loading Functions
// ============================================

/**
 * Loads images and renders them
 * @param {boolean} append - Whether to append to existing images
 */
async function loadImages(append = false) {
    if (state.isLoading) return;
    
    state.isLoading = true;
    showLoader();
    
    try {
        const newImages = await fetchImages(state.currentCategory, state.currentPage);
        
        if (newImages.length === 0) {
            elements.loadMoreBtn.classList.add('hidden');
        } else {
            if (append) {
                state.filteredImages = [...state.filteredImages, ...newImages];
            } else {
                state.filteredImages = newImages;
            }
            
            renderGallery(newImages, append);
            elements.loadMoreBtn.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error loading images:', error);
    } finally {
        state.isLoading = false;
        hideLoader();
    }
}

/**
 * Loads more images (pagination)
 */
async function loadMoreImages() {
    state.currentPage++;
    await loadImages(true);
}

/**
 * Shows the loading spinner
 */
function showLoader() {
    elements.loader.classList.remove('hidden');
    elements.loadMoreBtn.disabled = true;
}

/**
 * Hides the loading spinner
 */
function hideLoader() {
    elements.loader.classList.add('hidden');
    elements.loadMoreBtn.disabled = false;
}

// ============================================
// Accessibility Functions
// ============================================

/**
 * Traps focus inside an element (for modal accessibility)
 * @param {HTMLElement} element - Element to trap focus in
 */
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', function handleTab(e) {
        if (e.key !== 'Tab') return;
        
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    });
}

// ============================================
// Utility Functions
// ============================================

/**
 * Escapes HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Debounce function for performance
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// Event Listeners Setup
// ============================================

/**
 * Sets up all event listeners
 */
function setupEventListeners() {
    // Category navigation
    elements.navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterByCategory(btn.dataset.category);
        });
    });
    
    // Load more button
    elements.loadMoreBtn.addEventListener('click', loadMoreImages);
    
    // Lightbox controls
    elements.lightboxClose.addEventListener('click', closeLightbox);
    elements.lightboxPrev.addEventListener('click', prevImage);
    elements.lightboxNext.addEventListener('click', nextImage);
    
    // Lightbox overlay click to close
    elements.lightbox.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Touch/Swipe support for lightbox
    setupTouchSupport();
}

/**
 * Handles keyboard navigation
 * @param {KeyboardEvent} event - Keyboard event
 */
function handleKeyboardNavigation(event) {
    if (!state.isLightboxOpen) return;
    
    switch (event.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowLeft':
            event.preventDefault();
            prevImage();
            break;
        case 'ArrowRight':
            event.preventDefault();
            nextImage();
            break;
        case 'Home':
            event.preventDefault();
            state.currentImageIndex = 0;
            updateLightboxImage();
            updateNavigationButtons();
            break;
        case 'End':
            event.preventDefault();
            state.currentImageIndex = state.filteredImages.length - 1;
            updateLightboxImage();
            updateNavigationButtons();
            break;
    }
}

/**
 * Sets up touch/swipe support for lightbox
 */
function setupTouchSupport() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    const lightboxContent = elements.lightbox.querySelector('.lightbox-content');
    
    lightboxContent.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    lightboxContent.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swiped left - next image
                nextImage();
            } else {
                // Swiped right - previous image
                prevImage();
            }
        }
    }
}

// ============================================
// Initialization
// ============================================

/**
 * Initializes the gallery application
 */
async function init() {
    setupEventListeners();
    await loadImages();
    
    // Log ready message
    console.log('Lumina Gallery initialized successfully');
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
