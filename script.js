// Form Validation and Dynamic DOM Manipulation System

class FormValidator {
    constructor() {
        this.validationRules = {
            firstName: {
                required: true,
                minLength: 2,
                maxLength: 50,
                pattern: /^[a-zA-Z\s]+$/,
                message: 'First name must be 2-50 characters and contain only letters'
            },
            lastName: {
                required: true,
                minLength: 2,
                maxLength: 50,
                pattern: /^[a-zA-Z\s]+$/,
                message: 'Last name must be 2-50 characters and contain only letters'
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            },
            phone: {
                required: true,
                pattern: /^[\+]?[1-9][\d]{0,15}$/,
                message: 'Please enter a valid phone number'
            },
            password: {
                required: true,
                minLength: 8,
                maxLength: 128,
                message: 'Password must be at least 8 characters long'
            },
            confirmPassword: {
                required: true,
                message: 'Passwords must match'
            },
            birthDate: {
                required: true,
                validate: this.validateAge,
                message: 'You must be at least 13 years old'
            },
            country: {
                required: true,
                message: 'Please select a country'
            },
            terms: {
                required: true,
                message: 'You must agree to the terms and conditions'
            },
            currentPassword: {
                required: true,
                message: 'Current password is required'
            },
            newPassword: {
                required: true,
                minLength: 8,
                maxLength: 128,
                message: 'New password must be at least 8 characters long'
            },
            confirmNewPassword: {
                required: true,
                message: 'New passwords must match'
            },
            notificationEmail: {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            }
        };

        this.passwordStrengthLevels = {
            weak: { score: 1, color: '#e74c3c', text: 'Weak' },
            fair: { score: 2, color: '#f39c12', text: 'Fair' },
            good: { score: 3, color: '#f1c40f', text: 'Good' },
            strong: { score: 4, color: '#27ae60', text: 'Strong' }
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupRouting();
        this.setupPasswordStrength();
        this.setupFormValidation();
        this.loadUserData();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const route = e.target.dataset.route;
                this.navigateTo(route);
            });
        });

        // Form submissions
        document.getElementById('registrationForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegistrationSubmit(e);
        });

        document.getElementById('settingsForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSettingsSubmit(e);
        });

        // Real-time validation
        document.querySelectorAll('input, select').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.handleRealTimeValidation(field));
        });
    }

    setupRouting() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            const route = e.state?.route || 'home';
            this.showPage(route);
        });

        // Initial route
        const initialRoute = window.location.hash.slice(1) || 'home';
        this.navigateTo(initialRoute);
    }

    setupPasswordStrength() {
        const passwordFields = ['password', 'newPassword'];
        
        passwordFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', () => this.updatePasswordStrength(field));
            }
        });
    }

    setupFormValidation() {
        // Custom validation messages
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('invalid', (e) => {
                e.preventDefault();
                this.showFieldError(e.target, e.target.validationMessage);
            }, true);
        });
    }

    navigateTo(route) {
        // Update URL
        window.history.pushState({ route }, '', `#${route}`);
        
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-route="${route}"]`)?.classList.add('active');
        
        // Show page
        this.showPage(route);
    }

    showPage(route) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show target page
        const targetPage = document.getElementById(route);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update page-specific content
        this.updatePageContent(route);
    }

    updatePageContent(route) {
        switch (route) {
            case 'profile':
                this.updateProfilePage();
                break;
            case 'settings':
                this.loadSettingsForm();
                break;
        }
    }

    updateProfilePage() {
        const userData = this.getUserData();
        if (userData) {
            document.getElementById('profileName').textContent = 
                `${userData.firstName} ${userData.lastName}`;
            document.getElementById('profileEmail').textContent = userData.email;
            document.getElementById('profileCountry').textContent = 
                this.getCountryName(userData.country);
            document.getElementById('memberSince').textContent = 
                new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        }
    }

    loadSettingsForm() {
        const userData = this.getUserData();
        if (userData) {
            document.getElementById('notificationEmail').value = userData.email;
            document.getElementById('emailNotifications').checked = userData.emailNotifications || false;
            document.getElementById('smsNotifications').checked = userData.smsNotifications || false;
        }
    }

    validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();
        const rules = this.validationRules[fieldName];

        if (!rules) return true;

        // Clear previous validation
        this.clearFieldError(field);

        // Check required
        if (rules.required && !value) {
            this.showFieldError(field, rules.message);
            return false;
        }

        // Skip other validations if field is empty and not required
        if (!value && !rules.required) return true;

        // Check min length
        if (rules.minLength && value.length < rules.minLength) {
            this.showFieldError(field, rules.message);
            return false;
        }

        // Check max length
        if (rules.maxLength && value.length > rules.maxLength) {
            this.showFieldError(field, rules.message);
            return false;
        }

        // Check pattern
        if (rules.pattern && !rules.pattern.test(value)) {
            this.showFieldError(field, rules.message);
            return false;
        }

        // Check custom validation
        if (rules.validate && !rules.validate(value)) {
            this.showFieldError(field, rules.message);
            return false;
        }

        // Special validation for password confirmation
        if (fieldName === 'confirmPassword') {
            const password = document.getElementById('password')?.value;
            if (password && value !== password) {
                this.showFieldError(field, 'Passwords do not match');
                return false;
            }
        }

        if (fieldName === 'confirmNewPassword') {
            const newPassword = document.getElementById('newPassword')?.value;
            if (newPassword && value !== newPassword) {
                this.showFieldError(field, 'New passwords do not match');
                return false;
            }
        }

        this.showFieldSuccess(field);
        return true;
    }

    handleRealTimeValidation(field) {
        // Debounce validation for better UX
        clearTimeout(field.validationTimeout);
        field.validationTimeout = setTimeout(() => {
            if (field.value.trim()) {
                this.validateField(field);
            } else {
                this.clearFieldError(field);
            }
        }, 300);
    }

    updatePasswordStrength(field) {
        const password = field.value;
        const strengthContainer = field.parentElement.querySelector('.password-strength');
        
        if (!strengthContainer) return;

        const strengthBar = strengthContainer.querySelector('.strength-fill');
        const strengthText = strengthContainer.querySelector('.strength-text');
        
        const strength = this.calculatePasswordStrength(password);
        
        // Update visual indicators
        strengthBar.className = 'strength-fill';
        strengthText.className = 'strength-text';
        
        if (password.length > 0) {
            strengthBar.classList.add(strength.level);
            strengthText.classList.add(strength.level);
            strengthText.textContent = strength.text;
        } else {
            strengthText.textContent = '';
        }
    }

    calculatePasswordStrength(password) {
        let score = 0;
        const checks = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            numbers: /\d/.test(password),
            symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            common: !this.isCommonPassword(password)
        };

        score = Object.values(checks).filter(Boolean).length;

        if (score <= 2) return this.passwordStrengthLevels.weak;
        if (score <= 3) return this.passwordStrengthLevels.fair;
        if (score <= 4) return this.passwordStrengthLevels.good;
        return this.passwordStrengthLevels.strong;
    }

    isCommonPassword(password) {
        const commonPasswords = [
            'password', '123456', '123456789', 'qwerty', 'abc123',
            'password123', 'admin', 'letmein', 'welcome', 'monkey'
        ];
        return commonPasswords.includes(password.toLowerCase());
    }

    validateAge(value) {
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            return age - 1 >= 13;
        }
        return age >= 13;
    }

    showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        
        field.classList.add('error');
        field.classList.remove('success');
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    showFieldSuccess(field) {
        const formGroup = field.closest('.form-group');
        
        field.classList.remove('error');
        field.classList.add('success');
        
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        
        field.classList.remove('error', 'success');
        
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    validateForm(form) {
        const fields = form.querySelectorAll('input, select');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async handleRegistrationSubmit(e) {
        const form = e.target;
        
        if (!this.validateForm(form)) {
            this.showNotification('Please fix the errors in the form', 'error');
            return;
        }

        const formData = new FormData(form);
        const userData = Object.fromEntries(formData.entries());

        // Simulate API call
        this.showLoadingState(form.querySelector('button[type="submit"]'));
        
        try {
            await this.simulateApiCall();
            
            // Save user data
            this.saveUserData(userData);
            
            this.showNotification('Registration successful! Welcome!', 'success');
            
            // Clear form
            form.reset();
            this.clearAllFieldErrors(form);
            
            // Navigate to profile
            setTimeout(() => {
                this.navigateTo('profile');
            }, 1500);
            
        } catch (error) {
            this.showNotification('Registration failed. Please try again.', 'error');
        } finally {
            this.hideLoadingState(form.querySelector('button[type="submit"]'));
        }
    }

    async handleSettingsSubmit(e) {
        const form = e.target;
        
        if (!this.validateForm(form)) {
            this.showNotification('Please fix the errors in the form', 'error');
            return;
        }

        const formData = new FormData(form);
        const settingsData = Object.fromEntries(formData.entries());

        // Simulate API call
        this.showLoadingState(form.querySelector('button[type="submit"]'));
        
        try {
            await this.simulateApiCall();
            
            // Update user data
            const userData = this.getUserData();
            const updatedData = { ...userData, ...settingsData };
            this.saveUserData(updatedData);
            
            this.showNotification('Settings updated successfully!', 'success');
            
        } catch (error) {
            this.showNotification('Failed to update settings. Please try again.', 'error');
        } finally {
            this.hideLoadingState(form.querySelector('button[type="submit"]'));
        }
    }

    showLoadingState(button) {
        button.disabled = true;
        button.innerHTML = '<span class="loading"></span> Processing...';
    }

    hideLoadingState(button) {
        button.disabled = false;
        button.innerHTML = button.dataset.originalText || 'Submit';
    }

    simulateApiCall() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate occasional failures
                if (Math.random() < 0.1) {
                    reject(new Error('Network error'));
                } else {
                    resolve();
                }
            }, 1500);
        });
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        const notification = document.createElement('div');
        
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        container.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    saveUserData(data) {
        localStorage.setItem('userData', JSON.stringify({
            ...data,
            registrationDate: new Date().toISOString()
        }));
    }

    getUserData() {
        const data = localStorage.getItem('userData');
        return data ? JSON.parse(data) : null;
    }

    loadUserData() {
        const userData = this.getUserData();
        if (userData && window.location.hash.includes('profile')) {
            this.updateProfilePage();
        }
    }

    getCountryName(code) {
        const countries = {
            'US': 'United States',
            'CA': 'Canada',
            'UK': 'United Kingdom',
            'AU': 'Australia',
            'DE': 'Germany',
            'FR': 'France',
            'JP': 'Japan',
            'IN': 'India'
        };
        return countries[code] || code;
    }

    clearAllFieldErrors(form) {
        const fields = form.querySelectorAll('input, select');
        fields.forEach(field => this.clearFieldError(field));
    }

    // Dynamic DOM Manipulation Methods
    addDynamicField(formId, fieldConfig) {
        const form = document.getElementById(formId);
        if (!form) return;

        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';
        formGroup.innerHTML = `
            <label for="${fieldConfig.id}">${fieldConfig.label}</label>
            <input type="${fieldConfig.type}" id="${fieldConfig.id}" name="${fieldConfig.name}" ${fieldConfig.required ? 'required' : ''}>
            <div class="error-message"></div>
        `;

        // Insert before submit button
        const submitButton = form.querySelector('button[type="submit"]');
        form.insertBefore(formGroup, submitButton);

        // Add validation rules
        if (fieldConfig.validation) {
            this.validationRules[fieldConfig.name] = fieldConfig.validation;
        }

        // Add event listeners
        const input = formGroup.querySelector('input');
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('input', () => this.handleRealTimeValidation(input));
    }

    removeDynamicField(formId, fieldName) {
        const form = document.getElementById(formId);
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.closest('.form-group').remove();
            delete this.validationRules[fieldName];
        }
    }

    updateFormField(formId, fieldName, updates) {
        const form = document.getElementById(formId);
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (field) {
            Object.keys(updates).forEach(key => {
                if (key === 'label') {
                    const label = field.closest('.form-group').querySelector('label');
                    label.textContent = updates[key];
                } else {
                    field[key] = updates[key];
                }
            });
        }
    }
}

// Test all features function
function testAllFeatures() {
    console.log('🧪 Running comprehensive feature tests...');
    
    const results = {
        navigation: false,
        passwordStrength: false,
        formValidation: false,
        dynamicDOM: false,
        notifications: false
    };
    
    // Test Navigation
    try {
        const navLinks = document.querySelectorAll('.nav-link');
        const pages = document.querySelectorAll('.page');
        results.navigation = navLinks.length > 0 && pages.length > 0;
        console.log(`✅ Navigation: ${navLinks.length} links, ${pages.length} pages`);
    } catch (e) {
        console.log('❌ Navigation test failed:', e.message);
    }
    
    // Test Password Strength
    try {
        const passwordField = document.getElementById('password');
        if (passwordField) {
            passwordField.value = 'TestPassword123!';
            passwordField.dispatchEvent(new Event('input'));
            const strengthText = passwordField.parentElement.querySelector('.strength-text');
            results.passwordStrength = strengthText && strengthText.textContent;
            console.log(`✅ Password Strength: ${results.passwordStrength ? 'Working' : 'Not working'}`);
        }
    } catch (e) {
        console.log('❌ Password strength test failed:', e.message);
    }
    
    // Test Form Validation
    try {
        const firstNameField = document.getElementById('firstName');
        if (firstNameField) {
            firstNameField.value = 'A';
            firstNameField.dispatchEvent(new Event('blur'));
            results.formValidation = firstNameField.classList.contains('error');
            console.log(`✅ Form Validation: ${results.formValidation ? 'Working' : 'Not working'}`);
        }
    } catch (e) {
        console.log('❌ Form validation test failed:', e.message);
    }
    
    // Test Dynamic DOM
    try {
        if (window.formValidator) {
            window.formValidator.addDynamicField('registrationForm', {
                id: 'testDynamicField',
                name: 'testDynamicField',
                label: 'Test Dynamic Field',
                type: 'text',
                required: false
            });
            const dynamicField = document.getElementById('testDynamicField');
            results.dynamicDOM = dynamicField !== null;
            if (dynamicField) {
                window.formValidator.removeDynamicField('registrationForm', 'testDynamicField');
            }
            console.log(`✅ Dynamic DOM: ${results.dynamicDOM ? 'Working' : 'Not working'}`);
        }
    } catch (e) {
        console.log('❌ Dynamic DOM test failed:', e.message);
    }
    
    // Test Notifications
    try {
        if (window.formValidator) {
            window.formValidator.showNotification('Test notification', 'success');
            results.notifications = true;
            console.log(`✅ Notifications: Working`);
        }
    } catch (e) {
        console.log('❌ Notifications test failed:', e.message);
    }
    
    // Show results
    const passedTests = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;
    
    console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);
    
    if (window.formValidator) {
        window.formValidator.showNotification(
            `Tests completed: ${passedTests}/${totalTests} passed`, 
            passedTests === totalTests ? 'success' : 'warning'
        );
    }
    
    return results;
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.formValidator = new FormValidator();
    
    // Store original button text for loading states
    document.querySelectorAll('button[type="submit"]').forEach(button => {
        button.dataset.originalText = button.textContent;
    });
    
    // Make test function globally available
    window.testAllFeatures = testAllFeatures;
    
    console.log('🎯 FormValidator initialized successfully!');
    console.log('💡 Use testAllFeatures() to run comprehensive tests');
    console.log('💡 Use window.demo.runDemo() to run interactive demo');
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormValidator;
}
