/**
 * Privacy Policy Page Functionality
 * Craft Furniture Website
 */

class PrivacyPageHandler {
    constructor() {
        this.tocLinks = document.querySelectorAll('.toc-link');
        this.sections = document.querySelectorAll('.privacy-section[id]');
        this.scrollTopButton = null;
        
        this.init();
    }

    init() {
        this.setupTableOfContents();
        this.setupScrollTopButton();
        this.setupSmoothScrolling();
        this.setupScrollSpy();
        this.trackReadingProgress();
    }

    setupTableOfContents() {
        this.tocLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').slice(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    this.scrollToSection(targetSection);
                    this.updateActiveLink(link);
                }
            });
        });
    }

    scrollToSection(section) {
        const offsetTop = section.offsetTop - 100; // Account for fixed header
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }

    updateActiveLink(activeLink) {
        this.tocLinks.forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    setupScrollTopButton() {
        // Create scroll to top button
        this.scrollTopButton = document.createElement('button');
        this.scrollTopButton.className = 'scroll-top';
        this.scrollTopButton.innerHTML = `
            <svg class="icon" viewBox="0 0 24 24">
                <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
            </svg>
        `;
        this.scrollTopButton.setAttribute('aria-label', 'ページトップへ戻る');
        
        document.body.appendChild(this.scrollTopButton);
        
        // Handle scroll to top
        this.scrollTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                this.scrollTopButton.classList.add('visible');
            } else {
                this.scrollTopButton.classList.remove('visible');
            }
        });
    }

    setupSmoothScrolling() {
        // Handle all internal hash links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href').slice(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    this.scrollToSection(targetElement);
                }
            });
        });
    }

    setupScrollSpy() {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    const correspondingLink = document.querySelector(`.toc-link[href="#${id}"]`);
                    
                    if (correspondingLink) {
                        this.updateActiveLink(correspondingLink);
                    }
                }
            });
        }, observerOptions);

        this.sections.forEach(section => {
            observer.observe(section);
        });
    }

    trackReadingProgress() {
        let startTime = Date.now();
        let maxScroll = 0;

        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            maxScroll = Math.max(maxScroll, scrollPercent);
        });

        // Track when user leaves the page
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            
            // Analytics tracking (placeholder)
            this.trackEvent('privacy_policy_reading', {
                time_spent: timeSpent,
                max_scroll_percent: maxScroll
            });
        });
    }

    trackEvent(eventName, properties) {
        // Placeholder for analytics tracking
        console.log('Privacy Policy Analytics:', eventName, properties);
        
        // In production, integrate with your analytics service
        // gtag('event', eventName, properties);
    }
}

class PrintableVersion {
    constructor() {
        this.init();
    }

    init() {
        this.addPrintButton();
        this.setupPrintStyles();
    }

    addPrintButton() {
        const printButton = document.createElement('button');
        printButton.className = 'print-button';
        printButton.innerHTML = `
            <svg class="icon" viewBox="0 0 24 24">
                <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
            </svg>
            印刷用ページ
        `;
        
        printButton.style.cssText = `
            position: fixed;
            top: 50%;
            right: -120px;
            transform: translateY(-50%);
            background-color: var(--color-forest-green);
            color: white;
            border: none;
            padding: 1rem;
            border-radius: 8px 0 0 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.875rem;
            font-weight: 500;
            transition: right 0.3s ease;
            z-index: 1000;
            writing-mode: vertical-rl;
            text-orientation: mixed;
        `;

        // Show button on hover
        printButton.addEventListener('mouseenter', () => {
            printButton.style.right = '0px';
        });

        printButton.addEventListener('mouseleave', () => {
            printButton.style.right = '-120px';
        });

        printButton.addEventListener('click', () => {
            window.print();
        });

        document.body.appendChild(printButton);
    }

    setupPrintStyles() {
        const printStyles = document.createElement('style');
        printStyles.textContent = `
            @media print {
                .header, .footer, .breadcrumb, .cta-section, .scroll-top, .print-button {
                    display: none !important;
                }
                
                .privacy-layout {
                    grid-template-columns: 1fr !important;
                    gap: 1rem !important;
                }
                
                .privacy-toc {
                    display: none !important;
                }
                
                .privacy-main {
                    box-shadow: none !important;
                    border: 1px solid #ddd !important;
                    margin: 0 !important;
                }
                
                .privacy-section {
                    page-break-inside: avoid;
                    break-inside: avoid;
                }
                
                .privacy-section__title {
                    page-break-after: avoid;
                    break-after: avoid;
                }
                
                .table {
                    page-break-inside: avoid;
                    break-inside: avoid;
                }
                
                body {
                    font-size: 12pt !important;
                    line-height: 1.4 !important;
                }
                
                h1, h2, h3 {
                    color: #000 !important;
                }
            }
        `;
        
        document.head.appendChild(printStyles);
    }
}

class AccessibilityEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.addSkipLinks();
        this.enhanceScreenReaderSupport();
    }

    setupKeyboardNavigation() {
        // Handle keyboard navigation for TOC
        this.tocLinks = document.querySelectorAll('.toc-link');
        
        this.tocLinks.forEach((link, index) => {
            link.addEventListener('keydown', (e) => {
                switch (e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        const nextLink = this.tocLinks[index + 1];
                        if (nextLink) nextLink.focus();
                        break;
                    
                    case 'ArrowUp':
                        e.preventDefault();
                        const prevLink = this.tocLinks[index - 1];
                        if (prevLink) prevLink.focus();
                        break;
                    
                    case 'Home':
                        e.preventDefault();
                        this.tocLinks[0].focus();
                        break;
                    
                    case 'End':
                        e.preventDefault();
                        this.tocLinks[this.tocLinks.length - 1].focus();
                        break;
                }
            });
        });
    }

    addSkipLinks() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'メインコンテンツにスキップ';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1000;
            transition: top 0.3s;
        `;

        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });

        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });

        document.body.insertAdjacentElement('afterbegin', skipLink);

        // Add main-content ID to the privacy main content
        const mainContent = document.querySelector('.privacy-main');
        if (mainContent) {
            mainContent.setAttribute('id', 'main-content');
            mainContent.setAttribute('role', 'main');
        }
    }

    enhanceScreenReaderSupport() {
        // Add landmarks and ARIA labels
        const toc = document.querySelector('.privacy-toc');
        if (toc) {
            toc.setAttribute('role', 'navigation');
            toc.setAttribute('aria-label', 'プライバシーポリシー目次');
        }

        // Add section landmarks
        document.querySelectorAll('.privacy-section').forEach((section, index) => {
            section.setAttribute('role', 'region');
            const title = section.querySelector('.privacy-section__title');
            if (title) {
                const titleId = `section-${index}-title`;
                title.setAttribute('id', titleId);
                section.setAttribute('aria-labelledby', titleId);
            }
        });

        // Enhance table accessibility
        document.querySelectorAll('.table').forEach((table, index) => {
            table.setAttribute('role', 'table');
            const caption = document.createElement('caption');
            caption.textContent = `表 ${index + 1}`;
            caption.style.cssText = `
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            `;
            table.insertAdjacentElement('afterbegin', caption);
        });
    }
}

class PrivacyPolicySearch {
    constructor() {
        this.searchInput = null;
        this.searchResults = null;
        this.init();
    }

    init() {
        this.createSearchInterface();
        this.setupSearch();
    }

    createSearchInterface() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'privacy-search';
        searchContainer.innerHTML = `
            <div class="search-box">
                <input type="text" id="privacy-search-input" placeholder="プライバシーポリシー内を検索..." class="search-input">
                <button type="button" class="search-clear" title="クリア">×</button>
            </div>
            <div class="search-results" id="search-results" style="display: none;"></div>
        `;

        searchContainer.style.cssText = `
            margin: 1rem 0;
            padding: 1rem;
            background-color: var(--color-light-wood);
            border-radius: 8px;
        `;

        const privacyMain = document.querySelector('.privacy-main');
        const privacyMeta = document.querySelector('.privacy-meta');
        if (privacyMain && privacyMeta) {
            privacyMeta.insertAdjacentElement('afterend', searchContainer);
        }

        this.searchInput = document.getElementById('privacy-search-input');
        this.searchResults = document.getElementById('search-results');
        
        const clearButton = searchContainer.querySelector('.search-clear');
        clearButton.addEventListener('click', () => {
            this.clearSearch();
        });
    }

    setupSearch() {
        if (!this.searchInput) return;

        let searchTimeout;
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performSearch(e.target.value.trim());
            }, 300);
        });

        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.clearSearch();
            }
        });
    }

    performSearch(query) {
        if (query.length < 2) {
            this.hideResults();
            return;
        }

        const results = this.searchInContent(query);
        this.displayResults(results, query);
    }

    searchInContent(query) {
        const results = [];
        const sections = document.querySelectorAll('.privacy-section');
        
        sections.forEach(section => {
            const title = section.querySelector('.privacy-section__title');
            const content = section.querySelector('.privacy-section__content');
            
            if (title && content) {
                const titleText = title.textContent;
                const contentText = content.textContent;
                
                if (this.matchesQuery(titleText + ' ' + contentText, query)) {
                    const snippet = this.createSnippet(contentText, query);
                    results.push({
                        title: titleText,
                        snippet: snippet,
                        element: section,
                        id: section.getAttribute('id')
                    });
                }
            }
        });

        return results;
    }

    matchesQuery(text, query) {
        const words = query.toLowerCase().split(' ');
        const lowerText = text.toLowerCase();
        return words.every(word => lowerText.includes(word));
    }

    createSnippet(text, query, maxLength = 150) {
        const lowerText = text.toLowerCase();
        const lowerQuery = query.toLowerCase();
        const index = lowerText.indexOf(lowerQuery);
        
        if (index === -1) {
            return text.slice(0, maxLength) + (text.length > maxLength ? '...' : '');
        }

        const start = Math.max(0, index - 50);
        const end = Math.min(text.length, index + query.length + 50);
        
        let snippet = text.slice(start, end);
        if (start > 0) snippet = '...' + snippet;
        if (end < text.length) snippet = snippet + '...';
        
        // Highlight the query terms
        const words = query.split(' ');
        words.forEach(word => {
            const regex = new RegExp(`(${word})`, 'gi');
            snippet = snippet.replace(regex, '<mark>$1</mark>');
        });
        
        return snippet;
    }

    displayResults(results, query) {
        if (results.length === 0) {
            this.searchResults.innerHTML = `
                <div class="no-results">
                    <p>"${query}" に一致する内容が見つかりませんでした。</p>
                </div>
            `;
        } else {
            const resultsHtml = results.map(result => `
                <div class="search-result" data-target="${result.id}">
                    <h4 class="result-title">${result.title}</h4>
                    <p class="result-snippet">${result.snippet}</p>
                </div>
            `).join('');
            
            this.searchResults.innerHTML = resultsHtml;
            
            // Add click handlers
            this.searchResults.querySelectorAll('.search-result').forEach(result => {
                result.addEventListener('click', () => {
                    const targetId = result.dataset.target;
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        const privacyHandler = new PrivacyPageHandler();
                        privacyHandler.scrollToSection(targetElement);
                        this.hideResults();
                        this.searchInput.value = '';
                    }
                });
            });
        }
        
        this.showResults();
    }

    showResults() {
        this.searchResults.style.display = 'block';
    }

    hideResults() {
        this.searchResults.style.display = 'none';
    }

    clearSearch() {
        this.searchInput.value = '';
        this.hideResults();
        this.searchInput.focus();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const privacyHandler = new PrivacyPageHandler();
    const printableVersion = new PrintableVersion();
    const accessibilityEnhancer = new AccessibilityEnhancer();
    const privacySearch = new PrivacyPolicySearch();
    
    // Add custom styles for search functionality
    const searchStyles = document.createElement('style');
    searchStyles.textContent = `
        .search-input {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid var(--color-forest-green);
            border-radius: 6px;
            font-size: 1rem;
        }
        
        .search-box {
            position: relative;
        }
        
        .search-clear {
            position: absolute;
            right: 0.5rem;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            font-size: 1.25rem;
            cursor: pointer;
            color: var(--color-gray);
        }
        
        .search-results {
            margin-top: 1rem;
            background: white;
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .search-result {
            padding: 1rem;
            border-bottom: 1px solid #eee;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        .search-result:hover {
            background-color: var(--color-light-wood);
        }
        
        .search-result:last-child {
            border-bottom: none;
        }
        
        .result-title {
            font-size: 1rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: var(--color-forest-green);
        }
        
        .result-snippet {
            font-size: 0.875rem;
            line-height: 1.4;
            margin: 0;
        }
        
        .result-snippet mark {
            background-color: #ffff00;
            padding: 0.125rem 0.25rem;
            border-radius: 2px;
        }
        
        .no-results {
            padding: 2rem;
            text-align: center;
            color: var(--color-gray);
        }
    `;
    
    document.head.appendChild(searchStyles);
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PrivacyPageHandler,
        PrintableVersion,
        AccessibilityEnhancer,
        PrivacyPolicySearch
    };
}