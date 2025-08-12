// Instagram Feed Integration

document.addEventListener('DOMContentLoaded', function() {
    initInstagramFeed();
});

function initInstagramFeed() {
    const instagramContainer = document.getElementById('instagram-feed');
    
    if (!instagramContainer) {
        return;
    }
    
    // Mock Instagram data (replace with actual API integration)
    const mockInstagramData = [
        {
            id: '1',
            media_url: 'assets/images/instagram/insta-01.jpg',
            permalink: 'https://www.instagram.com/p/example1/',
            caption: '新作のウォールナット一枚板テーブル完成！美しい木目が際立つ仕上がりになりました。 #クラフトファニチャー #ウォールナット #一枚板テーブル #オーダーメイド家具',
            timestamp: '2025-01-10T10:00:00+00:00',
            media_type: 'IMAGE'
        },
        {
            id: '2',
            media_url: 'assets/images/instagram/insta-02.jpg',
            permalink: 'https://www.instagram.com/p/example2/',
            caption: '職人の手作業による丁寧な仕上げ作業。この工程が美しい仕上がりを生み出します。 #職人 #手作業 #こだわり #家具製作',
            timestamp: '2025-01-09T15:30:00+00:00',
            media_type: 'IMAGE'
        },
        {
            id: '3',
            media_url: 'assets/images/instagram/insta-03.jpg',
            permalink: 'https://www.instagram.com/p/example3/',
            caption: 'オーク材の円形テーブル。お客様のご要望に合わせてサイズオーダーで製作いたします。 #オーク材 #円形テーブル #サイズオーダー',
            timestamp: '2025-01-08T12:15:00+00:00',
            media_type: 'IMAGE'
        },
        {
            id: '4',
            media_url: 'assets/images/instagram/insta-04.jpg',
            permalink: 'https://www.instagram.com/p/example4/',
            caption: '木材の選定から始まる家具づくり。厳選された素材のみを使用しています。 #木材選定 #素材へのこだわり #一枚板',
            timestamp: '2025-01-07T09:45:00+00:00',
            media_type: 'IMAGE'
        },
        {
            id: '5',
            media_url: 'assets/images/instagram/insta-05.jpg',
            permalink: 'https://www.instagram.com/p/example5/',
            caption: 'チェリー材のカウンターテーブル完成。店舗様にお届けです。 #チェリー材 #カウンターテーブル #店舗家具',
            timestamp: '2025-01-06T16:20:00+00:00',
            media_type: 'IMAGE'
        },
        {
            id: '6',
            media_url: 'assets/images/instagram/insta-06.jpg',
            permalink: 'https://www.instagram.com/p/example6/',
            caption: '工房の様子。職人が心を込めて一つひとつ丁寧に作り上げています。 #工房 #職人 #ものづくり',
            timestamp: '2025-01-05T11:10:00+00:00',
            media_type: 'IMAGE'
        },
        {
            id: '7',
            media_url: 'assets/images/instagram/insta-07.jpg',
            permalink: 'https://www.instagram.com/p/example7/',
            caption: '無垢材収納棚の製作中。お客様のスペースにぴったり合うサイズで。 #無垢材 #収納棚 #オーダーメイド',
            timestamp: '2025-01-04T14:30:00+00:00',
            media_type: 'IMAGE'
        },
        {
            id: '8',
            media_url: 'assets/images/instagram/insta-08.jpg',
            permalink: 'https://www.instagram.com/p/example8/',
            caption: 'L字デスクの組み立て作業。細部まで丁寧に仕上げます。 #Lデスク #組み立て #細部へのこだわり',
            timestamp: '2025-01-03T13:45:00+00:00',
            media_type: 'IMAGE'
        },
        {
            id: '9',
            media_url: 'assets/images/instagram/insta-09.jpg',
            permalink: 'https://www.instagram.com/p/example9/',
            caption: '美しい木目を活かした仕上げ。自然の美しさをそのままお届けします。 #木目 #自然の美しさ #仕上げ',
            timestamp: '2025-01-02T10:20:00+00:00',
            media_type: 'IMAGE'
        }
    ];
    
    // Render Instagram feed
    renderInstagramFeed(mockInstagramData);
    
    // In a real implementation, you would fetch from Instagram Basic Display API
    // fetchInstagramFeed();
}

function renderInstagramFeed(posts) {
    const container = document.getElementById('instagram-feed');
    
    if (!container || !posts || posts.length === 0) {
        renderInstagramError();
        return;
    }
    
    // Show loading state
    container.innerHTML = '<div class="instagram__loading">Loading Instagram posts...</div>';
    
    // Clear container and add posts immediately for mobile performance
    container.innerHTML = '';
    
    posts.slice(0, 9).forEach((post, index) => {
        const postElement = createInstagramPost(post, index);
        container.appendChild(postElement);
    });
    
    // Add animation delays only on non-mobile devices
    if (window.innerWidth > 768) {
        const items = container.querySelectorAll('.instagram__item');
        items.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
        });
    }
    
    // Initialize lazy loading for Instagram images
    initInstagramLazyLoading();
    
    // Track successful load
    if (typeof trackEvent === 'function') {
        trackEvent('Instagram', 'Feed Loaded', 'Success', posts.length);
    }
}

function createInstagramPost(post, index) {
    const item = document.createElement('div');
    item.className = 'instagram__item';
    item.setAttribute('role', 'link');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', `Instagram投稿 ${index + 1}: 準備中`);
    
    // Create placeholder element instead of image
    const placeholder = document.createElement('div');
    placeholder.className = 'image-placeholder image-placeholder--medium';
    placeholder.innerHTML = `
        <div class="image-placeholder__content">
            <svg class="image-placeholder__icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <div class="image-placeholder__text">準備中</div>
            <div class="image-placeholder__subtext">Instagram投稿</div>
        </div>
    `;
    
    item.appendChild(placeholder);
    
    // Add click handler to Instagram main page
    const handleClick = (event) => {
        if (event.type === 'click' || (event.type === 'keydown' && (event.key === 'Enter' || event.key === ' '))) {
            if (event.type === 'keydown') {
                event.preventDefault();
            }
            
            window.open('https://www.instagram.com/craft_furniture_jp/', '_blank', 'noopener,noreferrer');
            
            // Track click
            if (typeof trackEvent === 'function') {
                trackEvent('Instagram', 'Placeholder Click', 'Instagram Main', index + 1);
            }
        }
    };
    
    item.addEventListener('click', handleClick);
    item.addEventListener('keydown', handleClick);
    
    return item;
}

function renderInstagramError() {
    const container = document.getElementById('instagram-feed');
    
    if (!container) {
        return;
    }
    
    container.innerHTML = `
        <div class="instagram__error">
            <div class="instagram__error-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
            </div>
            <p class="instagram__error-message">
                Instagramの投稿を読み込めませんでした。<br>
                <a href="https://www.instagram.com/craft_furniture_jp/" target="_blank" rel="noopener">
                    直接Instagramをご覧ください
                </a>
            </p>
        </div>
    `;
    
    // Track error
    if (typeof trackEvent === 'function') {
        trackEvent('Instagram', 'Load Error', 'Failed to load posts');
    }
}

function initInstagramLazyLoading() {
    const images = document.querySelectorAll('.instagram__item img[data-src]');
    
    if ('IntersectionObserver' in window && images.length > 0) {
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
                        img.classList.add('loaded');
                    };
                    newImg.onerror = function() {
                        img.src = 'assets/images/placeholder-instagram.jpg';
                        img.classList.add('error');
                    };
                    newImg.src = img.dataset.src;
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        images.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength).trim() + '...';
}

// Real Instagram API integration (placeholder)
async function fetchInstagramFeed() {
    try {
        // In a real implementation, you would use Instagram Basic Display API
        // const accessToken = 'YOUR_ACCESS_TOKEN';
        // const response = await fetch(`https://graph.instagram.com/me/media?fields=id,media_url,permalink,caption,timestamp,media_type&access_token=${accessToken}`);
        
        // For now, simulate API call with timeout
        const response = await new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate API response
                resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        data: mockInstagramData
                    })
                });
            }, 1000);
        });
        
        if (!response.ok) {
            throw new Error('Instagram API request failed');
        }
        
        const data = await response.json();
        renderInstagramFeed(data.data);
        
    } catch (error) {
        console.error('Failed to fetch Instagram feed:', error);
        renderInstagramError();
        
        // Track error
        if (typeof trackEvent === 'function') {
            trackEvent('Instagram', 'API Error', error.message);
        }
    }
}

// Refresh Instagram feed (for future use)
function refreshInstagramFeed() {
    const container = document.getElementById('instagram-feed');
    
    if (container) {
        container.innerHTML = '<div class="instagram__loading">更新中...</div>';
        
        // Show loading state
        if (typeof CraftFurnitureUtils !== 'undefined') {
            CraftFurnitureUtils.showLoading(container);
        }
        
        // Fetch new data
        setTimeout(() => {
            fetchInstagramFeed();
            
            if (typeof CraftFurnitureUtils !== 'undefined') {
                CraftFurnitureUtils.hideLoading(container);
            }
        }, 1000);
    }
}

// Export for external use
window.InstagramFeed = {
    refresh: refreshInstagramFeed,
    render: renderInstagramFeed
};

// CSS for Instagram loading and error states
const instagramStyles = `
    .instagram__loading {
        grid-column: 1 / -1;
        text-align: center;
        padding: 60px 20px;
        color: var(--color-gray-dark);
        font-size: var(--text-lg);
    }
    
    .instagram__error {
        grid-column: 1 / -1;
        text-align: center;
        padding: 60px 20px;
        color: var(--color-gray-dark);
    }
    
    .instagram__error-icon {
        margin-bottom: 20px;
        color: var(--color-error);
    }
    
    .instagram__error-message {
        font-size: var(--text-base);
        line-height: 1.6;
        margin: 0;
    }
    
    .instagram__error-message a {
        color: var(--color-accent);
        text-decoration: underline;
    }
    
    .instagram__item .image-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--color-gray-light);
        border-radius: var(--radius-lg);
    }
    
    .instagram__item img.lazy {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .instagram__item img.loaded {
        opacity: 1;
    }
    
    .instagram__item img.error {
        opacity: 0.5;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .instagram__item {
        animation: fadeInUp 0.6s ease forwards;
        opacity: 0;
    }
`;

// Inject CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = instagramStyles;
document.head.appendChild(styleSheet);