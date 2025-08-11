// Voice Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initVoicePage();
});

// Voice data
const voicesData = [
    {
        id: 1,
        name: '田中様',
        customerType: 'residential',
        furnitureType: 'dining',
        rating: 5,
        title: '家族の笑顔が増えました',
        comment: 'オーダーメイドのダイニングテーブルを作っていただきました。木目の美しさと職人さんの技術に感動しています。家族全員がお気に入りで、食事の時間が楽しくなりました。一生モノの家具を手に入れることができて本当に良かったです。',
        furniture: 'ウォールナット一枚板テーブル',
        tags: ['品質満足', '家族団らん', 'アフターサービス良好'],
        date: '2024-01-15',
        location: '東京都世田谷区',
        age: '40代',
        verified: true
    },
    {
        id: 2,
        name: 'カフェ・ボナペティ様',
        customerType: 'restaurant',
        furnitureType: 'counter',
        rating: 5,
        title: 'お客様からの評判が抜群です',
        comment: '店舗のカウンターテーブルをお願いしました。チェリー材の温かみのある色合いがお店の雰囲気にぴったりで、お客様からも「素敵なテーブルですね」とよく言われます。耐久性も高く、毎日の使用にも問題ありません。',
        furniture: 'チェリー材カウンターテーブル',
        tags: ['デザイン性', '耐久性', '店舗向け'],
        date: '2024-01-10',
        location: '東京都渋谷区',
        age: '法人',
        verified: true
    },
    {
        id: 3,
        name: '山田様',
        customerType: 'residential',
        furnitureType: 'desk',
        rating: 5,
        title: 'テレワークが快適になりました',
        comment: '在宅ワーク用のデスクを製作していただきました。オーク材の美しい木目と、使いやすいサイズ設計で、毎日の仕事が楽しくなりました。収納も充実していて、書類やPC周りもすっきり整理できます。',
        furniture: 'オーク材L字デスク',
        tags: ['機能性', 'テレワーク', '収納'],
        date: '2023-12-20',
        location: '東京都杉並区',
        age: '30代',
        verified: true
    },
    {
        id: 4,
        name: '鈴木様',
        customerType: 'residential',
        furnitureType: 'storage',
        rating: 5,
        title: '職人さんの技術に感激',
        comment: 'リビング用の収納棚をオーダーしました。細かい要望にも丁寧に対応していただき、まさに理想通りの仕上がりです。継手の美しさや扉の精密な調整など、職人さんの技術の高さを感じます。長く愛用していきたいです。',
        furniture: 'ウォールナット材収納棚',
        tags: ['技術力', 'カスタマイズ', '満足度高'],
        date: '2023-12-15',
        location: '東京都練馬区',
        age: '50代',
        verified: true
    },
    {
        id: 5,
        name: '佐藤様',
        customerType: 'residential',
        furnitureType: 'dining',
        rating: 4,
        title: '期待以上の仕上がりです',
        comment: '円形のダイニングテーブルを注文しました。家族みんなで囲むのにちょうど良いサイズで、オーク材の温かみのある色合いが気に入っています。納期も予定通りで、丁寧な納品作業でした。',
        furniture: 'オーク材円形テーブル',
        tags: ['サイズ感', '納期通り', '丁寧な対応'],
        date: '2023-11-30',
        location: '東京都目黒区',
        age: '40代',
        verified: true
    },
    {
        id: 6,
        name: '高橋様',
        customerType: 'office',
        furnitureType: 'desk',
        rating: 5,
        title: 'オフィスの雰囲気が変わりました',
        comment: '会社の役員室用デスクをお願いしました。メープル材の上品な仕上がりで、来客の方からも「立派なデスクですね」とお褒めの言葉をいただきます。機能性とデザイン性を兼ね備えた素晴らしい作品です。',
        furniture: 'メープル材エグゼクティブデスク',
        tags: ['上品', '来客対応', '機能性'],
        date: '2023-11-25',
        location: '東京都港区',
        age: '法人',
        verified: true
    },
    {
        id: 7,
        name: '伊藤様',
        customerType: 'residential',
        furnitureType: 'dining',
        rating: 5,
        title: 'アフターサービスも安心',
        comment: '大型のダイニングテーブルを製作していただきました。納品から1年経ちますが、メンテナンスのご連絡もいただき、アフターサービスの充実ぶりに感謝しています。末永くお付き合いできそうです。',
        furniture: 'ウォールナット大型テーブル',
        tags: ['アフターサービス', '大型家具', '長期サポート'],
        date: '2023-11-10',
        location: '東京都中野区',
        age: '40代',
        verified: true
    },
    {
        id: 8,
        name: '中村様',
        customerType: 'residential',
        furnitureType: 'others',
        rating: 5,
        title: 'コンパクトながら存在感抜群',
        comment: 'リビングのサイドテーブルをお願いしました。小さな家具ですが、ウォールナット材の美しい木目で部屋全体の印象がガラッと変わりました。職人さんの丁寧な仕事ぶりが感じられます。',
        furniture: 'ウォールナット材サイドテーブル',
        tags: ['コンパクト', '存在感', '部屋の印象'],
        date: '2023-10-20',
        location: '東京都品川区',
        age: '30代',
        verified: true
    }
];

// Global variables
let filteredVoices = [...voicesData];
let displayedVoices = [];
let currentFilters = {};
let itemsPerPage = 6;
let currentPage = 1;

function initVoicePage() {
    initCountAnimation();
    initFilters();
    initFAQ();
    applyFilters();
    renderVoices();
    
    // Track page view
    if (typeof trackEvent === 'function') {
        trackEvent('Voice', 'Page View', 'Customer Voice');
    }
}

// Count animation for stats
function initCountAnimation() {
    const statNumbers = document.querySelectorAll('.stat-item__number');
    
    if (!('IntersectionObserver' in window)) {
        // Fallback for browsers without IntersectionObserver
        statNumbers.forEach(number => {
            const target = parseInt(number.dataset.target);
            number.textContent = target;
        });
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(number => {
        observer.observe(number);
    });
}

function animateCount(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000; // 2 seconds
    const stepTime = Math.abs(Math.floor(duration / target));
    const startTime = Date.now();
    const endTime = startTime + duration;
    
    function step() {
        const now = Date.now();
        const remaining = Math.max((endTime - now) / duration, 0);
        const current = Math.round(target - (remaining * target));
        
        element.textContent = current;
        
        if (current < target) {
            setTimeout(step, stepTime);
        }
    }
    
    step();
}

// Initialize filters
function initFilters() {
    const furnitureTypeFilter = document.getElementById('furniture-type-filter');
    const customerTypeFilter = document.getElementById('customer-type-filter');
    const ratingFilter = document.getElementById('rating-filter');
    const resetBtn = document.getElementById('filter-reset');

    if (furnitureTypeFilter) {
        furnitureTypeFilter.addEventListener('change', function() {
            currentFilters.furnitureType = this.value;
            applyFilters();
            if (typeof trackEvent === 'function') {
                trackEvent('Voice', 'Filter', 'Furniture Type', this.value);
            }
        });
    }

    if (customerTypeFilter) {
        customerTypeFilter.addEventListener('change', function() {
            currentFilters.customerType = this.value;
            applyFilters();
            if (typeof trackEvent === 'function') {
                trackEvent('Voice', 'Filter', 'Customer Type', this.value);
            }
        });
    }

    if (ratingFilter) {
        ratingFilter.addEventListener('change', function() {
            currentFilters.rating = this.value;
            applyFilters();
            if (typeof trackEvent === 'function') {
                trackEvent('Voice', 'Filter', 'Rating', this.value);
            }
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            resetFilters();
            if (typeof trackEvent === 'function') {
                trackEvent('Voice', 'Filter Reset');
            }
        });
    }
}

function resetFilters() {
    currentFilters = {};
    
    // Reset form values
    document.getElementById('furniture-type-filter').value = '';
    document.getElementById('customer-type-filter').value = '';
    document.getElementById('rating-filter').value = '';
    
    applyFilters();
}

function applyFilters() {
    filteredVoices = voicesData.filter(voice => {
        if (currentFilters.furnitureType && voice.furnitureType !== currentFilters.furnitureType) return false;
        if (currentFilters.customerType && voice.customerType !== currentFilters.customerType) return false;
        if (currentFilters.rating) {
            const minRating = parseInt(currentFilters.rating);
            if (voice.rating < minRating) return false;
        }
        
        return true;
    });
    
    // Reset pagination
    currentPage = 1;
    displayedVoices = [];
    
    renderVoices();
    updateVoiceCount();
}

function updateVoiceCount() {
    const countElement = document.getElementById('voice-count');
    if (countElement) {
        countElement.textContent = filteredVoices.length;
    }
}

function renderVoices() {
    const voicesGrid = document.getElementById('voices-grid');
    const loadMoreBtn = document.getElementById('load-more');
    
    if (!voicesGrid) return;
    
    // Calculate voices to show
    const startIndex = 0;
    const endIndex = currentPage * itemsPerPage;
    const voicesToShow = filteredVoices.slice(startIndex, endIndex);
    
    // Clear grid if first page
    if (currentPage === 1) {
        voicesGrid.innerHTML = '';
        displayedVoices = [];
    }
    
    // Add new voices
    const newVoices = filteredVoices.slice(displayedVoices.length, endIndex);
    displayedVoices = [...displayedVoices, ...newVoices];
    
    newVoices.forEach((voice, index) => {
        const voiceElement = createVoiceElement(voice, displayedVoices.length - newVoices.length + index);
        voicesGrid.appendChild(voiceElement);
    });
    
    // Update load more button
    updateLoadMoreButton();
    
    // Animate new items
    setTimeout(() => {
        const newItems = voicesGrid.querySelectorAll('.voice-item:not(.animated)');
        newItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animated');
            }, index * 100);
        });
    }, 100);
}

function createVoiceElement(voice, index) {
    const voiceItem = document.createElement('article');
    voiceItem.className = 'voice-item';
    voiceItem.setAttribute('data-voice-id', voice.id);
    voiceItem.style.animationDelay = `${(index % itemsPerPage) * 0.1}s`;
    
    const customerTypeLabel = getCustomerTypeLabel(voice.customerType);
    const furnitureTypeLabel = getFurnitureTypeLabel(voice.furnitureType);
    const ratingStars = generateRatingStars(voice.rating);
    const nameInitial = voice.name.charAt(0);
    
    voiceItem.innerHTML = `
        <div class="voice-item__header">
            <div class="voice-item__avatar">${nameInitial}</div>
            <div class="voice-item__customer">
                <div class="voice-item__name">${voice.name}</div>
                <div class="voice-item__meta">
                    <span>${voice.location}</span>
                    <span>${voice.age}</span>
                    <span>${customerTypeLabel}</span>
                    ${voice.verified ? '<span>✓ 認証済み</span>' : ''}
                </div>
                <div class="voice-item__rating">
                    ${ratingStars}
                </div>
            </div>
        </div>
        
        <div class="voice-item__furniture">${furnitureTypeLabel}</div>
        
        <div class="voice-item__content">
            <h3 class="voice-item__title">${voice.title}</h3>
            <div class="voice-item__comment">${voice.comment}</div>
            
            <div class="voice-item__tags">
                ${voice.tags.map(tag => `<span class="voice-tag">${tag}</span>`).join('')}
            </div>
        </div>
        
        <div class="voice-item__footer">
            <div class="voice-item__date">${formatDate(voice.date)}</div>
            <div class="voice-item__actions">
                <button class="voice-action-btn" onclick="shareVoice(${voice.id})">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 12V20C4 20.5523 4.44772 21 5 21H19C19.5523 21 20 20.5523 20 20V12"/>
                        <polyline points="16,6 12,2 8,6"/>
                        <line x1="12" y1="2" x2="12" y2="15"/>
                    </svg>
                    シェア
                </button>
                <button class="voice-action-btn" onclick="showVoiceDetail(${voice.id})">詳細を見る</button>
            </div>
        </div>
    `;
    
    // Add click tracking
    voiceItem.addEventListener('click', function(event) {
        if (!event.target.matches('button')) {
            if (typeof trackEvent === 'function') {
                trackEvent('Voice', 'Voice Click', voice.name);
            }
        }
    });
    
    return voiceItem;
}

function getCustomerTypeLabel(type) {
    const labels = {
        residential: '個人・ご家庭',
        restaurant: '飲食店',
        office: 'オフィス・法人'
    };
    return labels[type] || type;
}

function getFurnitureTypeLabel(type) {
    const labels = {
        dining: 'ダイニングテーブル',
        desk: 'デスク',
        storage: '収納家具',
        counter: 'カウンターテーブル',
        others: 'その他'
    };
    return labels[type] || type;
}

function generateRatingStars(rating) {
    const maxRating = 5;
    let starsHtml = '';
    
    for (let i = 1; i <= maxRating; i++) {
        if (i <= rating) {
            starsHtml += '<span class="rating-star">★</span>';
        } else {
            starsHtml += '<span class="rating-star rating-star--empty">☆</span>';
        }
    }
    
    return starsHtml;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}年${month}月${day}日`;
}

function updateLoadMoreButton() {
    const loadMore = document.getElementById('load-more');
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    const hasMore = displayedVoices.length < filteredVoices.length;
    
    if (loadMore) {
        loadMore.style.display = hasMore ? 'block' : 'none';
    }
    
    if (loadMoreBtn && hasMore) {
        const remaining = filteredVoices.length - displayedVoices.length;
        loadMoreBtn.textContent = `さらに${Math.min(itemsPerPage, remaining)}件表示`;
        
        loadMoreBtn.addEventListener('click', function() {
            currentPage++;
            renderVoices();
            
            if (typeof trackEvent === 'function') {
                trackEvent('Voice', 'Load More', 'Page', currentPage);
            }
        });
    }
}

// Voice detail modal
function showVoiceDetail(voiceId) {
    const voice = voicesData.find(v => v.id === voiceId);
    if (!voice) return;
    
    // This would open a modal with detailed voice information
    // For now, we'll just track the event
    if (typeof trackEvent === 'function') {
        trackEvent('Voice', 'Voice Detail View', voice.name);
    }
    
    // Simple alert for demonstration
    alert(`${voice.name}様の詳細:\n\n${voice.comment}\n\n製品: ${voice.furniture}`);
}

// Share voice functionality
function shareVoice(voiceId) {
    const voice = voicesData.find(v => v.id === voiceId);
    if (!voice) return;
    
    if (navigator.share) {
        navigator.share({
            title: `お客様の声 - ${voice.name}様`,
            text: voice.title,
            url: window.location.href
        }).then(() => {
            if (typeof trackEvent === 'function') {
                trackEvent('Voice', 'Share', 'Native Share', voiceId);
            }
        }).catch(err => {
            console.log('Error sharing:', err);
        });
    } else {
        // Fallback for browsers without native share
        copyToClipboard(window.location.href);
        showMessage('URLをクリップボードにコピーしました');
        
        if (typeof trackEvent === 'function') {
            trackEvent('Voice', 'Share', 'Copy URL', voiceId);
        }
    }
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
}

function showMessage(message) {
    const messageEl = document.createElement('div');
    messageEl.textContent = message;
    messageEl.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--color-primary);
        color: var(--color-white);
        padding: var(--space-4) var(--space-6);
        border-radius: var(--radius-lg);
        z-index: 1000;
        font-weight: var(--weight-medium);
    `;
    
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
        if (messageEl.parentNode) {
            document.body.removeChild(messageEl);
        }
    }, 3000);
}

// Make functions globally available
window.showVoiceDetail = showVoiceDetail;
window.shareVoice = shareVoice;

// FAQ functionality
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-item__question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Close all other FAQ items
            faqQuestions.forEach(q => {
                if (q !== this) {
                    q.setAttribute('aria-expanded', 'false');
                }
            });
            
            // Toggle current item
            this.setAttribute('aria-expanded', !isExpanded);
            
            // Track FAQ interaction
            if (typeof trackEvent === 'function') {
                const questionText = this.querySelector('span').textContent;
                trackEvent('Voice', 'FAQ', isExpanded ? 'Close' : 'Open', questionText);
            }
        });
        
        // Keyboard support
        question.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.click();
            }
        });
    });
}

// Export functions for external use
window.VoicePage = {
    showVoiceDetail: showVoiceDetail,
    shareVoice: shareVoice,
    resetFilters: resetFilters,
    applyFilters: function(filters) {
        Object.assign(currentFilters, filters);
        applyFilters();
    }
};