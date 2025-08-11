/**
 * News Page Functionality
 * Craft Furniture Website
 */

class NewsFilter {
    constructor() {
        this.currentFilter = 'all';
        this.newsCards = document.querySelectorAll('.news-card-link');
        this.filterTabs = document.querySelectorAll('.filter-tab');
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateVisibility();
    }

    bindEvents() {
        this.filterTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.setActiveFilter(category);
                this.filterNews(category);
            });
        });
    }

    setActiveFilter(category) {
        this.currentFilter = category;
        
        this.filterTabs.forEach(tab => {
            tab.classList.remove('active');
        });
        
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
    }

    filterNews(category) {
        this.newsCards.forEach(card => {
            const article = card.querySelector('.news-card');
            const cardCategory = article ? article.dataset.category : null;
            
            if (category === 'all' || cardCategory === category) {
                this.showCard(card);
            } else {
                this.hideCard(card);
            }
        });
        
        this.updateNoResultsMessage();
    }

    showCard(card) {
        card.style.display = 'block';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }

    hideCard(card) {
        card.style.display = 'none';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
    }

    updateVisibility() {
        this.newsCards.forEach(card => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        });
    }

    updateNoResultsMessage() {
        const visibleCards = Array.from(this.newsCards).filter(card => 
            card.style.display !== 'none'
        );

        const existingMessage = document.querySelector('.no-results-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        if (visibleCards.length === 0) {
            const message = document.createElement('div');
            message.className = 'no-results-message';
            message.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--color-gray);">
                    <h3>該当する記事が見つかりませんでした</h3>
                    <p>他のカテゴリーもご覧ください。</p>
                </div>
            `;
            
            const newsGrid = document.querySelector('.news-grid');
            newsGrid.parentNode.insertBefore(message, newsGrid.nextSibling);
        }
    }

    // Public method to filter by category (for external use)
    filterByCategory(category) {
        this.setActiveFilter(category);
        this.filterNews(category);
    }
}

class NewsletterForm {
    constructor() {
        this.form = document.querySelector('.newsletter__form');
        this.init();
    }

    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    async handleSubmit() {
        const emailInput = this.form.querySelector('.newsletter__input');
        const submitButton = this.form.querySelector('.btn');
        const email = emailInput.value.trim();

        // Basic email validation
        if (!this.validateEmail(email)) {
            this.showMessage('有効なメールアドレスを入力してください。', 'error');
            return;
        }

        // Show loading state
        const originalText = submitButton.textContent;
        submitButton.textContent = '登録中...';
        submitButton.disabled = true;

        try {
            // Simulate API call
            await this.simulateNewsletterRegistration(email);
            
            // Success
            this.showMessage('ニュースレターの登録が完了しました。', 'success');
            emailInput.value = '';
            
        } catch (error) {
            console.error('Newsletter registration error:', error);
            this.showMessage('登録に失敗しました。しばらく後でお試しください。', 'error');
        } finally {
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    simulateNewsletterRegistration(email) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success (90% success rate)
                if (Math.random() > 0.1) {
                    console.log(`Newsletter registration: ${email}`);
                    resolve();
                } else {
                    reject(new Error('Network error'));
                }
            }, 1500);
        });
    }

    showMessage(message, type) {
        const existingMessage = this.form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageElement = document.createElement('div');
        messageElement.className = `form-message form-message--${type}`;
        messageElement.textContent = message;
        messageElement.style.cssText = `
            padding: 0.75rem 1rem;
            margin-top: 1rem;
            border-radius: 6px;
            font-size: 0.875rem;
            ${type === 'success' 
                ? 'background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;'
                : 'background-color: #f8d7da; color: #721c24; border: 1px solid #f1b0b7;'
            }
        `;

        this.form.appendChild(messageElement);

        // Remove message after 5 seconds
        setTimeout(() => {
            if (messageElement.parentElement) {
                messageElement.remove();
            }
        }, 5000);
    }
}

class NewsPagination {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 9;
        this.totalItems = document.querySelectorAll('.news-card-link').length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        
        // ページネーションが不要な場合は非表示にする
        if (this.totalPages <= 1) {
            this.hidePagination();
            return;
        }
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updatePagination();
    }

    bindEvents() {
        const prevBtn = document.querySelector('.pagination-btn--prev');
        const nextBtn = document.querySelector('.pagination-btn--next');
        const pageLinks = document.querySelectorAll('.pagination-link');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.goToPreviousPage());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.goToNextPage());
        }

        pageLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const page = parseInt(e.target.textContent);
                if (!isNaN(page)) {
                    this.goToPage(page);
                }
            });
        });
    }

    goToPage(page) {
        if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
            this.currentPage = page;
            this.updatePagination();
            this.scrollToTop();
        }
    }

    goToPreviousPage() {
        this.goToPage(this.currentPage - 1);
    }

    goToNextPage() {
        this.goToPage(this.currentPage + 1);
    }

    updatePagination() {
        // Update button states
        const prevBtn = document.querySelector('.pagination-btn--prev');
        const nextBtn = document.querySelector('.pagination-btn--next');

        if (prevBtn) {
            prevBtn.disabled = this.currentPage === 1;
        }

        if (nextBtn) {
            nextBtn.disabled = this.currentPage === this.totalPages;
        }

        // Update page numbers
        const pageLinks = document.querySelectorAll('.pagination-link');
        pageLinks.forEach(link => {
            link.classList.remove('active');
            if (parseInt(link.textContent) === this.currentPage) {
                link.classList.add('active');
            }
        });
    }

    scrollToTop() {
        const newsSection = document.querySelector('.news-list');
        if (newsSection) {
            newsSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    hidePagination() {
        const paginationElement = document.querySelector('.pagination');
        if (paginationElement) {
            paginationElement.style.display = 'none';
        }
    }
}

// Search functionality (if search is added in the future)
class NewsSearch {
    constructor() {
        this.searchInput = document.querySelector('.news-search');
        this.newsCards = document.querySelectorAll('.news-card-link');
        this.originalCards = Array.from(this.newsCards);
        
        if (this.searchInput) {
            this.init();
        }
    }

    init() {
        let searchTimeout;
        
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performSearch(e.target.value.trim());
            }, 300);
        });
    }

    performSearch(query) {
        if (query === '') {
            this.showAllCards();
            return;
        }

        const searchTerms = query.toLowerCase().split(' ');
        
        this.newsCards.forEach(card => {
            const title = card.querySelector('.news-card__title').textContent.toLowerCase();
            const excerpt = card.querySelector('.news-card__excerpt')?.textContent.toLowerCase() || '';
            const content = title + ' ' + excerpt;

            const matches = searchTerms.every(term => content.includes(term));
            
            if (matches) {
                this.showCard(card);
            } else {
                this.hideCard(card);
            }
        });
    }

    showAllCards() {
        this.newsCards.forEach(card => this.showCard(card));
    }

    showCard(card) {
        card.style.display = 'block';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }

    hideCard(card) {
        card.style.display = 'none';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
    }
}

// Lazy loading for images
class NewsImageLazyLoading {
    constructor() {
        this.images = document.querySelectorAll('img[loading="lazy"]');
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.add('loaded');
                        this.observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px'
            });

            this.images.forEach(img => {
                this.observer.observe(img);
            });
        }
    }
}

// Analytics helper
class NewsAnalytics {
    constructor() {
        this.init();
    }

    init() {
        this.trackNewsCardClicks();
        this.trackFilterUsage();
        this.trackNewsletterSignups();
    }

    trackNewsCardClicks() {
        document.querySelectorAll('.news-card-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const titleElement = link.querySelector('.news-card__title');
                const title = titleElement ? titleElement.textContent : '';
                const href = link.getAttribute('href');
                
                // Track with analytics service
                this.trackEvent('news_click', {
                    title: title,
                    url: href
                });
            });
        });
    }

    trackFilterUsage() {
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                
                this.trackEvent('filter_used', {
                    category: category
                });
            });
        });
    }

    trackNewsletterSignups() {
        const form = document.querySelector('.newsletter__form');
        if (form) {
            form.addEventListener('submit', () => {
                this.trackEvent('newsletter_signup', {});
            });
        }
    }

    trackEvent(eventName, properties) {
        // Placeholder for analytics tracking
        // In production, this would send data to your analytics service
        console.log('Analytics Event:', eventName, properties);
        
        // Example: Google Analytics 4
        // gtag('event', eventName, properties);
        
        // Example: Custom analytics
        // analytics.track(eventName, properties);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize core functionality
    const newsFilter = new NewsFilter();
    const newsletterForm = new NewsletterForm();
    const newsPagination = new NewsPagination();
    const newsImageLazyLoading = new NewsImageLazyLoading();
    
    // Initialize analytics (optional)
    const newsAnalytics = new NewsAnalytics();
    
    // Check for URL parameters to filter initially
    const urlParams = new URLSearchParams(window.location.search);
    const initialCategory = urlParams.get('category');
    if (initialCategory && ['exhibition', 'news', 'media'].includes(initialCategory)) {
        newsFilter.filterByCategory(initialCategory);
    }

    // Add smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add loading states for external links
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        link.addEventListener('click', () => {
            // Add loading indicator for external links if needed
        });
    });
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        NewsFilter,
        NewsletterForm,
        NewsPagination,
        NewsSearch,
        NewsImageLazyLoading,
        NewsAnalytics
    };
}