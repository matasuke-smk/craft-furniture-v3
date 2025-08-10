// Work Detail Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initWorkDetail();
});

function initWorkDetail() {
    initImageGallery();
    initFullscreenModal();
    initLazyLoading();
    
    // Track page view
    if (typeof trackEvent === 'function') {
        const workTitle = document.querySelector('.work-detail__title')?.textContent || 'Unknown Work';
        trackEvent('Work Detail', 'Page View', workTitle);
    }
}

// Image Gallery
function initImageGallery() {
    const mainImage = document.getElementById('main-image');
    const thumbnails = document.querySelectorAll('.gallery__thumbnail');
    
    if (!mainImage || thumbnails.length === 0) {
        return;
    }
    
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', function() {
            const imageUrl = this.dataset.image;
            const imageAlt = this.querySelector('img').alt;
            
            if (imageUrl && imageUrl !== mainImage.src) {
                // Update main image with fade effect
                mainImage.style.opacity = '0';
                
                setTimeout(() => {
                    mainImage.src = imageUrl;
                    mainImage.alt = imageAlt;
                    mainImage.style.opacity = '1';
                }, 150);
                
                // Update active thumbnail
                thumbnails.forEach(thumb => {
                    thumb.classList.remove('gallery__thumbnail--active');
                });
                this.classList.add('gallery__thumbnail--active');
                
                // Track thumbnail click
                if (typeof trackEvent === 'function') {
                    trackEvent('Work Detail', 'Thumbnail Click', `Image ${index + 1}`);
                }
            }
        });
        
        // Keyboard support
        thumbnail.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.click();
            }
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(event) {
        if (event.target.closest('.work-detail__gallery')) {
            const activeThumbnail = document.querySelector('.gallery__thumbnail--active');
            const activeThumbnailIndex = Array.from(thumbnails).indexOf(activeThumbnail);
            
            let nextIndex = -1;
            
            switch(event.key) {
                case 'ArrowLeft':
                    nextIndex = activeThumbnailIndex > 0 ? activeThumbnailIndex - 1 : thumbnails.length - 1;
                    break;
                case 'ArrowRight':
                    nextIndex = activeThumbnailIndex < thumbnails.length - 1 ? activeThumbnailIndex + 1 : 0;
                    break;
            }
            
            if (nextIndex >= 0) {
                event.preventDefault();
                thumbnails[nextIndex].click();
                thumbnails[nextIndex].focus();
            }
        }
    });
    
    // Preload adjacent images
    preloadAdjacentImages();
}

function preloadAdjacentImages() {
    const thumbnails = document.querySelectorAll('.gallery__thumbnail');
    const activeThumbnail = document.querySelector('.gallery__thumbnail--active');
    const activeIndex = Array.from(thumbnails).indexOf(activeThumbnail);
    
    if (activeIndex >= 0) {
        // Preload previous and next images
        const prevIndex = activeIndex > 0 ? activeIndex - 1 : thumbnails.length - 1;
        const nextIndex = activeIndex < thumbnails.length - 1 ? activeIndex + 1 : 0;
        
        [prevIndex, nextIndex].forEach(index => {
            const imageUrl = thumbnails[index].dataset.image;
            if (imageUrl) {
                const img = new Image();
                img.src = imageUrl;
            }
        });
    }
}

// Fullscreen Modal
function initFullscreenModal() {
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const mainImage = document.getElementById('main-image');
    
    if (!fullscreenBtn || !mainImage) {
        return;
    }
    
    fullscreenBtn.addEventListener('click', function() {
        openFullscreenModal(mainImage.src, mainImage.alt);
        
        // Track fullscreen view
        if (typeof trackEvent === 'function') {
            trackEvent('Work Detail', 'Fullscreen View', mainImage.alt);
        }
    });
    
    // Double click on main image to open fullscreen
    mainImage.addEventListener('dblclick', function() {
        openFullscreenModal(this.src, this.alt);
        
        // Track fullscreen view
        if (typeof trackEvent === 'function') {
            trackEvent('Work Detail', 'Fullscreen View', 'Double Click');
        }
    });
}

function openFullscreenModal(imageSrc, imageAlt) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'fullscreen-modal';
    modal.innerHTML = `
        <div class="fullscreen-modal__overlay">
            <div class="fullscreen-modal__content">
                <img src="${imageSrc}" alt="${imageAlt}" class="fullscreen-modal__image">
                <button class="fullscreen-modal__close" aria-label="閉じる">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                <div class="fullscreen-modal__caption">${imageAlt}</div>
            </div>
        </div>
    `;
    
    // Add modal styles
    const modalStyles = `
        .fullscreen-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .fullscreen-modal.active {
            opacity: 1;
        }
        
        .fullscreen-modal__overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .fullscreen-modal__content {
            position: relative;
            max-width: 90vw;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .fullscreen-modal__image {
            max-width: 100%;
            max-height: 80vh;
            object-fit: contain;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }
        
        .fullscreen-modal__close {
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
        
        .fullscreen-modal__close:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.1);
        }
        
        .fullscreen-modal__caption {
            margin-top: 20px;
            color: white;
            text-align: center;
            font-size: 16px;
            max-width: 80%;
        }
        
        @media (max-width: 768px) {
            .fullscreen-modal__close {
                top: 10px;
                right: 10px;
                position: fixed;
            }
            
            .fullscreen-modal__image {
                max-height: 70vh;
            }
            
            .fullscreen-modal__caption {
                font-size: 14px;
            }
        }
    `;
    
    // Inject styles if not already present
    if (!document.querySelector('#fullscreen-modal-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'fullscreen-modal-styles';
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
            document.body.removeChild(modal);
            document.body.style.overflow = '';
        }, 300);
    };
    
    // Event listeners
    const closeBtn = modal.querySelector('.fullscreen-modal__close');
    const overlay = modal.querySelector('.fullscreen-modal__overlay');
    
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

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src], img[loading="lazy"]');
    
    if ('IntersectionObserver' in window && images.length > 0) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
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
                            img.src = '../assets/images/placeholder-work.jpg';
                            img.classList.add('error');
                        };
                        newImg.src = img.dataset.src;
                    }
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
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

// Smooth scrolling for anchor links within the page
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                event.preventDefault();
                
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Track anchor click
                if (typeof trackEvent === 'function') {
                    trackEvent('Work Detail', 'Anchor Click', targetId);
                }
            }
        });
    });
}

// Initialize smooth scrolling
document.addEventListener('DOMContentLoaded', initSmoothScrolling);

// Share functionality (if needed in the future)
function initShareButtons() {
    const shareButtons = document.querySelectorAll('[data-share]');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.dataset.share;
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            const text = encodeURIComponent(document.querySelector('meta[name="description"]')?.content || '');
            
            let shareUrl = '';
            
            switch (platform) {
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                    break;
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'line':
                    shareUrl = `https://social-plugins.line.me/lineit/share?url=${url}`;
                    break;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400,noopener,noreferrer');
                
                // Track share
                if (typeof trackEvent === 'function') {
                    trackEvent('Work Detail', 'Share', platform);
                }
            }
        });
    });
}

// Performance optimization: Intersection Observer for animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.work-detail__info, .customer-comment, .craftsman-comment, .related-works');
    
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
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            animationObserver.observe(el);
        });
        
        // Add CSS for animate-in class
        const animationStyles = `
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = animationStyles;
        document.head.appendChild(styleSheet);
    }
}

// Initialize scroll animations if not disabled
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
}

// Error handling for missing images
function handleImageErrors() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            if (!this.dataset.errorHandled) {
                this.dataset.errorHandled = 'true';
                this.src = '../assets/images/placeholder-work.jpg';
                this.alt = '画像を読み込めませんでした';
                
                // Track image error
                if (typeof trackEvent === 'function') {
                    trackEvent('Work Detail', 'Image Error', this.src);
                }
            }
        });
    });
}

// Initialize error handling
document.addEventListener('DOMContentLoaded', handleImageErrors);

// Export functions for external use
window.WorkDetail = {
    openFullscreen: openFullscreenModal,
    initGallery: initImageGallery
};