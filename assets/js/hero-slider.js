// Hero Slider Functionality

document.addEventListener('DOMContentLoaded', function() {
    initHeroSlider();
});

function initHeroSlider() {
    const slider = document.querySelector('.hero__slider');
    const slides = document.querySelectorAll('.hero__slide');
    const prevBtn = document.querySelector('.hero__nav-btn--prev');
    const nextBtn = document.querySelector('.hero__nav-btn--next');
    const indicators = document.querySelectorAll('.hero__indicator');
    
    if (!slider || slides.length === 0) {
        return;
    }
    
    let currentSlide = 0;
    let isAnimating = false;
    let autoplayTimer = null;
    const autoplayDelay = 5000; // 5 seconds
    const animationDuration = 800; // 0.8 seconds
    
    // Initialize slider
    function init() {
        // Set initial slide
        showSlide(0);
        
        // Start autoplay
        startAutoplay();
        
        // Add event listeners
        addEventListeners();
        
        // Preload next images
        preloadImages();
    }
    
    // Show specific slide
    function showSlide(index) {
        if (isAnimating || index === currentSlide) {
            return;
        }
        
        isAnimating = true;
        
        // Update current slide
        const prevSlide = currentSlide;
        currentSlide = index;
        
        // Update slides
        slides.forEach((slide, i) => {
            slide.classList.remove('hero__slide--active');
            if (i === currentSlide) {
                slide.classList.add('hero__slide--active');
            }
        });
        
        // Update indicators
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('hero__indicator--active', i === currentSlide);
            indicator.setAttribute('aria-selected', i === currentSlide ? 'true' : 'false');
        });
        
        // Track event
        if (typeof trackEvent === 'function') {
            trackEvent('Hero Slider', 'Slide Change', `Slide ${currentSlide + 1}`);
        }
        
        // Reset animation flag
        setTimeout(() => {
            isAnimating = false;
        }, animationDuration);
    }
    
    // Go to next slide
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }
    
    // Go to previous slide
    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }
    
    // Start autoplay
    function startAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
        }
        
        autoplayTimer = setInterval(nextSlide, autoplayDelay);
    }
    
    // Stop autoplay
    function stopAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    }
    
    // Reset autoplay (stop and start)
    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }
    
    // Add event listeners
    function addEventListeners() {
        // Navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                prevSlide();
                resetAutoplay();
                if (typeof trackEvent === 'function') {
                    trackEvent('Hero Slider', 'Manual Navigation', 'Previous Button');
                }
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                nextSlide();
                resetAutoplay();
                if (typeof trackEvent === 'function') {
                    trackEvent('Hero Slider', 'Manual Navigation', 'Next Button');
                }
            });
        }
        
        // Indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', function() {
                showSlide(index);
                resetAutoplay();
                if (typeof trackEvent === 'function') {
                    trackEvent('Hero Slider', 'Manual Navigation', `Indicator ${index + 1}`);
                }
            });
            
            // Keyboard support for indicators
            indicator.addEventListener('keydown', function(event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    showSlide(index);
                    resetAutoplay();
                }
            });
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', function(event) {
            if (document.activeElement.closest('.hero')) {
                switch(event.key) {
                    case 'ArrowLeft':
                        event.preventDefault();
                        prevSlide();
                        resetAutoplay();
                        break;
                    case 'ArrowRight':
                        event.preventDefault();
                        nextSlide();
                        resetAutoplay();
                        break;
                }
            }
        });
        
        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        const touchThreshold = 50; // Minimum distance for swipe
        
        slider.addEventListener('touchstart', function(event) {
            touchStartX = event.changedTouches[0].screenX;
            stopAutoplay();
        }, { passive: true });
        
        slider.addEventListener('touchend', function(event) {
            touchEndX = event.changedTouches[0].screenX;
            handleSwipe();
            resetAutoplay();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeDistance = touchEndX - touchStartX;
            
            if (Math.abs(swipeDistance) > touchThreshold) {
                if (swipeDistance > 0) {
                    // Swipe right - go to previous slide
                    prevSlide();
                    if (typeof trackEvent === 'function') {
                        trackEvent('Hero Slider', 'Swipe Navigation', 'Swipe Right');
                    }
                } else {
                    // Swipe left - go to next slide
                    nextSlide();
                    if (typeof trackEvent === 'function') {
                        trackEvent('Hero Slider', 'Swipe Navigation', 'Swipe Left');
                    }
                }
            }
        }
        
        // Pause autoplay on hover (desktop)
        if (window.matchMedia('(hover: hover)').matches) {
            slider.addEventListener('mouseenter', stopAutoplay);
            slider.addEventListener('mouseleave', startAutoplay);
        }
        
        // Pause autoplay when tab is not visible
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                stopAutoplay();
            } else {
                startAutoplay();
            }
        });
        
        // Handle window blur/focus
        window.addEventListener('blur', stopAutoplay);
        window.addEventListener('focus', startAutoplay);
        
        // Reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            stopAutoplay();
        }
    }
    
    // Preload next few images for smoother transitions
    function preloadImages() {
        const imagesToPreload = 2; // Preload next 2 images
        
        for (let i = 1; i <= imagesToPreload; i++) {
            const nextIndex = (currentSlide + i) % slides.length;
            const nextSlide = slides[nextIndex];
            const img = nextSlide.querySelector('img');
            
            if (img && img.dataset.src) {
                const preloadImg = new Image();
                preloadImg.src = img.dataset.src;
            }
        }
    }
    
    // Resize handler
    function handleResize() {
        // Recalculate dimensions if needed
        // Currently not needed, but useful for future enhancements
    }
    
    // Add resize listener with debounce function
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 300);
    });
    
    // Public API for external control
    window.heroSlider = {
        next: nextSlide,
        prev: prevSlide,
        goto: showSlide,
        pause: stopAutoplay,
        play: startAutoplay,
        getCurrentSlide: () => currentSlide,
        getTotalSlides: () => slides.length
    };
    
    // Initialize the slider
    init();
}

// Intersection Observer to pause/resume autoplay based on visibility
document.addEventListener('DOMContentLoaded', function() {
    const heroSection = document.querySelector('.hero');
    
    if (heroSection && 'IntersectionObserver' in window) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (window.heroSlider) {
                    if (entry.isIntersecting) {
                        window.heroSlider.play();
                    } else {
                        window.heroSlider.pause();
                    }
                }
            });
        }, {
            threshold: 0.3
        });
        
        heroObserver.observe(heroSection);
    }
});

// Lazy loading for hero images
document.addEventListener('DOMContentLoaded', function() {
    const heroImages = document.querySelectorAll('.hero__slide img[data-src]');
    
    if ('IntersectionObserver' in window && heroImages.length > 0) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Create a new image to preload
                    const newImg = new Image();
                    newImg.onload = function() {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.remove('lazy');
                    };
                    newImg.onerror = function() {
                        console.error('Failed to load hero image:', img.dataset.src);
                    };
                    newImg.src = img.dataset.src;
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '100px'
        });
        
        heroImages.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    }
});