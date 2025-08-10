// Craftsmen Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initCraftsmen();
});

function initCraftsmen() {
    initSmoothScrolling();
    initWorkshopGallery();
    initScrollAnimations();
    initLazyLoading();
    
    // Track page view
    if (typeof trackEvent === 'function') {
        trackEvent('Craftsmen', 'Page View', 'Craftsmen List');
    }
}

// Smooth scrolling for craftsman navigation
function initSmoothScrolling() {
    const craftmanLinks = document.querySelectorAll('a[href^="#"]');
    
    craftmanLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                event.preventDefault();
                
                const headerHeight = document.querySelector('.header').offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Track anchor navigation
                if (typeof trackEvent === 'function') {
                    trackEvent('Craftsmen', 'Navigate', targetId);
                }
            }
        });
    });
}

// Workshop gallery interactions
function initWorkshopGallery() {
    const workshopImages = document.querySelectorAll('.workshop__image');
    
    workshopImages.forEach((image, index) => {
        // Click to expand functionality
        image.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) {
                openImageModal(img.src, img.alt);
                
                // Track workshop image click
                if (typeof trackEvent === 'function') {
                    trackEvent('Craftsmen', 'Workshop Image', `Image ${index + 1}`);
                }
            }
        });
        
        // Keyboard accessibility
        image.setAttribute('tabindex', '0');
        image.setAttribute('role', 'button');
        image.setAttribute('aria-label', '画像を拡大表示');
        
        image.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.click();
            }
        });
    });
}

// Image modal for workshop gallery
function openImageModal(imageSrc, imageAlt) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="image-modal__overlay">
            <div class="image-modal__content">
                <img src="${imageSrc}" alt="${imageAlt}" class="image-modal__image">
                <button class="image-modal__close" aria-label="閉じる">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                <div class="image-modal__caption">${imageAlt}</div>
            </div>
        </div>
    `;
    
    // Add modal styles if not present
    if (!document.querySelector('#image-modal-styles')) {
        const modalStyles = `
            .image-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.3s ease;
                backdrop-filter: blur(4px);
            }
            
            .image-modal.active {
                opacity: 1;
            }
            
            .image-modal__overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                cursor: pointer;
            }
            
            .image-modal__content {
                position: relative;
                max-width: 90vw;
                max-height: 90vh;
                display: flex;
                flex-direction: column;
                align-items: center;
                cursor: default;
            }
            
            .image-modal__image {
                max-width: 100%;
                max-height: 80vh;
                object-fit: contain;
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                transition: transform 0.3s ease;
            }
            
            .image-modal__close {
                position: absolute;
                top: -50px;
                right: -10px;
                width: 40px;
                height: 40px;
                background: rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(10px);
                border: none;
                border-radius: 50%;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }
            
            .image-modal__close:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.1);
            }
            
            .image-modal__caption {
                margin-top: 20px;
                color: white;
                text-align: center;
                font-size: 16px;
                max-width: 80%;
                line-height: 1.5;
            }
            
            @media (max-width: 768px) {
                .image-modal__close {
                    top: 10px;
                    right: 10px;
                    position: fixed;
                }
                
                .image-modal__image {
                    max-height: 70vh;
                }
                
                .image-modal__caption {
                    font-size: 14px;
                    padding: 0 20px;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'image-modal-styles';
        styleSheet.textContent = modalStyles;
        document.head.appendChild(styleSheet);
    }
    
    // Add modal to DOM
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Activate modal
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Close functionality
    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => {
            if (modal.parentNode) {
                document.body.removeChild(modal);
            }
            document.body.style.overflow = '';
        }, 300);
    };
    
    // Event listeners
    const closeBtn = modal.querySelector('.image-modal__close');
    const overlay = modal.querySelector('.image-modal__overlay');
    
    closeBtn.addEventListener('click', closeModal);
    
    overlay.addEventListener('click', function(event) {
        if (event.target === overlay) {
            closeModal();
        }
    });
    
    // Keyboard support
    const handleKeydown = (event) => {
        if (event.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleKeydown);
        }
    };
    
    document.addEventListener('keydown', handleKeydown);
    
    // Focus management
    closeBtn.focus();
}

// Scroll animations for craftsmen sections
function initScrollAnimations() {
    // Skip animations if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    
    const animatedElements = document.querySelectorAll('.craftsman, .technique, .philosophy__content');
    
    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        animatedElements.forEach((el, index) => {
            // Set initial state
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            el.style.transition = `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`;
            
            animationObserver.observe(el);
        });
        
        // Add CSS for animate-in class
        const animationStyles = `
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        
        if (!document.querySelector('#craftsmen-animation-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'craftsmen-animation-styles';
            styleSheet.textContent = animationStyles;
            document.head.appendChild(styleSheet);
        }
    }
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"], img[data-src]');
    
    if ('IntersectionObserver' in window && images.length > 0) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    if (img.dataset.src) {
                        // Handle data-src lazy loading
                        const newImg = new Image();
                        newImg.onload = function() {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            img.classList.add('loaded');
                        };
                        newImg.onerror = function() {
                            img.src = '../assets/images/placeholder-craftsman.jpg';
                            img.classList.add('error');
                        };
                        newImg.src = img.dataset.src;
                    }
                    
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '100px'
        });
        
        images.forEach(img => {
            if (img.dataset.src) {
                img.classList.add('lazy');
            }
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
        });
    }
}

// Craftsman profile interactions
function initCraftsmanProfiles() {
    const craftsmanCards = document.querySelectorAll('.craftsman');
    
    craftsmanCards.forEach((card, index) => {
        const workPreviews = card.querySelectorAll('.work-preview:not(.work-preview--more)');
        
        // Track work preview clicks
        workPreviews.forEach((preview, workIndex) => {
            preview.addEventListener('click', function() {
                if (typeof trackEvent === 'function') {
                    trackEvent('Craftsmen', 'Work Preview Click', `Craftsman ${index + 1} Work ${workIndex + 1}`);
                }
            });
        });
        
        // Track "more works" clicks
        const moreWorksLink = card.querySelector('.work-preview--more');
        if (moreWorksLink) {
            moreWorksLink.addEventListener('click', function() {
                if (typeof trackEvent === 'function') {
                    trackEvent('Craftsmen', 'More Works Click', `Craftsman ${index + 1}`);
                }
            });
        }
    });
}

// Initialize craftsman profiles
document.addEventListener('DOMContentLoaded', initCraftsmanProfiles);

// Technique cards hover effects
function initTechniqueCards() {
    const techniqueCards = document.querySelectorAll('.technique');
    
    techniqueCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.setProperty('--hover-scale', '1.02');
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.removeProperty('--hover-scale');
        });
        
        // Track technique card interactions
        card.addEventListener('click', function() {
            const title = this.querySelector('.technique__title')?.textContent || 'Unknown';
            if (typeof trackEvent === 'function') {
                trackEvent('Craftsmen', 'Technique Click', title);
            }
        });
    });
}

// Initialize technique cards
document.addEventListener('DOMContentLoaded', initTechniqueCards);

// CTA button tracking
function initCTATracking() {
    const ctaButtons = document.querySelectorAll('.cta .btn');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            if (typeof trackEvent === 'function') {
                trackEvent('Craftsmen', 'CTA Click', buttonText);
            }
        });
    });
}

// Initialize CTA tracking
document.addEventListener('DOMContentLoaded', initCTATracking);

// Error handling for missing images
function handleImageErrors() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            if (!this.dataset.errorHandled) {
                this.dataset.errorHandled = 'true';
                
                // Use appropriate placeholder based on context
                if (this.closest('.craftsman__image')) {
                    this.src = '../assets/images/placeholder-craftsman.jpg';
                } else if (this.closest('.workshop__image')) {
                    this.src = '../assets/images/placeholder-workshop.jpg';
                } else if (this.closest('.work-preview')) {
                    this.src = '../assets/images/placeholder-work.jpg';
                } else {
                    this.src = '../assets/images/placeholder.jpg';
                }
                
                this.alt = '画像を読み込めませんでした';
                
                // Track image error
                if (typeof trackEvent === 'function') {
                    trackEvent('Craftsmen', 'Image Error', this.src);
                }
            }
        });
    });
}

// Initialize error handling
document.addEventListener('DOMContentLoaded', handleImageErrors);

// Responsive behavior for craftsman cards
function initResponsiveBehavior() {
    const mediaQuery = window.matchMedia('(max-width: 1024px)');
    
    function handleResponsiveChanges(e) {
        const craftsmanCards = document.querySelectorAll('.craftsman');
        
        if (e.matches) {
            // Mobile/tablet view
            craftsmanCards.forEach(card => {
                card.classList.add('craftsman--mobile');
            });
        } else {
            // Desktop view
            craftsmanCards.forEach(card => {
                card.classList.remove('craftsman--mobile');
            });
        }
    }
    
    // Initial check
    handleResponsiveChanges(mediaQuery);
    
    // Listen for changes
    mediaQuery.addListener(handleResponsiveChanges);
}

// Initialize responsive behavior
document.addEventListener('DOMContentLoaded', initResponsiveBehavior);

// Performance optimization: Intersection Observer for heavy animations
function initPerformanceOptimizations() {
    // Pause animations when not in view
    if ('IntersectionObserver' in window) {
        const heavyAnimations = document.querySelectorAll('.craftsman__image, .workshop__image');
        
        const performanceObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                } else {
                    entry.target.style.animationPlayState = 'paused';
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        heavyAnimations.forEach(el => {
            performanceObserver.observe(el);
        });
    }
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', initPerformanceOptimizations);

// Export functions for external use
window.Craftsmen = {
    openImageModal: openImageModal,
    initWorkshopGallery: initWorkshopGallery
};

// Accessibility improvements
function initAccessibilityFeatures() {
    // Add skip links for screen readers
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'メインコンテンツへスキップ';
    skipLink.className = 'sr-only';
    skipLink.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            z-index: 10000;
            background: white;
            padding: 10px;
            border: 2px solid black;
            text-decoration: none;
            color: black;
        `;
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Improve focus management
    const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    
    focusableElements.forEach(el => {
        el.addEventListener('focus', function() {
            this.setAttribute('data-focused', 'true');
        });
        
        el.addEventListener('blur', function() {
            this.removeAttribute('data-focused');
        });
    });
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', initAccessibilityFeatures);