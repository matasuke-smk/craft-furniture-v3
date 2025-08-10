// Wood Guide Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initWoodGuidePage();
});

// Wood data
const woodsData = [
    {
        id: 1,
        name: 'ウォールナット',
        latin: 'Black Walnut',
        image: '../assets/images/wood-guide/walnut.jpg',
        hardness: 'hard',
        color: 'dark',
        usage: ['table', 'desk'],
        properties: {
            hardness: '硬材',
            color: '濃い茶色',
            grain: '美しい流れ木目',
            aging: '深みが増す'
        },
        description: '北米産の高級木材。美しい木目と深い色合いが特徴で、時間とともに色が深くなり、より一層の風格を増します。強度も高く、ダイニングテーブルに最適です。',
        features: ['高級感', '耐久性', '美しい木目', '経年変化'],
        priceRange: '★★★★☆',
        maintenance: 'オイル仕上げ推奨',
        workability: '良好',
        availability: '通年'
    },
    {
        id: 2,
        name: 'オーク',
        latin: 'White Oak',
        image: '../assets/images/wood-guide/oak.jpg',
        hardness: 'hard',
        color: 'light',
        usage: ['table', 'storage'],
        properties: {
            hardness: '硬材',
            color: '明るい茶色',
            grain: 'はっきりした木目',
            aging: '黄金色に変化'
        },
        description: '古くから家具材として愛用されてきた代表的な木材。はっきりとした木目と高い強度を持ち、どんなインテリアにも調和します。',
        features: ['強度抜群', 'クラシック', '汎用性', '安定性'],
        priceRange: '★★★☆☆',
        maintenance: 'オイル・ウレタン両対応',
        workability: '良好',
        availability: '通年'
    },
    {
        id: 3,
        name: 'チェリー',
        latin: 'American Cherry',
        image: '../assets/images/wood-guide/cherry.jpg',
        hardness: 'medium',
        color: 'medium',
        usage: ['desk', 'storage'],
        properties: {
            hardness: '中硬材',
            color: '赤みのある茶色',
            grain: '上品な木目',
            aging: '赤みが深くなる'
        },
        description: '上品な赤みと滑らかな質感が魅力の木材。時間とともに赤みが増し、より深い色合いに変化します。加工性に優れ、美しい仕上がりを実現できます。',
        features: ['上品', '滑らか', '加工性', '経年美'],
        priceRange: '★★★★☆',
        maintenance: 'オイル仕上げ推奨',
        workability: '非常に良好',
        availability: '通年'
    },
    {
        id: 4,
        name: 'メープル',
        latin: 'Hard Maple',
        image: '../assets/images/wood-guide/maple.jpg',
        hardness: 'hard',
        color: 'light',
        usage: ['desk', 'storage'],
        properties: {
            hardness: '硬材',
            color: '白っぽい色',
            grain: '細かい木目',
            aging: 'クリーム色に変化'
        },
        description: '明るい色合いと緻密な木目が特徴。強度が高く、表面が美しく仕上がります。モダンなインテリアにも和風インテリアにもよく合います。',
        features: ['明るい色', '強度', '緻密', 'モダン'],
        priceRange: '★★★☆☆',
        maintenance: 'ウレタン仕上げ推奨',
        workability: '良好',
        availability: '通年'
    },
    {
        id: 5,
        name: 'タモ',
        latin: 'Japanese Ash',
        image: '../assets/images/wood-guide/ash.jpg',
        hardness: 'hard',
        color: 'light',
        usage: ['table', 'storage'],
        properties: {
            hardness: '硬材',
            color: '淡い黄褐色',
            grain: 'はっきりした木目',
            aging: '落ち着いた色に変化'
        },
        description: '日本でも馴染みのある木材で、はっきりとした木目と高い強度が特徴。野球バットにも使用される丈夫さを持ちながら、美しい仕上がりを実現できます。',
        features: ['国産材', '強度', '木目美', '実用性'],
        priceRange: '★★☆☆☆',
        maintenance: 'オイル・ウレタン両対応',
        workability: '良好',
        availability: '通年'
    },
    {
        id: 6,
        name: 'ヒノキ',
        latin: 'Japanese Cypress',
        image: '../assets/images/wood-guide/hinoki.jpg',
        hardness: 'soft',
        color: 'light',
        usage: ['storage'],
        properties: {
            hardness: '軟材',
            color: '淡い黄白色',
            grain: '均一な木目',
            aging: '飴色に変化'
        },
        description: '日本を代表する高級木材。特有の香りと美しい色合いが魅力で、防虫・抗菌効果も期待できます。収納家具に適しています。',
        features: ['芳香', '防虫効果', '高級感', '和風'],
        priceRange: '★★★★★',
        maintenance: 'オイル仕上げ推奨',
        workability: '非常に良好',
        availability: '限定的'
    }
];

// Global variables
let filteredWoods = [...woodsData];
let displayedWoods = [];
let currentFilters = {};
let itemsPerPage = 6;
let currentPage = 1;

function initWoodGuidePage() {
    initFilters();
    initScrollAnimations();
    applyFilters();
    renderWoods();
    
    // Track page view
    if (typeof trackEvent === 'function') {
        trackEvent('Wood Guide', 'Page View', 'Wood Guide Index');
    }
}

// Initialize filters
function initFilters() {
    const hardnessFilter = document.getElementById('hardness-filter');
    const colorFilter = document.getElementById('color-filter');
    const usageFilter = document.getElementById('usage-filter');
    const resetBtn = document.getElementById('filter-reset');

    if (hardnessFilter) {
        hardnessFilter.addEventListener('change', function() {
            currentFilters.hardness = this.value;
            applyFilters();
            if (typeof trackEvent === 'function') {
                trackEvent('Wood Guide', 'Filter', 'Hardness', this.value);
            }
        });
    }

    if (colorFilter) {
        colorFilter.addEventListener('change', function() {
            currentFilters.color = this.value;
            applyFilters();
            if (typeof trackEvent === 'function') {
                trackEvent('Wood Guide', 'Filter', 'Color', this.value);
            }
        });
    }

    if (usageFilter) {
        usageFilter.addEventListener('change', function() {
            currentFilters.usage = this.value;
            applyFilters();
            if (typeof trackEvent === 'function') {
                trackEvent('Wood Guide', 'Filter', 'Usage', this.value);
            }
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            resetFilters();
            if (typeof trackEvent === 'function') {
                trackEvent('Wood Guide', 'Filter Reset');
            }
        });
    }
}

function resetFilters() {
    currentFilters = {};
    
    // Reset form values
    document.getElementById('hardness-filter').value = '';
    document.getElementById('color-filter').value = '';
    document.getElementById('usage-filter').value = '';
    
    applyFilters();
}

function applyFilters() {
    filteredWoods = woodsData.filter(wood => {
        if (currentFilters.hardness && wood.hardness !== currentFilters.hardness) return false;
        if (currentFilters.color && wood.color !== currentFilters.color) return false;
        if (currentFilters.usage && !wood.usage.includes(currentFilters.usage)) return false;
        
        return true;
    });
    
    // Reset pagination
    currentPage = 1;
    displayedWoods = [];
    
    renderWoods();
}

function renderWoods() {
    const woodsGrid = document.getElementById('woods-grid');
    const loadMoreBtn = document.getElementById('load-more');
    
    if (!woodsGrid) return;
    
    // Calculate woods to show
    const startIndex = 0;
    const endIndex = currentPage * itemsPerPage;
    const woodsToShow = filteredWoods.slice(startIndex, endIndex);
    
    // Clear grid if first page
    if (currentPage === 1) {
        woodsGrid.innerHTML = '';
        displayedWoods = [];
    }
    
    // Add new woods
    const newWoods = filteredWoods.slice(displayedWoods.length, endIndex);
    displayedWoods = [...displayedWoods, ...newWoods];
    
    newWoods.forEach((wood, index) => {
        const woodElement = createWoodElement(wood, displayedWoods.length - newWoods.length + index);
        woodsGrid.appendChild(woodElement);
    });
    
    // Update load more button
    updateLoadMoreButton();
    
    // 遅延読み込みは無効化 - プレースホルダーのみ表示
    
    // Animate new items
    setTimeout(() => {
        const newItems = woodsGrid.querySelectorAll('.wood-item:not(.in-view)');
        newItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('in-view');
            }, index * 100);
        });
    }, 100);
}

function createWoodElement(wood, index) {
    const woodItem = document.createElement('article');
    woodItem.className = 'wood-item';
    woodItem.setAttribute('data-wood-id', wood.id);
    woodItem.style.animationDelay = `${(index % itemsPerPage) * 0.1}s`;
    
    const hardnessLabel = getHardnessLabel(wood.hardness);
    const colorLabel = getColorLabel(wood.color);
    const usageLabels = wood.usage.map(u => getUsageLabel(u)).join('・');
    
    woodItem.innerHTML = `
        <div class="wood-item__image">
            <div class="image-placeholder image-placeholder--medium">
                <div class="image-placeholder__content">
                    <svg class="image-placeholder__icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                    <div class="image-placeholder__text">準備中</div>
                    <div class="image-placeholder__subtext">${wood.name}</div>
                </div>
            </div>
            <div class="wood-item__badges">
                <span class="wood-item__badge">${hardnessLabel}</span>
                <span class="wood-item__badge">${colorLabel}</span>
            </div>
        </div>
        <div class="wood-item__content">
            <div class="wood-item__header">
                <h3 class="wood-item__name">${wood.name}</h3>
                <div class="wood-item__latin">${wood.latin}</div>
            </div>
            
            <div class="wood-item__properties">
                <div class="wood-property">
                    <div class="wood-property__label">硬さ</div>
                    <div class="wood-property__value">${wood.properties.hardness}</div>
                </div>
                <div class="wood-property">
                    <div class="wood-property__label">色合い</div>
                    <div class="wood-property__value">${wood.properties.color}</div>
                </div>
                <div class="wood-property">
                    <div class="wood-property__label">木目</div>
                    <div class="wood-property__value">${wood.properties.grain}</div>
                </div>
                <div class="wood-property">
                    <div class="wood-property__label">経年変化</div>
                    <div class="wood-property__value">${wood.properties.aging}</div>
                </div>
            </div>
            
            <div class="wood-item__description">
                ${wood.description}
            </div>
            
            <div class="wood-item__features">
                ${wood.features.map(feature => `<span class="wood-feature">${feature}</span>`).join('')}
            </div>
            
            <div class="wood-item__actions">
                <a href="../works/?material=${wood.name.toLowerCase()}" class="wood-item__button wood-item__button--primary">
                    施工事例を見る
                </a>
                <button class="wood-item__button wood-item__button--secondary" onclick="showWoodDetails(${wood.id})">
                    詳細を見る
                </button>
            </div>
        </div>
    `;
    
    // Add click tracking
    woodItem.addEventListener('click', function(event) {
        if (!event.target.matches('button') && !event.target.matches('a')) {
            if (typeof trackEvent === 'function') {
                trackEvent('Wood Guide', 'Wood Click', wood.name);
            }
        }
    });
    
    return woodItem;
}

function getHardnessLabel(hardness) {
    const labels = {
        soft: '軟材',
        medium: '中硬材',
        hard: '硬材'
    };
    return labels[hardness] || hardness;
}

function getColorLabel(color) {
    const labels = {
        light: '明るい色',
        medium: '中間色',
        dark: '濃い色'
    };
    return labels[color] || color;
}

function getUsageLabel(usage) {
    const labels = {
        table: 'テーブル',
        desk: 'デスク',
        storage: '収納'
    };
    return labels[usage] || usage;
}

function updateLoadMoreButton() {
    const loadMore = document.getElementById('load-more');
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    const hasMore = displayedWoods.length < filteredWoods.length;
    
    if (loadMore) {
        loadMore.style.display = hasMore ? 'block' : 'none';
    }
    
    if (loadMoreBtn && hasMore) {
        const remaining = filteredWoods.length - displayedWoods.length;
        loadMoreBtn.textContent = `さらに${Math.min(itemsPerPage, remaining)}件表示`;
        
        loadMoreBtn.addEventListener('click', function() {
            currentPage++;
            renderWoods();
            
            if (typeof trackEvent === 'function') {
                trackEvent('Wood Guide', 'Load More', 'Page', currentPage);
            }
        });
    }
}

// Wood details modal
function showWoodDetails(woodId) {
    const wood = woodsData.find(w => w.id === woodId);
    if (!wood) return;
    
    const modal = document.createElement('div');
    modal.className = 'wood-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close" aria-label="モーダルを閉じる">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                
                <div class="modal-header">
                    <h2 class="modal-title">${wood.name}</h2>
                    <div class="modal-latin">${wood.latin}</div>
                </div>
                
                <div class="modal-body">
                    <div class="modal-image">
                        <div class="image-placeholder image-placeholder--large">
                            <div class="image-placeholder__content">
                                <svg class="image-placeholder__icon" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                                </svg>
                                <div class="image-placeholder__text">準備中</div>
                                <div class="image-placeholder__subtext">${wood.name} 詳細画像</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-info">
                        <div class="modal-description">
                            <p>${wood.description}</p>
                        </div>
                        
                        <div class="modal-details">
                            <div class="detail-group">
                                <h4>基本特性</h4>
                                <div class="detail-grid">
                                    <div class="detail-item">
                                        <span class="detail-label">硬さ:</span>
                                        <span class="detail-value">${wood.properties.hardness}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-label">色合い:</span>
                                        <span class="detail-value">${wood.properties.color}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-label">木目:</span>
                                        <span class="detail-value">${wood.properties.grain}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-label">経年変化:</span>
                                        <span class="detail-value">${wood.properties.aging}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="detail-group">
                                <h4>加工・メンテナンス</h4>
                                <div class="detail-grid">
                                    <div class="detail-item">
                                        <span class="detail-label">価格帯:</span>
                                        <span class="detail-value">${wood.priceRange}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-label">推奨仕上げ:</span>
                                        <span class="detail-value">${wood.maintenance}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-label">加工性:</span>
                                        <span class="detail-value">${wood.workability}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-label">入手性:</span>
                                        <span class="detail-value">${wood.availability}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="modal-actions">
                            <a href="../works/?material=${wood.name.toLowerCase()}" class="btn btn--primary">
                                施工事例を見る
                            </a>
                            <a href="../contact/" class="btn btn--outline">
                                この木材で相談する
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    `;
    
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.cssText = `
        background: var(--color-white);
        border-radius: var(--radius-xl);
        max-width: 800px;
        max-height: 90vh;
        width: 90%;
        overflow-y: auto;
        padding: var(--space-8);
        transform: scale(0.9) translateY(20px);
        transition: all 0.3s ease;
        position: relative;
    `;
    
    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.style.visibility = 'visible';
        modalContent.style.transform = 'scale(1) translateY(0)';
    }, 10);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    
    function closeModal() {
        modal.style.opacity = '0';
        modal.style.visibility = 'hidden';
        modalContent.style.transform = 'scale(0.9) translateY(20px)';
        
        setTimeout(() => {
            if (modal.parentNode) {
                document.body.removeChild(modal);
            }
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            closeModal();
        }
    });
    
    // Escape key to close
    const escapeHandler = (event) => {
        if (event.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
    
    // Track modal view
    if (typeof trackEvent === 'function') {
        trackEvent('Wood Guide', 'Wood Details View', wood.name);
    }
}

// Make function globally available
window.showWoodDetails = showWoodDetails;

// Scroll animations
function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) {
        // Fallback for browsers without IntersectionObserver
        const elements = document.querySelectorAll('.care-step');
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
                    const sectionName = entry.target.className.includes('care-step') 
                        ? 'Care Step' 
                        : 'Section';
                    trackEvent('Wood Guide', 'Section View', sectionName);
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe care steps
    const careSteps = document.querySelectorAll('.care-step');
    careSteps.forEach(step => {
        observer.observe(step);
    });
}

// Lazy loading for wood images
function initLazyLoading() {
    const images = document.querySelectorAll('.wood-item img[data-src]');
    
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
                        img.classList.add('loaded');
                    };
                    newImg.onerror = function() {
                        img.src = '../assets/images/placeholder-wood.jpg';
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

// Export functions for external use
window.WoodGuide = {
    showWoodDetails: showWoodDetails,
    resetFilters: resetFilters,
    applyFilters: function(filters) {
        Object.assign(currentFilters, filters);
        applyFilters();
    }
};