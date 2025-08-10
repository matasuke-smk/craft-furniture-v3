// Process Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initProcessPage();
});

function initProcessPage() {
    initScrollAnimations();
    initProcessStepInteractions();
    initToolItemAnimations();
    initProgressIndicator();
    
    // Track page view
    if (typeof trackEvent === 'function') {
        trackEvent('Process', 'Page View', 'Process Guide');
    }
}

// Scroll-triggered animations
function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) {
        // Fallback for browsers without IntersectionObserver
        const elements = document.querySelectorAll('.process-detail, .tool-item');
        elements.forEach(el => el.classList.add('in-view'));
        return;
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '50px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                // Track section view
                if (typeof trackEvent === 'function') {
                    const sectionName = entry.target.className.includes('process-detail') 
                        ? 'Process Detail' 
                        : 'Tool Item';
                    trackEvent('Process', 'Section View', sectionName);
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe process details
    const processDetails = document.querySelectorAll('.process-detail');
    processDetails.forEach(detail => {
        observer.observe(detail);
    });

    // Observe tool items
    const toolItems = document.querySelectorAll('.tool-item');
    toolItems.forEach(item => {
        observer.observe(item);
    });
}

// Process step interactions
function initProcessStepInteractions() {
    const processSteps = document.querySelectorAll('.process-step');
    
    processSteps.forEach((step, index) => {
        // Add hover tracking
        step.addEventListener('mouseenter', function() {
            if (typeof trackEvent === 'function') {
                const stepTitle = this.querySelector('.process-step__title').textContent;
                trackEvent('Process', 'Step Hover', stepTitle, index + 1);
            }
        });
        
        // Add click tracking
        step.addEventListener('click', function() {
            if (typeof trackEvent === 'function') {
                const stepTitle = this.querySelector('.process-step__title').textContent;
                trackEvent('Process', 'Step Click', stepTitle, index + 1);
            }
            
            // Highlight the step
            highlightStep(this);
            
            // Scroll to corresponding detailed section if exists
            const correspondingDetail = document.querySelector(`[data-step="${index + 1}"]`);
            if (correspondingDetail) {
                correspondingDetail.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        });

        // Add keyboard support
        step.setAttribute('tabindex', '0');
        step.setAttribute('role', 'button');
        step.setAttribute('aria-label', `工程${index + 1}: ${step.querySelector('.process-step__title').textContent}の詳細を見る`);
        
        step.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.click();
            }
        });
    });
}

function highlightStep(stepElement) {
    // Remove existing highlights
    const allSteps = document.querySelectorAll('.process-step');
    allSteps.forEach(step => step.classList.remove('process-step--highlighted'));
    
    // Add highlight to clicked step
    stepElement.classList.add('process-step--highlighted');
    
    // Remove highlight after animation
    setTimeout(() => {
        stepElement.classList.remove('process-step--highlighted');
    }, 2000);
}

// Tool item animations and interactions
function initToolItemAnimations() {
    const toolItems = document.querySelectorAll('.tool-item');
    
    toolItems.forEach((item, index) => {
        // Stagger animation
        item.style.animationDelay = `${index * 0.1}s`;
        
        // Add hover interaction
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
        
        // Track tool interactions
        item.addEventListener('click', function() {
            if (typeof trackEvent === 'function') {
                const toolName = this.querySelector('.tool-item__title').textContent;
                trackEvent('Process', 'Tool View', toolName);
            }
        });
    });
}

// Progress indicator for reading
function initProgressIndicator() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.innerHTML = '<div class="reading-progress__bar"></div>';
    
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: rgba(62, 39, 35, 0.1);
        z-index: 1000;
        pointer-events: none;
    `;
    
    const progressBarInner = progressBar.querySelector('.reading-progress__bar');
    progressBarInner.style.cssText = `
        height: 100%;
        background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
        width: 0%;
        transition: width 0.3s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    // Update progress on scroll
    let ticking = false;
    
    function updateProgress() {
        const scrollTop = window.pageYOffset;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / documentHeight) * 100;
        
        progressBarInner.style.width = `${Math.min(progress, 100)}%`;
        ticking = false;
    }
    
    function requestProgressUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateProgress);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestProgressUpdate);
    
    // Hide progress bar when page is complete
    window.addEventListener('scroll', debounce(() => {
        const scrollTop = window.pageYOffset;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        if (scrollTop >= documentHeight * 0.95) {
            progressBar.style.opacity = '0';
        } else {
            progressBar.style.opacity = '1';
        }
    }, 100));
}

// Smooth scroll for internal links
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Track navigation
                if (typeof trackEvent === 'function') {
                    trackEvent('Process', 'Internal Navigation', targetId);
                }
            }
        });
    });
}

// Process timeline enhancement
function initTimelineEnhancements() {
    const timeline = document.querySelector('.process-timeline');
    if (!timeline) return;
    
    // Add intersection observer to animate timeline line
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('timeline-animate');
            }
        });
    }, {
        threshold: 0.3
    });
    
    timelineObserver.observe(timeline);
}

// Tool comparison modal (future enhancement)
function initToolComparison() {
    const compareButtons = document.querySelectorAll('.tool-compare-btn');
    
    compareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const toolData = this.closest('.tool-item').dataset;
            showToolComparison(toolData);
        });
    });
}

function showToolComparison(toolData) {
    // Create modal for tool comparison
    const modal = document.createElement('div');
    modal.className = 'tool-comparison-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close" aria-label="モーダルを閉じる">×</button>
                <h3>工具の詳細</h3>
                <div class="tool-comparison-content">
                    <!-- Tool comparison content would go here -->
                    <p>工具の詳細な仕様と使用方法について説明します。</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            document.body.removeChild(modal);
        }
    });
    
    // Escape key to close
    document.addEventListener('keydown', function escapeHandler(event) {
        if (event.key === 'Escape') {
            document.body.removeChild(modal);
            document.removeEventListener('keydown', escapeHandler);
        }
    });
}

// Process step navigation
function initStepNavigation() {
    const steps = document.querySelectorAll('.process-step');
    const details = document.querySelectorAll('.process-detail');
    
    if (steps.length === 0 || details.length === 0) return;
    
    // Create navigation dots
    const nav = document.createElement('nav');
    nav.className = 'process-navigation';
    nav.setAttribute('aria-label', '製作工程ナビゲーション');
    
    const navList = document.createElement('ul');
    navList.className = 'process-nav-list';
    
    steps.forEach((step, index) => {
        const navItem = document.createElement('li');
        const navButton = document.createElement('button');
        
        navButton.className = 'process-nav-button';
        navButton.textContent = `${index + 1}`;
        navButton.setAttribute('aria-label', `工程${index + 1}へ移動`);
        
        navButton.addEventListener('click', () => {
            const targetDetail = details[index];
            if (targetDetail) {
                targetDetail.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                
                // Update active state
                updateNavState(index);
                
                // Track navigation
                if (typeof trackEvent === 'function') {
                    trackEvent('Process', 'Step Navigation', `Step ${index + 1}`);
                }
            }
        });
        
        navItem.appendChild(navButton);
        navList.appendChild(navItem);
    });
    
    nav.appendChild(navList);
    document.body.appendChild(nav);
    
    // Update navigation state based on scroll
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(details).indexOf(entry.target);
                if (index !== -1) {
                    updateNavState(index);
                }
            }
        });
    }, {
        threshold: 0.5
    });
    
    details.forEach(detail => {
        navObserver.observe(detail);
    });
}

function updateNavState(activeIndex) {
    const navButtons = document.querySelectorAll('.process-nav-button');
    navButtons.forEach((button, index) => {
        button.classList.toggle('active', index === activeIndex);
    });
}

// Quality promise animation
function initQualityPromiseAnimation() {
    const features = document.querySelectorAll('.promise-feature');
    
    features.forEach((feature, index) => {
        feature.style.animationDelay = `${index * 0.2}s`;
        
        feature.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.05)';
        });
        
        feature.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// Utility functions
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

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    initSmoothScroll();
    initTimelineEnhancements();
    initStepNavigation();
    initQualityPromiseAnimation();
});

// Export functions for external use
window.ProcessPage = {
    highlightStep: highlightStep,
    updateProgress: function() {
        // Manual progress update
        const event = new Event('scroll');
        window.dispatchEvent(event);
    }
};