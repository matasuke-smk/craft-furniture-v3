// Works Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initWorksPage();
});

// Works data (in a real application, this would come from an API)
const worksData = [
    {
        id: 1,
        title: "ウォールナット一枚板ダイニングテーブル",
        category: "dining",
        material: "walnut",
        usage: "residential",
        image: "../assets/images/works/work-dining-01.jpg",
        price: { min: 800000, max: 1200000 },
        period: "3ヶ月",
        specs: {
            width: 2400,
            depth: 950,
            height: 720,
            thickness: 50
        },
        description: "美しい木目が特徴的なウォールナット一枚板を使用したダイニングテーブル。",
        date: "2024-12-15",
        tags: ["一枚板", "ウォールナット", "ダイニング"],
        views: 1250
    },
    {
        id: 2,
        title: "オーク材L字デスク",
        category: "desk",
        material: "oak",
        usage: "residential",
        image: "../assets/images/works/work-desk-01.jpg",
        price: { min: 450000, max: 650000 },
        period: "2.5ヶ月",
        specs: {
            width: 1800,
            depth: 1200,
            height: 720,
            thickness: 40
        },
        description: "在宅ワークに最適なL字型デスク。収納も充実しています。",
        date: "2024-12-10",
        tags: ["オーク", "L字デスク", "在宅ワーク"],
        views: 980
    },
    {
        id: 3,
        title: "チェリー材カウンターテーブル",
        category: "counter",
        material: "cherry",
        usage: "restaurant",
        image: "../assets/images/works/work-counter-01.jpg",
        price: { min: 350000, max: 550000 },
        period: "2ヶ月",
        specs: {
            width: 3000,
            depth: 450,
            height: 1050,
            thickness: 30
        },
        description: "カフェ店舗様向けのカウンターテーブル。温かみのあるチェリー材を使用。",
        date: "2024-12-05",
        tags: ["チェリー", "カウンター", "店舗"],
        views: 756
    },
    {
        id: 4,
        title: "無垢材収納棚",
        category: "storage",
        material: "walnut",
        usage: "residential",
        image: "../assets/images/works/work-storage-01.jpg",
        price: { min: 280000, max: 420000 },
        period: "2ヶ月",
        specs: {
            width: 1800,
            depth: 400,
            height: 1800,
            thickness: 30
        },
        description: "リビングに溶け込む美しい収納棚。機能性とデザインを両立。",
        date: "2024-11-28",
        tags: ["収納", "ウォールナット", "リビング"],
        views: 634
    },
    {
        id: 5,
        title: "オーク材円形テーブル",
        category: "dining",
        material: "oak",
        usage: "residential",
        image: "../assets/images/works/work-dining-02.jpg",
        price: { min: 600000, max: 900000 },
        period: "3ヶ月",
        specs: {
            width: 1500,
            depth: 1500,
            height: 720,
            thickness: 40
        },
        description: "家族の団欒を囲む円形ダイニングテーブル。",
        date: "2024-11-20",
        tags: ["オーク", "円形", "ダイニング"],
        views: 892
    },
    {
        id: 6,
        title: "店舗用大型テーブル",
        category: "dining",
        material: "walnut",
        usage: "restaurant",
        image: "../assets/images/works/work-dining-03.jpg",
        price: { min: 1200000, max: 1800000 },
        period: "4ヶ月",
        specs: {
            width: 3500,
            depth: 1200,
            height: 720,
            thickness: 50
        },
        description: "レストラン様向けの大型ダイニングテーブル。存在感のある一枚板を使用。",
        date: "2024-11-15",
        tags: ["ウォールナット", "大型", "レストラン"],
        views: 1120
    },
    {
        id: 7,
        title: "メープル材デスク",
        category: "desk",
        material: "maple",
        usage: "office",
        image: "../assets/images/works/work-desk-02.jpg",
        price: { min: 320000, max: 480000 },
        period: "2ヶ月",
        specs: {
            width: 1600,
            depth: 800,
            height: 720,
            thickness: 30
        },
        description: "オフィス用のシンプルなデスク。メープル材の明るい色合いが空間を明るく演出。",
        date: "2024-11-08",
        tags: ["メープル", "オフィス", "シンプル"],
        views: 567
    },
    {
        id: 8,
        title: "ウォールナット材サイドテーブル",
        category: "others",
        material: "walnut",
        usage: "residential",
        image: "../assets/images/works/work-side-01.jpg",
        price: { min: 120000, max: 180000 },
        period: "1ヶ月",
        specs: {
            width: 600,
            depth: 400,
            height: 550,
            thickness: 30
        },
        description: "リビングのソファサイドに置けるコンパクトなテーブル。",
        date: "2024-10-30",
        tags: ["ウォールナット", "サイドテーブル", "コンパクト"],
        views: 423
    }
    // Add more works data as needed...
];

// Generate additional works data to reach 30 items
for (let i = 9; i <= 30; i++) {
    const materials = ['walnut', 'oak', 'cherry', 'maple'];
    const categories = ['dining', 'desk', 'storage', 'counter', 'others'];
    const usages = ['residential', 'restaurant', 'office'];
    
    const material = materials[Math.floor(Math.random() * materials.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const usage = usages[Math.floor(Math.random() * usages.length)];
    
    const basePrice = 200000 + (Math.floor(Math.random() * 8) * 100000);
    
    worksData.push({
        id: i,
        title: `${getMaterialName(material)}材${getCategoryName(category)} ${i}`,
        category: category,
        material: material,
        usage: usage,
        image: `../assets/images/works/work-${String(i).padStart(2, '0')}.jpg`,
        price: { min: basePrice, max: basePrice + 200000 },
        period: `${Math.floor(Math.random() * 3) + 2}ヶ月`,
        specs: {
            width: 1200 + Math.floor(Math.random() * 2000),
            depth: 600 + Math.floor(Math.random() * 800),
            height: 700 + Math.floor(Math.random() * 400),
            thickness: [30, 40, 50][Math.floor(Math.random() * 3)]
        },
        description: `${getMaterialName(material)}材を使用した高品質な${getCategoryName(category)}です。`,
        date: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        tags: [getMaterialName(material), getCategoryName(category), getUsageName(usage)],
        views: Math.floor(Math.random() * 1000) + 100
    });
}

function getMaterialName(material) {
    const names = {
        walnut: 'ウォールナット',
        oak: 'オーク',
        cherry: 'チェリー',
        maple: 'メープル'
    };
    return names[material] || material;
}

function getCategoryName(category) {
    const names = {
        dining: 'ダイニングテーブル',
        desk: 'デスク',
        storage: '収納家具',
        counter: 'カウンターテーブル',
        others: 'その他'
    };
    return names[category] || category;
}

function getUsageName(usage) {
    const names = {
        residential: '個人宅',
        restaurant: '飲食店',
        office: 'オフィス'
    };
    return names[usage] || usage;
}

// Global variables
let filteredWorks = [...worksData];
let displayedWorks = [];
let currentFilters = {};
let currentSort = 'newest';
let itemsPerPage = 12;
let currentPage = 1;

function initWorksPage() {
    initFilters();
    initSort();
    initLoadMore();
    loadURLFilters();
    applyFiltersAndSort();
    renderWorks();
    updateFilterCount();
    
    // Track page view
    if (typeof trackEvent === 'function') {
        trackEvent('Works', 'Page View', 'Works Index');
    }
}

function initFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const materialFilter = document.getElementById('material-filter');
    const priceFilter = document.getElementById('price-filter');
    const usageFilter = document.getElementById('usage-filter');
    const resetBtn = document.getElementById('filter-reset');

    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            currentFilters.category = this.value;
            applyFiltersAndSort();
            updateURL();
            trackEvent('Works', 'Filter', 'Category', this.value);
        });
    }

    if (materialFilter) {
        materialFilter.addEventListener('change', function() {
            currentFilters.material = this.value;
            applyFiltersAndSort();
            updateURL();
            trackEvent('Works', 'Filter', 'Material', this.value);
        });
    }

    if (priceFilter) {
        priceFilter.addEventListener('change', function() {
            currentFilters.price = this.value;
            applyFiltersAndSort();
            updateURL();
            trackEvent('Works', 'Filter', 'Price', this.value);
        });
    }

    if (usageFilter) {
        usageFilter.addEventListener('change', function() {
            currentFilters.usage = this.value;
            applyFiltersAndSort();
            updateURL();
            trackEvent('Works', 'Filter', 'Usage', this.value);
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
}

function initSort() {
    const sortFilter = document.getElementById('sort-filter');
    
    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            currentSort = this.value;
            applyFiltersAndSort();
            updateURL();
            trackEvent('Works', 'Sort', this.value);
        });
    }
}

function initLoadMore() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            currentPage++;
            renderWorks(true);
            trackEvent('Works', 'Load More', 'Page', currentPage);
        });
    }
}

function loadURLFilters() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // 'filter' パラメータがある場合は 'category' として扱う (ヘッダーのドロップダウン対応)
    currentFilters.category = urlParams.get('filter') || urlParams.get('category') || '';
    currentFilters.material = urlParams.get('material') || '';
    currentFilters.price = urlParams.get('price') || '';
    currentFilters.usage = urlParams.get('usage') || '';
    currentSort = urlParams.get('sort') || 'newest';
    
    // Set form values
    const categoryFilter = document.getElementById('category-filter');
    const materialFilter = document.getElementById('material-filter');
    const priceFilter = document.getElementById('price-filter');
    const usageFilter = document.getElementById('usage-filter');
    const sortFilter = document.getElementById('sort-filter');
    
    if (categoryFilter) categoryFilter.value = currentFilters.category;
    if (materialFilter) materialFilter.value = currentFilters.material;
    if (priceFilter) priceFilter.value = currentFilters.price;
    if (usageFilter) usageFilter.value = currentFilters.usage;
    if (sortFilter) sortFilter.value = currentSort;
}

function updateURL() {
    const params = new URLSearchParams();
    
    if (currentFilters.category) params.set('category', currentFilters.category);
    if (currentFilters.material) params.set('material', currentFilters.material);
    if (currentFilters.price) params.set('price', currentFilters.price);
    if (currentFilters.usage) params.set('usage', currentFilters.usage);
    if (currentSort !== 'newest') params.set('sort', currentSort);
    
    const newURL = params.toString() ? `?${params.toString()}` : window.location.pathname;
    window.history.replaceState({}, '', newURL);
}

function applyFiltersAndSort() {
    // Apply filters
    filteredWorks = worksData.filter(work => {
        if (currentFilters.category && work.category !== currentFilters.category) return false;
        if (currentFilters.material && work.material !== currentFilters.material) return false;
        if (currentFilters.usage && work.usage !== currentFilters.usage) return false;
        
        if (currentFilters.price) {
            const avgPrice = (work.price.min + work.price.max) / 2;
            switch (currentFilters.price) {
                case 'low':
                    if (avgPrice >= 500000) return false;
                    break;
                case 'medium':
                    if (avgPrice < 500000 || avgPrice >= 1000000) return false;
                    break;
                case 'high':
                    if (avgPrice < 1000000) return false;
                    break;
            }
        }
        
        return true;
    });
    
    // Apply sorting
    filteredWorks.sort((a, b) => {
        switch (currentSort) {
            case 'newest':
                return new Date(b.date) - new Date(a.date);
            case 'oldest':
                return new Date(a.date) - new Date(b.date);
            case 'price-high':
                return b.price.max - a.price.max;
            case 'price-low':
                return a.price.min - b.price.min;
            case 'popular':
                return b.views - a.views;
            default:
                return 0;
        }
    });
    
    // Reset pagination
    currentPage = 1;
    displayedWorks = [];
    
    updateFilterCount();
    updateActiveFilters();
}

function renderWorks(append = false) {
    const worksGrid = document.getElementById('works-grid');
    const worksLoading = document.getElementById('works-loading');
    const noResults = document.getElementById('no-results');
    const loadMore = document.getElementById('load-more');
    
    if (!worksGrid) return;
    
    // Show loading
    if (!append) {
        worksLoading.style.display = 'flex';
        worksGrid.innerHTML = '';
        noResults.style.display = 'none';
    }
    
    setTimeout(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const worksToShow = filteredWorks.slice(startIndex, endIndex);
        
        if (!append) {
            displayedWorks = worksToShow;
        } else {
            displayedWorks = [...displayedWorks, ...worksToShow];
        }
        
        // Hide loading
        worksLoading.style.display = 'none';
        
        if (displayedWorks.length === 0) {
            noResults.style.display = 'block';
            loadMore.style.display = 'none';
            return;
        }
        
        noResults.style.display = 'none';
        
        if (!append) {
            worksGrid.innerHTML = '';
        }
        
        worksToShow.forEach((work, index) => {
            const workElement = createWorkElement(work, startIndex + index);
            worksGrid.appendChild(workElement);
        });
        
        // Update load more button
        updateLoadMoreButton();
        
    }, append ? 200 : 500);
}

function createWorkElement(work, index) {
    const workItem = document.createElement('article');
    workItem.className = 'work-item';
    workItem.style.animationDelay = `${(index % itemsPerPage) * 0.1}s`;
    workItem.setAttribute('data-work-id', work.id);
    
    const priceRange = work.price.min === work.price.max 
        ? `¥${formatPrice(work.price.min)}`
        : `¥${formatPrice(work.price.min)} - ${formatPrice(work.price.max)}`;
    
    workItem.innerHTML = `
        <div class="work-item__image">
            <div class="image-placeholder image-placeholder--medium">
                <div class="image-placeholder__content">
                    <svg class="image-placeholder__icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                    <div class="image-placeholder__text">準備中</div>
                    <div class="image-placeholder__subtext">${work.title}</div>
                </div>
            </div>
            <div class="work-item__overlay">
                <div class="work-item__tags">
                    <span class="work-item__tag work-item__tag--category">${getCategoryName(work.category)}</span>
                    <span class="work-item__tag">${getMaterialName(work.material)}</span>
                </div>
            </div>
            <div class="work-item__usage">${getUsageName(work.usage)}</div>
        </div>
        <div class="work-item__content">
            <h3 class="work-item__title">${work.title}</h3>
            <div class="work-item__specs">
                <div class="work-item__spec">
                    <span class="work-item__spec-label">サイズ:</span>
                    <span>W${work.specs.width} × D${work.specs.depth} × H${work.specs.height}mm</span>
                </div>
                <div class="work-item__spec">
                    <span class="work-item__spec-label">板厚:</span>
                    <span>${work.specs.thickness}mm</span>
                </div>
            </div>
            <div class="work-item__meta">
                <span class="work-item__price">${priceRange}</span>
                <span class="work-item__period">制作期間 ${work.period}</span>
            </div>
        </div>
    `;
    
    // Add click handler
    workItem.addEventListener('click', function() {
        // Navigate to simulator page with work data
        const params = new URLSearchParams({
            category: work.category,
            material: work.material,
            width: work.specs.width,
            depth: work.specs.depth,
            height: work.specs.height,
            thickness: work.specs.thickness,
            ref: 'works'
        });
        window.location.href = `../simulator/?${params.toString()}`;
        
        // Track click
        if (typeof trackEvent === 'function') {
            trackEvent('Works', 'Work Click', work.title, work.id);
        }
    });
    
    // Add keyboard support
    workItem.setAttribute('tabindex', '0');
    workItem.setAttribute('role', 'button');
    workItem.setAttribute('aria-label', `${work.title}の詳細を見る`);
    
    workItem.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.click();
        }
    });
    
    return workItem;
}

function updateFilterCount() {
    const countElement = document.getElementById('works-count');
    if (countElement) {
        countElement.textContent = filteredWorks.length;
    }
}

function updateActiveFilters() {
    const activeFiltersContainer = document.getElementById('active-filters');
    const activeFiltersList = document.getElementById('active-filters-list');
    
    if (!activeFiltersContainer || !activeFiltersList) return;
    
    const hasActiveFilters = Object.values(currentFilters).some(value => value !== '');
    
    if (!hasActiveFilters) {
        activeFiltersContainer.style.display = 'none';
        return;
    }
    
    activeFiltersContainer.style.display = 'block';
    activeFiltersList.innerHTML = '';
    
    const filterLabels = {
        category: '家具の種類',
        material: '木材',
        price: '価格帯',
        usage: '用途'
    };
    
    const filterValues = {
        category: {
            dining: 'ダイニングテーブル',
            desk: 'デスク',
            storage: '収納家具',
            counter: 'カウンター',
            others: 'その他'
        },
        material: {
            walnut: 'ウォールナット',
            oak: 'オーク',
            cherry: 'チェリー',
            maple: 'メープル',
            others: 'その他'
        },
        price: {
            low: '〜50万円',
            medium: '50万円〜100万円',
            high: '100万円〜'
        },
        usage: {
            residential: '個人宅',
            restaurant: '飲食店',
            office: 'オフィス',
            others: 'その他'
        }
    };
    
    Object.entries(currentFilters).forEach(([key, value]) => {
        if (value) {
            const filterElement = document.createElement('div');
            filterElement.className = 'active-filter';
            
            const displayValue = filterValues[key][value] || value;
            
            filterElement.innerHTML = `
                <span>${filterLabels[key]}: ${displayValue}</span>
                <button type="button" class="active-filter__remove" data-filter="${key}" aria-label="${filterLabels[key]}フィルターを削除">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            `;
            
            activeFiltersList.appendChild(filterElement);
        }
    });
    
    // Add event listeners to remove buttons
    const removeButtons = activeFiltersList.querySelectorAll('.active-filter__remove');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterKey = this.dataset.filter;
            removeFilter(filterKey);
        });
    });
}

function removeFilter(filterKey) {
    currentFilters[filterKey] = '';
    
    // Update form
    const filterElement = document.getElementById(`${filterKey}-filter`);
    if (filterElement) {
        filterElement.value = '';
    }
    
    applyFiltersAndSort();
    updateURL();
    
    // Track filter removal
    if (typeof trackEvent === 'function') {
        trackEvent('Works', 'Remove Filter', filterKey);
    }
}

function resetFilters() {
    currentFilters = {
        category: '',
        material: '',
        price: '',
        usage: ''
    };
    
    currentSort = 'newest';
    
    // Reset form values
    document.getElementById('category-filter').value = '';
    document.getElementById('material-filter').value = '';
    document.getElementById('price-filter').value = '';
    document.getElementById('usage-filter').value = '';
    document.getElementById('sort-filter').value = 'newest';
    
    applyFiltersAndSort();
    updateURL();
    
    // Track reset
    if (typeof trackEvent === 'function') {
        trackEvent('Works', 'Reset Filters');
    }
}

function updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    const loadMore = document.getElementById('load-more');
    const displayedCount = document.getElementById('displayed-count');
    const totalCount = document.getElementById('total-count');
    
    if (displayedCount) {
        displayedCount.textContent = displayedWorks.length;
    }
    
    if (totalCount) {
        totalCount.textContent = filteredWorks.length;
    }
    
    const hasMore = displayedWorks.length < filteredWorks.length;
    
    if (loadMore) {
        loadMore.style.display = hasMore ? 'block' : 'none';
    }
    
    if (loadMoreBtn && hasMore) {
        const remaining = filteredWorks.length - displayedWorks.length;
        loadMoreBtn.textContent = `さらに${Math.min(itemsPerPage, remaining)}件表示`;
    }
}

// Lazy loading function removed - using static placeholders instead

// Global function for reset button in no-results section
window.resetFilters = resetFilters;

// Utility functions
function formatPrice(price) {
    return new Intl.NumberFormat('ja-JP').format(price);
}

function getCategoryName(category) {
    const names = {
        dining: 'ダイニングテーブル',
        desk: 'デスク',
        storage: '収納家具',
        counter: 'カウンターテーブル',
        others: 'その他'
    };
    return names[category] || category;
}

function getMaterialName(material) {
    const names = {
        walnut: 'ウォールナット',
        oak: 'オーク',
        cherry: 'チェリー',
        maple: 'メープル',
        other: 'その他'
    };
    return names[material] || material;
}

function getUsageName(usage) {
    const names = {
        residential: '個人宅',
        restaurant: '飲食店',
        office: 'オフィス',
        other: 'その他'
    };
    return names[usage] || usage;
}

// Export for external use
window.WorksPage = {
    resetFilters: resetFilters,
    applyFilters: function(filters) {
        Object.assign(currentFilters, filters);
        applyFiltersAndSort();
        renderWorks();
    }
};