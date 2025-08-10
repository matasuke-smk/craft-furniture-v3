// Common JavaScript functionality

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollEffects();
    initSmoothScroll();
    initAccessibility();
});

// Navigation functionality
function initNavigation() {
    const nav = document.querySelector('.nav');
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');
    const navLinks = document.querySelectorAll('.nav__link');
    const dropdownItems = document.querySelectorAll('.nav__item--dropdown');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isActive = navToggle.classList.contains('active');
            
            if (isActive) {
                closeNavMenu();
            } else {
                openNavMenu();
            }
        });

        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 1024) {
                    closeNavMenu();
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!nav.contains(event.target) && navToggle.classList.contains('active')) {
                closeNavMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && navToggle.classList.contains('active')) {
                closeNavMenu();
            }
        });
    }

    // Mobile dropdown functionality
    dropdownItems.forEach(item => {
        const link = item.querySelector('.nav__link');
        
        if (link) {
            link.addEventListener('click', function(event) {
                if (window.innerWidth <= 1024) {
                    event.preventDefault();
                    
                    // Close other dropdowns
                    dropdownItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                        }
                    });
                    
                    // Toggle current dropdown
                    item.classList.toggle('active');
                }
            });
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024) {
            closeNavMenu();
            dropdownItems.forEach(item => {
                item.classList.remove('active');
            });
        }
    });

    function openNavMenu() {
        navToggle.classList.add('active');
        navMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
        navToggle.setAttribute('aria-expanded', 'true');
    }

    function closeNavMenu() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
        navToggle.setAttribute('aria-expanded', 'false');
        
        // Close all dropdowns
        dropdownItems.forEach(item => {
            item.classList.remove('active');
        });
    }
}

// Scroll effects
function initScrollEffects() {
    const header = document.querySelector('.header');
    
    if (header) {
        let lastScrollY = window.scrollY;
        
        const updateHeader = () => {
            const currentScrollY = window.scrollY;
            
            // Add scrolled class when scrolling down
            if (currentScrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScrollY = currentScrollY;
        };
        
        // Use requestAnimationFrame for better performance
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateHeader();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate in
    const animateElements = document.querySelectorAll('.concept__item, .works__item, .craftsmen__item, .news__item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
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
            }
        });
    });
}

// Accessibility improvements
function initAccessibility() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-link sr-only';
    skipLink.textContent = 'メインコンテンツへスキップ';
    skipLink.style.cssText = `
        position: absolute;
        top: 20px;
        left: 20px;
        background: var(--color-accent);
        color: var(--color-white);
        padding: 10px 15px;
        border-radius: 4px;
        text-decoration: none;
        font-weight: bold;
        z-index: 9999;
        transform: translateY(-100%);
        transition: transform 0.2s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.transform = 'translateY(0)';
        this.classList.remove('sr-only');
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.transform = 'translateY(-100%)';
        this.classList.add('sr-only');
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main id to main element
    const main = document.querySelector('.main');
    if (main) {
        main.id = 'main';
        main.setAttribute('tabindex', '-1');
    }
    
    // Focus management
    document.addEventListener('keydown', function(event) {
        // ESC key closes modals and dropdowns
        if (event.key === 'Escape') {
            const activeDropdowns = document.querySelectorAll('.nav__item--dropdown.active');
            activeDropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
}

// Utility functions
const utils = {
    // Debounce function
    debounce: function(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },
    
    // Throttle function
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Check if element is in viewport
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    // Format price with commas
    formatPrice: function(price) {
        return new Intl.NumberFormat('ja-JP').format(price);
    },
    
    // Format date
    formatDate: function(date) {
        return new Intl.DateTimeFormat('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(new Date(date));
    },
    
    // Lazy load images
    lazyLoadImages: function() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    },
    
    // Show loading state
    showLoading: function(element) {
        element.classList.add('loading');
        element.setAttribute('aria-busy', 'true');
    },
    
    // Hide loading state
    hideLoading: function(element) {
        element.classList.remove('loading');
        element.removeAttribute('aria-busy');
    },
    
    // Show error message
    showError: function(message, container) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.setAttribute('role', 'alert');
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            background: var(--color-error);
            color: var(--color-white);
            padding: 12px 16px;
            border-radius: 6px;
            margin-bottom: 16px;
            animation: fadeIn 0.3s ease;
        `;
        
        container.insertBefore(errorDiv, container.firstChild);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }
};

// Export utils for use in other files
window.CraftFurnitureUtils = utils;

// Analytics and tracking (placeholder)
function trackEvent(category, action, label = null, value = null) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value
        });
    }
    
    // Console log for development
    console.log('Event tracked:', { category, action, label, value });
}

// Performance monitoring
function measurePerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                
                trackEvent('Performance', 'Page Load Time', 'Home', Math.round(loadTime));
            }, 0);
        });
    }
}

// Initialize performance monitoring
measurePerformance();

// Service Worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // navigator.serviceWorker.register('/sw.js')
        //     .then(function(registration) {
        //         console.log('SW registered: ', registration);
        //     })
        //     .catch(function(registrationError) {
        //         console.log('SW registration failed: ', registrationError);
        //     });
    });
}