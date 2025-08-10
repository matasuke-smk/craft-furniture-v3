/**
 * Performance Optimization Utilities
 * Craft Furniture Website
 */

class PerformanceOptimizer {
    constructor() {
        this.lazyImages = [];
        this.intersectionObserver = null;
        this.loadedAssets = new Set();
        
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.setupResourcePreloading();
        this.setupCriticalResourceLoading();
        this.monitorPerformance();
    }

    setupLazyLoading() {
        // Images
        this.lazyImages = document.querySelectorAll('img[data-src], img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            this.intersectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        this.intersectionObserver.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            this.lazyImages.forEach(img => {
                this.intersectionObserver.observe(img);
            });
        } else {
            // Fallback for older browsers
            this.lazyImages.forEach(img => this.loadImage(img));
        }

        // Lazy load non-critical CSS
        this.lazyLoadCSS();
        
        // Lazy load non-critical JavaScript
        this.lazyLoadJS();
    }

    loadImage(img) {
        if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        }
        
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
        
        img.addEventListener('error', () => {
            img.classList.add('error');
            // Fallback image
            if (!img.dataset.fallback) {
                img.dataset.fallback = 'true';
                img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNHB4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pjwvc3ZnPg==';
            }
        });
    }

    lazyLoadCSS() {
        const nonCriticalCSS = [
            '/assets/css/animations.css',
            '/assets/css/print.css'
        ];

        // Load non-critical CSS after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                nonCriticalCSS.forEach(href => {
                    this.loadCSS(href);
                });
            }, 100);
        });
    }

    lazyLoadJS() {
        const nonCriticalJS = [
            '/assets/js/analytics.js',
            '/assets/js/social-sharing.js'
        ];

        // Load non-critical JS after user interaction or page idle
        const loadNonCriticalJS = () => {
            nonCriticalJS.forEach(src => {
                this.loadJS(src);
            });
        };

        // Load on first user interaction
        const interactionEvents = ['click', 'scroll', 'keydown', 'touchstart'];
        const loadOnInteraction = () => {
            loadNonCriticalJS();
            interactionEvents.forEach(event => {
                document.removeEventListener(event, loadOnInteraction, { passive: true });
            });
        };

        interactionEvents.forEach(event => {
            document.addEventListener(event, loadOnInteraction, { passive: true });
        });

        // Fallback: load after 3 seconds
        setTimeout(loadNonCriticalJS, 3000);
    }

    loadCSS(href) {
        if (this.loadedAssets.has(href)) return;
        
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.media = 'all';
        document.head.appendChild(link);
        
        this.loadedAssets.add(href);
    }

    loadJS(src) {
        if (this.loadedAssets.has(src)) return;
        
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        document.head.appendChild(script);
        
        this.loadedAssets.add(src);
    }

    setupResourcePreloading() {
        // Preload critical resources
        const criticalResources = [
            { href: '/assets/fonts/NotoSansJP-Regular.woff2', as: 'font', type: 'font/woff2' },
            { href: '/assets/fonts/NotoSerifJP-Regular.woff2', as: 'font', type: 'font/woff2' },
            { href: '/assets/images/hero-image.webp', as: 'image' }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            if (resource.type) link.type = resource.type;
            if (resource.as === 'font') link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }

    setupCriticalResourceLoading() {
        // Preload next page resources on hover
        document.addEventListener('mouseover', (e) => {
            const link = e.target.closest('a[href]');
            if (link && link.hostname === window.location.hostname) {
                this.preloadPage(link.href);
            }
        }, { passive: true });
    }

    preloadPage(url) {
        if (this.loadedAssets.has(url)) return;
        
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
        
        this.loadedAssets.add(url);
    }

    monitorPerformance() {
        // Core Web Vitals monitoring
        if ('web-vital' in window) {
            this.trackWebVitals();
        }
        
        // Resource timing monitoring
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.analyzeResourceTiming();
            }, 0);
        });
    }

    trackWebVitals() {
        // Placeholder for Web Vitals tracking
        // In production, use the web-vitals library
        console.log('Web Vitals tracking would be implemented here');
    }

    analyzeResourceTiming() {
        if (!window.performance || !window.performance.getEntriesByType) return;

        const resources = window.performance.getEntriesByType('resource');
        const slowResources = resources.filter(resource => resource.duration > 1000);
        
        if (slowResources.length > 0) {
            console.warn('Slow loading resources detected:', slowResources);
        }

        // Track largest contentful paint
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
            });
            
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        }
    }
}

class CacheManager {
    constructor() {
        this.cacheName = 'craft-furniture-v1';
        this.init();
    }

    init() {
        if ('serviceWorker' in navigator) {
            this.registerServiceWorker();
        }
        
        this.setupBrowserCaching();
    }

    async registerServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registered successfully');
            
            // Update available
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        this.showUpdateNotification();
                    }
                });
            });
        } catch (error) {
            console.log('Service Worker registration failed:', error);
        }
    }

    setupBrowserCaching() {
        // Add cache-busting for dynamic content
        const dynamicLinks = document.querySelectorAll('a[href*="/news/"], a[href*="/works/"]');
        dynamicLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const url = new URL(link.href);
                url.searchParams.set('v', Date.now());
                link.href = url.toString();
            });
        });
    }

    showUpdateNotification() {
        // Show update notification to user
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="update-content">
                <p>新しいバージョンが利用可能です</p>
                <button onclick="location.reload()" class="btn btn--primary btn--small">更新</button>
                <button onclick="this.parentElement.parentElement.remove()" class="btn btn--outline btn--small">後で</button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 10000;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 10000);
    }
}

class ErrorTracker {
    constructor() {
        this.errors = [];
        this.init();
    }

    init() {
        window.addEventListener('error', (e) => {
            this.logError({
                message: e.message,
                source: e.filename,
                line: e.lineno,
                column: e.colno,
                stack: e.error?.stack,
                timestamp: Date.now(),
                url: window.location.href,
                userAgent: navigator.userAgent
            });
        });

        window.addEventListener('unhandledrejection', (e) => {
            this.logError({
                message: 'Unhandled Promise Rejection',
                reason: e.reason,
                timestamp: Date.now(),
                url: window.location.href,
                userAgent: navigator.userAgent
            });
        });
    }

    logError(errorInfo) {
        this.errors.push(errorInfo);
        
        // Send to error tracking service
        if (this.errors.length >= 5 || errorInfo.message.includes('TypeError')) {
            this.sendErrorBatch();
        }
        
        console.error('Error tracked:', errorInfo);
    }

    sendErrorBatch() {
        if (this.errors.length === 0) return;
        
        // Send errors to logging service
        // In production, replace with actual error tracking service
        fetch('/api/errors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                errors: this.errors,
                timestamp: Date.now()
            })
        }).catch(() => {
            // Silently fail error reporting
        });
        
        this.errors = [];
    }
}

// Initialize performance optimization
document.addEventListener('DOMContentLoaded', () => {
    const performanceOptimizer = new PerformanceOptimizer();
    const cacheManager = new CacheManager();
    const errorTracker = new ErrorTracker();
    
    // Add performance monitoring to global scope for debugging
    window.performanceOptimizer = performanceOptimizer;
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PerformanceOptimizer,
        CacheManager,
        ErrorTracker
    };
}