// Price Simulator JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initSimulator();
});

// Pricing configuration
const PRICING_CONFIG = {
    // Base prices by furniture type
    basePrices: {
        dining: 400000,
        desk: 250000,
        storage: 180000,
        counter: 300000
    },
    
    // Size coefficients
    sizeCoefficients: {
        dining: {
            width: { min: 1000, max: 4000, factor: 0.08 },
            depth: { min: 600, max: 1500, factor: 0.12 },
            height: { min: 680, max: 800, factor: 0.05 }
        },
        desk: {
            width: { min: 800, max: 3000, factor: 0.10 },
            depth: { min: 500, max: 1200, factor: 0.15 },
            height: { min: 680, max: 800, factor: 0.05 }
        },
        storage: {
            width: { min: 600, max: 2400, factor: 0.12 },
            depth: { min: 300, max: 600, factor: 0.18 },
            height: { min: 800, max: 2400, factor: 0.08 }
        },
        counter: {
            width: { min: 1200, max: 4000, factor: 0.06 },
            depth: { min: 400, max: 800, factor: 0.20 },
            height: { min: 900, max: 1100, factor: 0.03 }
        }
    },
    
    // Thickness coefficients
    thicknessCoefficients: {
        30: 1.0,   // Standard
        40: 1.15,  // +15%
        50: 1.30   // +30%
    },
    
    // Material multipliers
    materialMultipliers: {
        maple: 1.0,    // Standard
        cherry: 1.15,  // +15%
        oak: 1.20,     // +20%
        walnut: 1.30   // +30%
    },
    
    // Finish options
    finishOptions: {
        oil: 0,
        urethane: 20000
    },
    
    // Optional features
    optionPrices: {
        edge: 30000,
        drawer: 50000,
        adjustment: 40000,
        delivery: 15000
    }
};

// Current configuration
let currentConfig = {
    furnitureType: '',
    width: 1800,
    depth: 900,
    height: 720,
    thickness: '',
    material: '',
    finish: '',
    options: []
};

function initSimulator() {
    initFormElements();
    initSizeControls();
    initCalculations();
    initActions();
    
    // Track simulator start
    if (typeof trackEvent === 'function') {
        trackEvent('Simulator', 'Start', 'Page Load');
    }
}

function initFormElements() {
    // Furniture type selection
    const furnitureRadios = document.querySelectorAll('input[name="furnitureType"]');
    furnitureRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            currentConfig.furnitureType = this.value;
            updateSizeLimits();
            updateCalculations();
            updateVisual();
            
            // Track furniture type selection
            if (typeof trackEvent === 'function') {
                trackEvent('Simulator', 'Furniture Type', this.value);
            }
        });
    });
    
    // Thickness selection
    const thicknessRadios = document.querySelectorAll('input[name="thickness"]');
    thicknessRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            currentConfig.thickness = this.value;
            updateCalculations();
            
            // Track thickness selection
            if (typeof trackEvent === 'function') {
                trackEvent('Simulator', 'Thickness', this.value);
            }
        });
    });
    
    // Material selection
    const materialRadios = document.querySelectorAll('input[name="material"]');
    materialRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            currentConfig.material = this.value;
            updateCalculations();
            
            // Track material selection
            if (typeof trackEvent === 'function') {
                trackEvent('Simulator', 'Material', this.value);
            }
        });
    });
    
    // Finish selection
    const finishSelect = document.getElementById('finish');
    if (finishSelect) {
        finishSelect.addEventListener('change', function() {
            currentConfig.finish = this.value;
            updateCalculations();
            
            // Track finish selection
            if (typeof trackEvent === 'function') {
                trackEvent('Simulator', 'Finish', this.value);
            }
        });
    }
    
    // Options selection
    const optionCheckboxes = document.querySelectorAll('input[name="options"]');
    optionCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                if (!currentConfig.options.includes(this.value)) {
                    currentConfig.options.push(this.value);
                }
            } else {
                currentConfig.options = currentConfig.options.filter(opt => opt !== this.value);
            }
            updateCalculations();
            
            // Track options selection
            if (typeof trackEvent === 'function') {
                trackEvent('Simulator', 'Option', this.value, this.checked ? 1 : 0);
            }
        });
    });
}

function initSizeControls() {
    const sizeInputs = ['width', 'depth', 'height'];
    
    sizeInputs.forEach(dimension => {
        const input = document.getElementById(dimension);
        const range = document.querySelector(`input[data-target="${dimension}"]`);
        
        if (input && range) {
            // Sync input and range
            input.addEventListener('input', function() {
                const value = Math.max(this.min, Math.min(this.max, this.value));
                this.value = value;
                range.value = value;
                currentConfig[dimension] = parseInt(value);
                updateCalculations();
                updateVisual();
                updateDimensions();
            });
            
            range.addEventListener('input', function() {
                input.value = this.value;
                currentConfig[dimension] = parseInt(this.value);
                updateCalculations();
                updateVisual();
                updateDimensions();
            });
        }
    });
}

function updateSizeLimits() {
    if (!currentConfig.furnitureType) return;
    
    const limits = PRICING_CONFIG.sizeCoefficients[currentConfig.furnitureType];
    if (!limits) return;
    
    // Update width limits
    const widthInput = document.getElementById('width');
    const widthRange = document.querySelector('input[data-target="width"]');
    if (widthInput && widthRange && limits.width) {
        widthInput.min = widthRange.min = limits.width.min;
        widthInput.max = widthRange.max = limits.width.max;
        
        // Adjust current value if needed
        if (currentConfig.width < limits.width.min) {
            currentConfig.width = limits.width.min;
            widthInput.value = widthRange.value = limits.width.min;
        } else if (currentConfig.width > limits.width.max) {
            currentConfig.width = limits.width.max;
            widthInput.value = widthRange.value = limits.width.max;
        }
    }
    
    // Update depth limits
    const depthInput = document.getElementById('depth');
    const depthRange = document.querySelector('input[data-target="depth"]');
    if (depthInput && depthRange && limits.depth) {
        depthInput.min = depthRange.min = limits.depth.min;
        depthInput.max = depthRange.max = limits.depth.max;
        
        // Adjust current value if needed
        if (currentConfig.depth < limits.depth.min) {
            currentConfig.depth = limits.depth.min;
            depthInput.value = depthRange.value = limits.depth.min;
        } else if (currentConfig.depth > limits.depth.max) {
            currentConfig.depth = limits.depth.max;
            depthInput.value = depthRange.value = limits.depth.max;
        }
    }
    
    // Update height limits
    const heightInput = document.getElementById('height');
    const heightRange = document.querySelector('input[data-target="height"]');
    if (heightInput && heightRange && limits.height) {
        heightInput.min = heightRange.min = limits.height.min;
        heightInput.max = heightRange.max = limits.height.max;
        
        // Adjust current value if needed
        if (currentConfig.height < limits.height.min) {
            currentConfig.height = limits.height.min;
            heightInput.value = heightRange.value = limits.height.min;
        } else if (currentConfig.height > limits.height.max) {
            currentConfig.height = limits.height.max;
            heightInput.value = heightRange.value = limits.height.max;
        }
    }
}

function updateVisual() {
    const furnitureVisual = document.getElementById('furniture-visual');
    if (!furnitureVisual) return;
    
    // Calculate relative dimensions for visual representation
    const maxWidth = 200;
    const maxHeight = 120;
    
    const widthRatio = currentConfig.width / 3000; // Normalize to max typical width
    const heightRatio = (currentConfig.height - 400) / 800; // Normalize height range
    
    const visualWidth = Math.max(60, Math.min(maxWidth, maxWidth * widthRatio));
    const visualHeight = Math.max(40, Math.min(maxHeight, maxHeight * heightRatio));
    
    furnitureVisual.style.width = `${visualWidth}px`;
    furnitureVisual.style.height = `${visualHeight}px`;
    
    // Update visual based on furniture type
    if (currentConfig.furnitureType) {
        furnitureVisual.className = `size-visual__furniture size-visual__furniture--${currentConfig.furnitureType}`;
    }
}

function updateDimensions() {
    const widthDimension = document.getElementById('width-dimension');
    const depthDimension = document.getElementById('depth-dimension');
    const heightDimension = document.getElementById('height-dimension');
    
    if (widthDimension) widthDimension.textContent = `${currentConfig.width}mm`;
    if (depthDimension) depthDimension.textContent = `${currentConfig.depth}mm`;
    if (heightDimension) heightDimension.textContent = `${currentConfig.height}mm`;
}

function initCalculations() {
    updateCalculations();
}

function updateCalculations() {
    const calculation = calculatePrice();
    updateResultDisplay(calculation);
    updateActionButtons();
}

function calculatePrice() {
    if (!currentConfig.furnitureType) {
        return {
            basePrice: 0,
            sizeMultiplier: 1,
            thicknessMultiplier: 1,
            materialMultiplier: 1,
            finishPrice: 0,
            optionsPrice: 0,
            totalPrice: 0,
            breakdown: []
        };
    }
    
    // Base price
    const basePrice = PRICING_CONFIG.basePrices[currentConfig.furnitureType];
    const breakdown = [{ label: 'ベース価格', value: basePrice }];
    
    // Size multiplier calculation
    const sizeCoeff = PRICING_CONFIG.sizeCoefficients[currentConfig.furnitureType];
    let sizeMultiplier = 1;
    
    if (sizeCoeff) {
        const widthFactor = sizeCoeff.width ? 
            1 + (currentConfig.width - sizeCoeff.width.min) / 1000 * sizeCoeff.width.factor : 1;
        const depthFactor = sizeCoeff.depth ? 
            1 + (currentConfig.depth - sizeCoeff.depth.min) / 1000 * sizeCoeff.depth.factor : 1;
        const heightFactor = sizeCoeff.height ? 
            1 + (currentConfig.height - sizeCoeff.height.min) / 1000 * sizeCoeff.height.factor : 1;
        
        sizeMultiplier = widthFactor * depthFactor * heightFactor;
    }
    
    const sizeAdjustment = basePrice * (sizeMultiplier - 1);
    if (sizeAdjustment > 0) {
        breakdown.push({ label: 'サイズ調整', value: sizeAdjustment });
    }
    
    // Thickness multiplier
    const thicknessMultiplier = currentConfig.thickness ? 
        PRICING_CONFIG.thicknessCoefficients[currentConfig.thickness] : 1;
    
    const thicknessAdjustment = basePrice * sizeMultiplier * (thicknessMultiplier - 1);
    if (thicknessAdjustment > 0) {
        breakdown.push({ 
            label: `板厚 ${currentConfig.thickness}mm`, 
            value: thicknessAdjustment 
        });
    }
    
    // Material multiplier
    const materialMultiplier = currentConfig.material ? 
        PRICING_CONFIG.materialMultipliers[currentConfig.material] : 1;
    
    const materialAdjustment = basePrice * sizeMultiplier * thicknessMultiplier * (materialMultiplier - 1);
    if (materialAdjustment > 0) {
        const materialNames = {
            walnut: 'ウォールナット',
            oak: 'オーク',
            cherry: 'チェリー',
            maple: 'メープル'
        };
        breakdown.push({ 
            label: materialNames[currentConfig.material], 
            value: materialAdjustment 
        });
    }
    
    // Finish price
    const finishPrice = currentConfig.finish ? 
        PRICING_CONFIG.finishOptions[currentConfig.finish] : 0;
    
    if (finishPrice > 0) {
        const finishNames = {
            oil: 'オイル仕上げ',
            urethane: 'ウレタン仕上げ'
        };
        breakdown.push({ 
            label: finishNames[currentConfig.finish], 
            value: finishPrice 
        });
    }
    
    // Options price
    let optionsPrice = 0;
    const optionNames = {
        edge: 'エッジ加工',
        drawer: '引き出し追加',
        adjustment: '高さ調整脚',
        delivery: '2階搬入・設置'
    };
    
    currentConfig.options.forEach(option => {
        const price = PRICING_CONFIG.optionPrices[option];
        if (price) {
            optionsPrice += price;
            breakdown.push({ 
                label: optionNames[option], 
                value: price 
            });
        }
    });
    
    // Total calculation
    const subtotal = basePrice * sizeMultiplier * thicknessMultiplier * materialMultiplier;
    const totalPrice = subtotal + finishPrice + optionsPrice;
    
    return {
        basePrice,
        sizeMultiplier,
        thicknessMultiplier,
        materialMultiplier,
        finishPrice,
        optionsPrice,
        totalPrice: Math.round(totalPrice),
        breakdown
    };
}

function updateResultDisplay(calculation) {
    // Update summary
    updateSummary();
    
    // Update price breakdown
    updatePriceBreakdown(calculation.breakdown);
    
    // Update total price
    const totalPriceElement = document.getElementById('total-price');
    if (totalPriceElement) {
        totalPriceElement.textContent = `¥${formatPrice(calculation.totalPrice)}`;
    }
}

function updateSummary() {
    const furnitureNames = {
        dining: 'ダイニングテーブル',
        desk: 'デスク',
        storage: '収納家具',
        counter: 'カウンターテーブル'
    };
    
    const materialNames = {
        walnut: 'ウォールナット',
        oak: 'オーク',
        cherry: 'チェリー',
        maple: 'メープル'
    };
    
    const finishNames = {
        oil: 'オイル仕上げ',
        urethane: 'ウレタン仕上げ'
    };
    
    // Update furniture type
    const furnitureElement = document.getElementById('selected-furniture');
    if (furnitureElement) {
        furnitureElement.textContent = currentConfig.furnitureType ? 
            furnitureNames[currentConfig.furnitureType] : '未選択';
    }
    
    // Update size
    const sizeElement = document.getElementById('selected-size');
    if (sizeElement) {
        sizeElement.textContent = `${currentConfig.width}×${currentConfig.depth}×${currentConfig.height}mm`;
    }
    
    // Update thickness
    const thicknessElement = document.getElementById('selected-thickness');
    if (thicknessElement) {
        thicknessElement.textContent = currentConfig.thickness ? 
            `${currentConfig.thickness}mm` : '未選択';
    }
    
    // Update material
    const materialElement = document.getElementById('selected-material');
    if (materialElement) {
        materialElement.textContent = currentConfig.material ? 
            materialNames[currentConfig.material] : '未選択';
    }
    
    // Update finish
    const finishElement = document.getElementById('selected-finish');
    if (finishElement) {
        finishElement.textContent = currentConfig.finish ? 
            finishNames[currentConfig.finish] : '未選択';
    }
}

function updatePriceBreakdown(breakdown) {
    const breakdownContainer = document.getElementById('price-breakdown');
    if (!breakdownContainer) return;
    
    if (breakdown.length === 0) {
        breakdownContainer.innerHTML = '<p style="text-align: center; color: var(--color-gray-dark);">項目を選択してください</p>';
        return;
    }
    
    let html = '<h3 style="margin-bottom: var(--space-4); font-size: var(--text-base); font-weight: var(--weight-semibold); color: var(--color-text);">価格内訳</h3>';
    
    breakdown.forEach(item => {
        html += `
            <div class="breakdown-item">
                <span class="breakdown-item__label">${item.label}</span>
                <span class="breakdown-item__value">¥${formatPrice(Math.round(item.value))}</span>
            </div>
        `;
    });
    
    breakdownContainer.innerHTML = html;
}

function updateActionButtons() {
    const requestQuoteBtn = document.getElementById('request-quote');
    
    // Enable/disable request quote button based on form completion
    const isFormComplete = currentConfig.furnitureType && 
                           currentConfig.thickness && 
                           currentConfig.material && 
                           currentConfig.finish;
    
    if (requestQuoteBtn) {
        requestQuoteBtn.disabled = !isFormComplete;
    }
}

function initActions() {
    // Request quote button
    const requestQuoteBtn = document.getElementById('request-quote');
    if (requestQuoteBtn) {
        requestQuoteBtn.addEventListener('click', function() {
            if (this.disabled) return;
            
            // Prepare quote data
            const quoteData = {
                ...currentConfig,
                estimatedPrice: calculatePrice().totalPrice,
                timestamp: new Date().toISOString()
            };
            
            // Store quote data
            sessionStorage.setItem('quoteData', JSON.stringify(quoteData));
            
            // Redirect to contact page with quote parameter
            window.location.href = '../contact/?quote=true';
            
            // Track quote request
            if (typeof trackEvent === 'function') {
                trackEvent('Simulator', 'Request Quote', 'Contact Form', quoteData.estimatedPrice);
            }
        });
    }
    
    // Save estimate button
    const saveEstimateBtn = document.getElementById('save-estimate');
    if (saveEstimateBtn) {
        saveEstimateBtn.addEventListener('click', function() {
            saveEstimate();
            
            // Track save estimate
            if (typeof trackEvent === 'function') {
                trackEvent('Simulator', 'Save Estimate', 'PDF Download');
            }
        });
    }
}

function saveEstimate() {
    const calculation = calculatePrice();
    
    if (calculation.totalPrice === 0) {
        alert('見積もり項目を選択してから保存してください。');
        return;
    }
    
    // Create PDF content (simplified version)
    const estimateData = {
        furniture: currentConfig.furnitureType,
        size: `${currentConfig.width}×${currentConfig.depth}×${currentConfig.height}mm`,
        thickness: `${currentConfig.thickness}mm`,
        material: currentConfig.material,
        finish: currentConfig.finish,
        options: currentConfig.options,
        breakdown: calculation.breakdown,
        totalPrice: calculation.totalPrice,
        date: new Date().toLocaleDateString('ja-JP')
    };
    
    // For now, show a success message and copy to clipboard
    const estimateText = generateEstimateText(estimateData);
    
    // Try to copy to clipboard
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(estimateText).then(() => {
            showNotification('見積もり内容をクリップボードにコピーしました。', 'success');
        }).catch(() => {
            showNotification('見積もりが保存されました。', 'success');
        });
    } else {
        showNotification('見積もりが保存されました。', 'success');
    }
    
    // In a real implementation, you might generate a PDF or save to local storage
    localStorage.setItem('lastEstimate', JSON.stringify(estimateData));
}

function generateEstimateText(data) {
    const furnitureNames = {
        dining: 'ダイニングテーブル',
        desk: 'デスク',
        storage: '収納家具',
        counter: 'カウンターテーブル'
    };
    
    const materialNames = {
        walnut: 'ウォールナット',
        oak: 'オーク',
        cherry: 'チェリー',
        maple: 'メープル'
    };
    
    const finishNames = {
        oil: 'オイル仕上げ',
        urethane: 'ウレタン仕上げ'
    };
    
    let text = `クラフトファニチャー 概算見積もり\n`;
    text += `作成日: ${data.date}\n\n`;
    text += `【商品詳細】\n`;
    text += `家具の種類: ${furnitureNames[data.furniture] || data.furniture}\n`;
    text += `サイズ: ${data.size}\n`;
    text += `板厚: ${data.thickness}\n`;
    text += `木材: ${materialNames[data.material] || data.material}\n`;
    text += `仕上げ: ${finishNames[data.finish] || data.finish}\n`;
    
    if (data.options.length > 0) {
        text += `オプション: ${data.options.join(', ')}\n`;
    }
    
    text += `\n【価格内訳】\n`;
    data.breakdown.forEach(item => {
        text += `${item.label}: ¥${formatPrice(Math.round(item.value))}\n`;
    });
    
    text += `\n【概算価格】¥${formatPrice(data.totalPrice)}\n\n`;
    text += `※こちらは概算価格です。最終的な価格は詳細な打ち合わせ後に決定いたします。\n`;
    text += `制作期間：約2〜4ヶ月\n\n`;
    text += `株式会社クラフトファニチャー\n`;
    text += `TEL: 03-1234-5678\n`;
    text += `https://craft-furniture.jp/`;
    
    return text;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification__content">
            <span class="notification__message">${message}</span>
            <button class="notification__close" aria-label="閉じる">×</button>
        </div>
    `;
    
    // Add styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const styles = `
            .notification {
                position: fixed;
                top: calc(var(--header-height) + 20px);
                right: 20px;
                background: var(--color-white);
                border: 1px solid var(--color-gray-light);
                border-radius: var(--radius-lg);
                box-shadow: var(--shadow-xl);
                padding: var(--space-4);
                max-width: 400px;
                z-index: var(--z-toast);
                animation: slideInRight 0.3s ease;
            }
            
            .notification--success {
                border-left: 4px solid var(--color-success);
            }
            
            .notification--error {
                border-left: 4px solid var(--color-error);
            }
            
            .notification__content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: var(--space-3);
            }
            
            .notification__message {
                color: var(--color-text);
                font-size: var(--text-sm);
                line-height: var(--leading-normal);
            }
            
            .notification__close {
                background: none;
                border: none;
                color: var(--color-gray-dark);
                font-size: var(--text-lg);
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all var(--transition-fast) var(--ease-out);
            }
            
            .notification__close:hover {
                background: var(--color-gray-light);
                color: var(--color-text);
            }
            
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes slideOutRight {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100%);
                }
            }
            
            @media (max-width: 480px) {
                .notification {
                    top: calc(var(--header-height-mobile) + 20px);
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'notification-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification__close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
}

function formatPrice(price) {
    return new Intl.NumberFormat('ja-JP').format(price);
}

// Initialize dimensions display
document.addEventListener('DOMContentLoaded', function() {
    updateDimensions();
    updateVisual();
});

// Export for external use
window.Simulator = {
    calculatePrice: calculatePrice,
    updateConfig: function(config) {
        Object.assign(currentConfig, config);
        updateCalculations();
    },
    getCurrentConfig: () => ({ ...currentConfig }),
    formatPrice: formatPrice
};