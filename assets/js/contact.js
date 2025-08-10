// Contact Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initContactPage();
});

function initContactPage() {
    initQuoteNotice();
    initContactForm();
    initFormValidation();
    initConditionalFields();
    initDateInputs();
    
    // Track page view
    if (typeof trackEvent === 'function') {
        trackEvent('Contact', 'Page View', 'Contact Form');
    }
}

// Quote notice handling
function initQuoteNotice() {
    const urlParams = new URLSearchParams(window.location.search);
    const hasQuote = urlParams.get('quote');
    
    if (hasQuote && hasQuote === 'true') {
        const quoteNotice = document.getElementById('quote-notice');
        const quoteSummary = document.getElementById('quote-summary');
        
        // Get quote data from session storage
        const quoteData = sessionStorage.getItem('quoteData');
        
        if (quoteData && quoteNotice) {
            try {
                const data = JSON.parse(quoteData);
                
                // Show the notice
                quoteNotice.style.display = 'block';
                
                // Display quote summary
                if (quoteSummary) {
                    quoteSummary.innerHTML = `
                        <div style="background: var(--color-gray-light); padding: var(--space-4); border-radius: var(--radius-lg); margin-top: var(--space-4);">
                            <p><strong>概算見積もり結果:</strong></p>
                            <p>家具の種類: ${getFurnitureTypeName(data.furnitureType)}</p>
                            <p>サイズ: ${data.width} × ${data.depth} × ${data.height}mm</p>
                            <p>概算価格: ¥${formatPrice(data.estimatedPrice)}</p>
                        </div>
                    `;
                }
                
                // Pre-fill form fields
                prefillFormWithQuoteData(data);
                
                // Smooth scroll to form
                setTimeout(() => {
                    document.getElementById('contact-form').scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 1000);
                
                // Track quote conversion
                if (typeof trackEvent === 'function') {
                    trackEvent('Contact', 'Quote Conversion', 'From Simulator', data.estimatedPrice);
                }
                
            } catch (error) {
                console.error('Error parsing quote data:', error);
            }
        }
    }
}

function getFurnitureTypeName(type) {
    const names = {
        dining: 'ダイニングテーブル',
        desk: 'デスク',
        storage: '収納家具',
        counter: 'カウンターテーブル'
    };
    return names[type] || type;
}

function formatPrice(price) {
    return new Intl.NumberFormat('ja-JP').format(price);
}

function prefillFormWithQuoteData(data) {
    // Set inquiry type to estimate
    const inquiryType = document.getElementById('inquiry-type');
    if (inquiryType) {
        inquiryType.value = 'estimate';
        inquiryType.dispatchEvent(new Event('change'));
    }
    
    // Pre-fill message with quote details
    const messageField = document.getElementById('message');
    if (messageField && !messageField.value) {
        const message = `見積もりシミュレーターでの結果について、詳細なお見積もりをお願いいたします。

【シミュレーター結果】
・家具の種類: ${getFurnitureTypeName(data.furnitureType)}
・サイズ: ${data.width} × ${data.depth} × ${data.height}mm
・板厚: ${data.thickness}mm
・木材: ${getMaterialName(data.material)}
・仕上げ: ${getFinishName(data.finish)}
・概算価格: ¥${formatPrice(data.estimatedPrice)}

上記の条件で正式なお見積もりをいただけますでしょうか。
また、実際に拝見できる機会があればと思います。

よろしくお願いいたします。`;

        messageField.value = message;
    }
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

function getFinishName(finish) {
    const names = {
        oil: 'オイル仕上げ',
        urethane: 'ウレタン仕上げ'
    };
    return names[finish] || finish;
}

// Contact form handling
function initContactForm() {
    const form = document.getElementById('contact-form-element');
    const submitBtn = document.getElementById('form-submit');
    const resetBtn = document.getElementById('form-reset');
    
    if (!form) return;
    
    // Form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        if (validateForm(form)) {
            submitForm(form, submitBtn);
        }
        
        // Track form submission attempt
        if (typeof trackEvent === 'function') {
            trackEvent('Contact', 'Form Submit', 'Attempt');
        }
    });
    
    // Reset button
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            if (confirm('入力内容をクリアしてもよろしいですか？')) {
                resetForm(form);
                
                // Track form reset
                if (typeof trackEvent === 'function') {
                    trackEvent('Contact', 'Form Reset', 'Manual');
                }
            }
        });
    }
    
    // Auto-save functionality
    initAutoSave(form);
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    let firstInvalidField = null;
    
    // Remove existing error messages
    const existingErrors = form.querySelectorAll('.field-error');
    existingErrors.forEach(error => error.remove());
    
    requiredFields.forEach(field => {
        const value = field.type === 'checkbox' ? field.checked : field.value.trim();
        
        if (!value) {
            showFieldError(field, 'この項目は必須です。');
            isValid = false;
            
            if (!firstInvalidField) {
                firstInvalidField = field;
            }
        } else {
            // Additional validation
            if (field.type === 'email' && !isValidEmail(field.value)) {
                showFieldError(field, 'メールアドレスの形式が正しくありません。');
                isValid = false;
                
                if (!firstInvalidField) {
                    firstInvalidField = field;
                }
            }
            
            if (field.type === 'tel' && !isValidPhoneNumber(field.value)) {
                showFieldError(field, '電話番号の形式が正しくありません。');
                isValid = false;
                
                if (!firstInvalidField) {
                    firstInvalidField = field;
                }
            }
        }
    });
    
    // Focus on first invalid field
    if (firstInvalidField) {
        firstInvalidField.focus();
        firstInvalidField.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: var(--color-error);
        font-size: var(--text-sm);
        margin-top: var(--space-2);
        font-weight: var(--weight-medium);
    `;
    
    field.parentNode.appendChild(errorElement);
    
    // Remove error on field change
    const removeError = () => {
        field.classList.remove('error');
        if (errorElement.parentNode) {
            errorElement.parentNode.removeChild(errorElement);
        }
        field.removeEventListener('input', removeError);
        field.removeEventListener('change', removeError);
    };
    
    field.addEventListener('input', removeError);
    field.addEventListener('change', removeError);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhoneNumber(phone) {
    // Japanese phone number format (flexible)
    const phoneRegex = /^[\d\-\(\)\+\s]{10,}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function submitForm(form, submitBtn) {
    // Show loading state
    submitBtn.classList.add('btn--loading');
    submitBtn.disabled = true;
    
    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Handle multiple checkboxes (furniture types)
    const furnitureTypes = formData.getAll('furnitureType');
    if (furnitureTypes.length > 0) {
        data.furnitureType = furnitureTypes;
    }
    
    // Simulate form submission (in real implementation, this would be an actual API call)
    setTimeout(() => {
        // Remove loading state
        submitBtn.classList.remove('btn--loading');
        submitBtn.disabled = false;
        
        // Show success message
        showFormMessage('お問い合わせを受け付けました。営業日内にご返信いたします。', 'success');
        
        // Reset form
        resetForm(form);
        
        // Track successful submission
        if (typeof trackEvent === 'function') {
            trackEvent('Contact', 'Form Submit', 'Success', 1);
        }
        
        // Scroll to success message
        setTimeout(() => {
            const message = document.querySelector('.form-message');
            if (message) {
                message.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }, 100);
        
    }, 2000); // Simulate network delay
}

function showFormMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.form-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageElement = document.createElement('div');
    messageElement.className = `form-message form-message--${type}`;
    messageElement.textContent = message;
    
    // Insert before form
    const form = document.getElementById('contact-form-element');
    form.parentNode.insertBefore(messageElement, form);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.parentNode.removeChild(messageElement);
        }
    }, 10000);
}

function resetForm(form) {
    form.reset();
    
    // Remove any error states
    const errorFields = form.querySelectorAll('.error');
    errorFields.forEach(field => field.classList.remove('error'));
    
    // Remove error messages
    const errorMessages = form.querySelectorAll('.field-error');
    errorMessages.forEach(msg => msg.remove());
    
    // Reset conditional fields
    hideConditionalFields();
    
    // Clear auto-save data
    clearAutoSaveData();
}

// Form validation
function initFormValidation() {
    const form = document.getElementById('contact-form-element');
    if (!form) return;
    
    // Real-time validation
    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        field.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                return; // Don't show error on empty required fields until submission
            }
            
            if (this.type === 'email' && this.value && !isValidEmail(this.value)) {
                showFieldError(this, 'メールアドレスの形式が正しくありません。');
            } else if (this.type === 'tel' && this.value && !isValidPhoneNumber(this.value)) {
                showFieldError(this, '電話番号の形式が正しくありません。');
            }
        });
        
        // Track field interactions
        field.addEventListener('focus', function() {
            if (typeof trackEvent === 'function') {
                trackEvent('Contact', 'Field Focus', this.name || this.id);
            }
        });
    });
}

// Conditional fields
function initConditionalFields() {
    const inquiryType = document.getElementById('inquiry-type');
    
    if (inquiryType) {
        inquiryType.addEventListener('change', function() {
            updateConditionalFields(this.value);
        });
        
        // Initial state
        if (inquiryType.value) {
            updateConditionalFields(inquiryType.value);
        }
    }
}

function updateConditionalFields(inquiryType) {
    const furnitureDetails = document.querySelector('.furniture-details');
    const budgetRange = document.querySelector('.budget-range');
    const showroomDetails = document.querySelector('.showroom-details');
    
    // Hide all conditional fields first
    hideConditionalFields();
    
    // Show relevant fields based on inquiry type
    switch (inquiryType) {
        case 'estimate':
            if (furnitureDetails) furnitureDetails.style.display = 'block';
            if (budgetRange) budgetRange.style.display = 'block';
            break;
        
        case 'showroom':
            if (showroomDetails) showroomDetails.style.display = 'block';
            break;
        
        case 'product':
            if (furnitureDetails) furnitureDetails.style.display = 'block';
            break;
    }
}

function hideConditionalFields() {
    const conditionalFields = document.querySelectorAll('.furniture-details, .budget-range, .showroom-details');
    conditionalFields.forEach(field => {
        field.style.display = 'none';
    });
}

// Date input handling
function initDateInputs() {
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 1); // Tomorrow
    
    // Set minimum date to tomorrow
    const minDateString = minDate.toISOString().split('T')[0];
    
    dateInputs.forEach(input => {
        input.min = minDateString;
        
        // Track date selections
        input.addEventListener('change', function() {
            if (typeof trackEvent === 'function') {
                trackEvent('Contact', 'Date Selection', this.name);
            }
        });
    });
}

// Auto-save functionality
function initAutoSave(form) {
    const AUTOSAVE_KEY = 'contact_form_autosave';
    const AUTOSAVE_INTERVAL = 30000; // 30 seconds
    
    // Load saved data
    loadAutoSaveData(form);
    
    // Save data periodically
    setInterval(() => {
        saveFormData(form);
    }, AUTOSAVE_INTERVAL);
    
    // Save on form changes
    form.addEventListener('input', debounce(() => {
        saveFormData(form);
    }, 5000)); // Save 5 seconds after last input
    
    function saveFormData(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Handle multiple checkboxes
        const furnitureTypes = formData.getAll('furnitureType');
        if (furnitureTypes.length > 0) {
            data.furnitureType = furnitureTypes;
        }
        
        localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(data));
    }
    
    function loadAutoSaveData(form) {
        const savedData = localStorage.getItem(AUTOSAVE_KEY);
        if (!savedData) return;
        
        try {
            const data = JSON.parse(savedData);
            
            // Restore form values
            Object.entries(data).forEach(([key, value]) => {
                const field = form.querySelector(`[name="${key}"]`);
                
                if (field) {
                    if (field.type === 'checkbox' || field.type === 'radio') {
                        if (Array.isArray(value)) {
                            // Handle multiple checkboxes
                            const checkboxes = form.querySelectorAll(`[name="${key}"]`);
                            checkboxes.forEach(checkbox => {
                                checkbox.checked = value.includes(checkbox.value);
                            });
                        } else {
                            field.checked = field.value === value;
                        }
                    } else {
                        field.value = value;
                    }
                    
                    // Trigger change event to update conditional fields
                    field.dispatchEvent(new Event('change'));
                }
            });
            
        } catch (error) {
            console.error('Error loading auto-save data:', error);
        }
    }
}

function clearAutoSaveData() {
    localStorage.removeItem('contact_form_autosave');
}

// Utility function for debouncing
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

// Contact method card interactions
function initContactMethodCards() {
    const contactCards = document.querySelectorAll('.contact-card');
    
    contactCards.forEach(card => {
        card.addEventListener('click', function() {
            const cardTitle = this.querySelector('.contact-card__title').textContent;
            
            if (typeof trackEvent === 'function') {
                trackEvent('Contact', 'Contact Method', cardTitle);
            }
        });
    });
}

// FAQ card interactions
function initFAQCards() {
    const faqCards = document.querySelectorAll('.faq-card');
    
    faqCards.forEach(card => {
        card.addEventListener('click', function() {
            const cardTitle = this.querySelector('h3').textContent;
            
            if (typeof trackEvent === 'function') {
                trackEvent('Contact', 'FAQ Link', cardTitle);
            }
        });
    });
}

// Initialize additional interactions
document.addEventListener('DOMContentLoaded', function() {
    initContactMethodCards();
    initFAQCards();
});

// Phone number formatting
function initPhoneFormatting() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            // Remove all non-digit characters except + and -
            let value = this.value.replace(/[^\d\+\-]/g, '');
            
            // Basic Japanese phone number formatting
            if (value.startsWith('0') && value.length >= 10) {
                // Format as 000-0000-0000
                value = value.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
            }
            
            this.value = value;
        });
    });
}

// Initialize phone formatting
document.addEventListener('DOMContentLoaded', initPhoneFormatting);

// Accessibility improvements
function initAccessibility() {
    // Add keyboard navigation for custom checkboxes
    const checkboxItems = document.querySelectorAll('.checkbox-item');
    
    checkboxItems.forEach(item => {
        item.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                const checkbox = this.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change'));
                }
            }
        });
        
        // Make focusable
        item.setAttribute('tabindex', '0');
    });
    
    // Improve form field focus indicators
    const formFields = document.querySelectorAll('input, select, textarea');
    formFields.forEach(field => {
        field.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        field.addEventListener('blur', function() {
            this.parentNode.classList.remove('focused');
        });
    });
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', initAccessibility);

// Export functions for external use
window.ContactForm = {
    validateForm: validateForm,
    submitForm: submitForm,
    resetForm: resetForm,
    showMessage: showFormMessage
};