/**
 * Showroom Reservation System
 * Craft Furniture Website
 */

class ShowroomCalendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.unavailableDates = [
            // Example unavailable dates (Sundays and holidays)
            '2024-01-07', '2024-01-14', '2024-01-21', '2024-01-28',
            '2024-02-04', '2024-02-11', '2024-02-18', '2024-02-25'
        ];
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderCalendar();
        this.initForm();
    }

    bindEvents() {
        const prevBtn = document.getElementById('prev-month');
        const nextBtn = document.getElementById('next-month');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousMonth());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextMonth());
        }
    }

    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.renderCalendar();
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.renderCalendar();
    }

    renderCalendar() {
        const calendarTitle = document.getElementById('calendar-title');
        const calendarGrid = document.getElementById('calendar-grid');

        if (!calendarTitle || !calendarGrid) return;

        // Update title
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const monthNames = [
            '1月', '2月', '3月', '4月', '5月', '6月',
            '7月', '8月', '9月', '10月', '11月', '12月'
        ];
        calendarTitle.textContent = `${year}年${monthNames[month]}`;

        // Clear existing calendar days (keep headers)
        const dayHeaders = calendarGrid.querySelectorAll('.calendar-day-header');
        calendarGrid.innerHTML = '';
        dayHeaders.forEach(header => calendarGrid.appendChild(header));

        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        const today = new Date();

        // Add days from previous month
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            const dayElement = this.createDayElement(day, true, false);
            calendarGrid.appendChild(dayElement);
        }

        // Add days of current month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateString = this.formatDate(date);
            const isPast = date < today.setHours(0, 0, 0, 0);
            const isUnavailable = this.unavailableDates.includes(dateString) || date.getDay() === 0; // Sundays
            const isAvailable = !isPast && !isUnavailable;

            const dayElement = this.createDayElement(day, false, isAvailable, dateString);
            
            if (isPast) {
                dayElement.classList.add('calendar-day--past');
            } else if (isUnavailable) {
                dayElement.classList.add('calendar-day--unavailable');
            }

            calendarGrid.appendChild(dayElement);
        }

        // Add days from next month to complete the grid
        const totalCells = calendarGrid.children.length - 7; // Exclude headers
        const remainingCells = 42 - totalCells; // 6 rows × 7 days = 42
        for (let day = 1; day <= remainingCells; day++) {
            const dayElement = this.createDayElement(day, true, false);
            calendarGrid.appendChild(dayElement);
        }
    }

    createDayElement(day, isOtherMonth, isAvailable, dateString = null) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day');
        dayElement.textContent = day;

        if (isOtherMonth) {
            dayElement.classList.add('calendar-day--other-month');
        } else if (isAvailable && dateString) {
            dayElement.addEventListener('click', () => this.selectDate(dateString, dayElement));
        }

        return dayElement;
    }

    selectDate(dateString, element) {
        // Remove previous selection
        const prevSelected = document.querySelector('.calendar-day--selected');
        if (prevSelected) {
            prevSelected.classList.remove('calendar-day--selected');
        }

        // Add selection to clicked date
        element.classList.add('calendar-day--selected');
        this.selectedDate = dateString;

        // Update form input
        const selectedDateInput = document.getElementById('selected-date');
        if (selectedDateInput) {
            const date = new Date(dateString);
            const formattedDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
            selectedDateInput.value = formattedDate;
        }

        // Enable time slot selection
        const timeSlotSelect = document.getElementById('time-slot');
        if (timeSlotSelect) {
            timeSlotSelect.disabled = false;
        }
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    initForm() {
        const form = document.getElementById('reservation-form');
        if (!form) return;

        // Disable time slot initially
        const timeSlotSelect = document.getElementById('time-slot');
        if (timeSlotSelect) {
            timeSlotSelect.disabled = true;
        }

        form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    handleFormSubmit(e) {
        e.preventDefault();

        if (!this.selectedDate) {
            alert('予約日を選択してください。');
            return;
        }

        const formData = new FormData(e.target);
        const reservationData = {
            selectedDate: this.selectedDate,
            timeSlot: formData.get('timeSlot'),
            visitorCount: formData.get('visitorCount'),
            customerName: formData.get('customerName'),
            customerEmail: formData.get('customerEmail'),
            customerPhone: formData.get('customerPhone'),
            interest: formData.getAll('interest'),
            message: formData.get('message')
        };

        // Validate required fields
        if (!reservationData.timeSlot || !reservationData.visitorCount || 
            !reservationData.customerName || !reservationData.customerEmail || 
            !reservationData.customerPhone) {
            alert('必須項目をすべて入力してください。');
            return;
        }

        this.submitReservation(reservationData);
    }

    async submitReservation(data) {
        try {
            // Show loading state
            const submitBtn = document.querySelector('#reservation-form button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '送信中...';
            submitBtn.disabled = true;

            // Simulate API call
            await this.simulateApiCall(data);

            // Show success message
            this.showSuccessMessage();
            
            // Reset form
            document.getElementById('reservation-form').reset();
            this.selectedDate = null;
            
            // Clear calendar selection
            const selected = document.querySelector('.calendar-day--selected');
            if (selected) {
                selected.classList.remove('calendar-day--selected');
            }

            // Reset time slot
            const timeSlotSelect = document.getElementById('time-slot');
            if (timeSlotSelect) {
                timeSlotSelect.disabled = true;
            }

        } catch (error) {
            console.error('Reservation submission error:', error);
            alert('予約の送信に失敗しました。お電話でお問い合わせください。');
        } finally {
            // Reset button
            const submitBtn = document.querySelector('#reservation-form button[type="submit"]');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    simulateApiCall(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Reservation data:', data);
                resolve();
            }, 1500);
        });
    }

    showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <div class="success-content">
                <div class="success-icon">✓</div>
                <h3>予約申し込みを受け付けました</h3>
                <p>ご予約の確認メールをお送りいたします。<br>2営業日以内にご連絡いたしますので、しばらくお待ちください。</p>
                <button class="btn btn--primary" onclick="this.parentElement.parentElement.remove()">閉じる</button>
            </div>
        `;
        
        // Add styles
        successMessage.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        
        const successContent = successMessage.querySelector('.success-content');
        successContent.style.cssText = `
            background-color: white;
            padding: 3rem;
            border-radius: 12px;
            text-align: center;
            max-width: 400px;
            margin: 2rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        `;
        
        const successIcon = successMessage.querySelector('.success-icon');
        successIcon.style.cssText = `
            width: 60px;
            height: 60px;
            background-color: #2E5E3E;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            font-weight: bold;
            margin: 0 auto 1.5rem;
        `;

        document.body.appendChild(successMessage);
        
        // Auto close after 5 seconds
        setTimeout(() => {
            if (successMessage.parentElement) {
                successMessage.remove();
            }
        }, 5000);
    }
}

// Form validation utilities
class FormValidator {
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static validatePhone(phone) {
        const phoneRegex = /^[\d\-\(\)\+\s]+$/;
        return phoneRegex.test(phone) && phone.replace(/[\D]/g, '').length >= 10;
    }
}

// Enhanced form handling
class ReservationForm {
    constructor() {
        this.init();
    }

    init() {
        this.setupRealTimeValidation();
        this.setupAccessibility();
    }

    setupRealTimeValidation() {
        const emailInput = document.getElementById('customer-email');
        const phoneInput = document.getElementById('customer-phone');

        if (emailInput) {
            emailInput.addEventListener('blur', (e) => {
                this.validateField(e.target, FormValidator.validateEmail(e.target.value), 'メールアドレスの形式が正しくありません');
            });
        }

        if (phoneInput) {
            phoneInput.addEventListener('blur', (e) => {
                this.validateField(e.target, FormValidator.validatePhone(e.target.value), '電話番号の形式が正しくありません');
            });
        }
    }

    validateField(field, isValid, errorMessage) {
        const existingError = field.parentElement.querySelector('.field-error');
        
        if (existingError) {
            existingError.remove();
        }

        if (!isValid && field.value) {
            field.classList.add('field-error');
            const errorElement = document.createElement('small');
            errorElement.className = 'field-error';
            errorElement.style.color = '#e74c3c';
            errorElement.style.fontSize = '0.875rem';
            errorElement.style.marginTop = '0.25rem';
            errorElement.style.display = 'block';
            errorElement.textContent = errorMessage;
            field.parentElement.appendChild(errorElement);
        } else {
            field.classList.remove('field-error');
        }
    }

    setupAccessibility() {
        // Add ARIA labels and improve accessibility
        const requiredFields = document.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.setAttribute('aria-required', 'true');
        });

        // Add keyboard navigation for calendar
        const calendarDays = document.querySelectorAll('.calendar-day:not(.calendar-day--past):not(.calendar-day--unavailable)');
        calendarDays.forEach((day, index) => {
            day.setAttribute('tabindex', '0');
            day.setAttribute('role', 'button');
            day.setAttribute('aria-label', `${day.textContent}日を選択`);
            
            day.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    day.click();
                }
            });
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const calendar = new ShowroomCalendar();
    const formHandler = new ReservationForm();
    
    // Add smooth scroll behavior
    const ctaButton = document.querySelector('.cta-section .btn');
    if (ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            if (ctaButton.getAttribute('href') === '#reservation') {
                e.preventDefault();
                const reservationSection = document.querySelector('.reservation');
                if (reservationSection) {
                    reservationSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ShowroomCalendar, FormValidator, ReservationForm };
}