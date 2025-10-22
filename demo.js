// Demo script to showcase all functionality
class FormValidatorDemo {
    constructor() {
        this.demoSteps = [
            'Navigation Testing',
            'Password Strength Demo',
            'Form Validation Demo',
            'Dynamic DOM Demo',
            'Notifications Demo'
        ];
        this.currentStep = 0;
    }

    async runDemo() {
        console.log('🚀 Starting FormValidator Demo...');
        
        for (let i = 0; i < this.demoSteps.length; i++) {
            this.currentStep = i;
            console.log(`\n📋 Step ${i + 1}: ${this.demoSteps[i]}`);
            await this.executeStep(i);
            await this.wait(2000);
        }
        
        console.log('\n✅ Demo completed successfully!');
    }

    async executeStep(step) {
        switch (step) {
            case 0:
                await this.demoNavigation();
                break;
            case 1:
                await this.demoPasswordStrength();
                break;
            case 2:
                await this.demoFormValidation();
                break;
            case 3:
                await this.demoDynamicDOM();
                break;
            case 4:
                await this.demoNotifications();
                break;
        }
    }

    async demoNavigation() {
        console.log('Testing navigation between pages...');
        
        const routes = ['home', 'registration', 'profile', 'settings'];
        
        for (const route of routes) {
            console.log(`  → Navigating to ${route}`);
            
            // Find and click navigation link
            const link = document.querySelector(`[data-route="${route}"]`);
            if (link) {
                link.click();
                await this.wait(500);
                
                // Check if page is active
                const activePage = document.querySelector('.page.active');
                const isCorrect = activePage && activePage.id === route;
                console.log(`    ${isCorrect ? '✅' : '❌'} Page ${route} ${isCorrect ? 'active' : 'not found'}`);
            } else {
                console.log(`    ❌ Navigation link for ${route} not found`);
            }
        }
    }

    async demoPasswordStrength() {
        console.log('Demonstrating password strength validation...');
        
        const passwords = [
            { value: '123', expected: 'Weak' },
            { value: 'password', expected: 'Weak' },
            { value: 'Password123', expected: 'Good' },
            { value: 'MyStr0ng!Pass', expected: 'Strong' }
        ];
        
        // Navigate to registration page
        const regLink = document.querySelector('[data-route="registration"]');
        if (regLink) {
            regLink.click();
            await this.wait(500);
        }
        
        const passwordField = document.getElementById('password');
        if (!passwordField) {
            console.log('  ❌ Password field not found');
            return;
        }
        
        for (const { value, expected } of passwords) {
            console.log(`  → Testing password: "${value}"`);
            
            // Set password value
            passwordField.value = value;
            passwordField.dispatchEvent(new Event('input'));
            
            await this.wait(300);
            
            // Check strength indicator
            const strengthText = passwordField.parentElement.querySelector('.strength-text');
            const strengthFill = passwordField.parentElement.querySelector('.strength-fill');
            
            if (strengthText && strengthText.textContent) {
                console.log(`    ✅ Strength: ${strengthText.textContent}`);
            } else {
                console.log(`    ❌ No strength indicator found`);
            }
        }
    }

    async demoFormValidation() {
        console.log('Demonstrating form validation...');
        
        const testCases = [
            {
                field: 'firstName',
                value: 'A',
                shouldFail: true,
                description: 'Too short first name'
            },
            {
                field: 'firstName',
                value: 'John',
                shouldFail: false,
                description: 'Valid first name'
            },
            {
                field: 'email',
                value: 'invalid-email',
                shouldFail: true,
                description: 'Invalid email format'
            },
            {
                field: 'email',
                value: 'john@example.com',
                shouldFail: false,
                description: 'Valid email'
            }
        ];
        
        for (const testCase of testCases) {
            console.log(`  → ${testCase.description}`);
            
            const field = document.getElementById(testCase.field);
            if (!field) {
                console.log(`    ❌ Field ${testCase.field} not found`);
                continue;
            }
            
            // Set value and trigger validation
            field.value = testCase.value;
            field.dispatchEvent(new Event('blur'));
            
            await this.wait(300);
            
            // Check validation result
            const hasError = field.classList.contains('error');
            const hasSuccess = field.classList.contains('success');
            
            if (testCase.shouldFail) {
                console.log(`    ${hasError ? '✅' : '❌'} Validation failed as expected`);
            } else {
                console.log(`    ${hasSuccess ? '✅' : '❌'} Validation passed as expected`);
            }
        }
    }

    async demoDynamicDOM() {
        console.log('Demonstrating dynamic DOM manipulation...');
        
        // Test adding dynamic field
        console.log('  → Adding dynamic field');
        
        if (window.formValidator) {
            try {
                window.formValidator.addDynamicField('registrationForm', {
                    id: 'demoField',
                    name: 'demoField',
                    label: 'Demo Field',
                    type: 'text',
                    required: false,
                    validation: {
                        minLength: 3,
                        message: 'Demo field must be at least 3 characters'
                    }
                });
                
                const demoField = document.getElementById('demoField');
                if (demoField) {
                    console.log('    ✅ Dynamic field added successfully');
                    
                    // Test validation on dynamic field
                    demoField.value = 'Hi';
                    demoField.dispatchEvent(new Event('blur'));
                    
                    await this.wait(300);
                    
                    const hasError = demoField.classList.contains('error');
                    console.log(`    ${hasError ? '✅' : '❌'} Dynamic field validation working`);
                    
                    // Remove dynamic field
                    window.formValidator.removeDynamicField('registrationForm', 'demoField');
                    
                    await this.wait(300);
                    
                    const removedField = document.getElementById('demoField');
                    console.log(`    ${removedField === null ? '✅' : '❌'} Dynamic field removed successfully`);
                } else {
                    console.log('    ❌ Dynamic field not added');
                }
            } catch (error) {
                console.log(`    ❌ Error in dynamic DOM manipulation: ${error.message}`);
            }
        } else {
            console.log('    ❌ FormValidator not available');
        }
    }

    async demoNotifications() {
        console.log('Demonstrating notification system...');
        
        const notificationTypes = [
            { type: 'success', message: 'Success notification' },
            { type: 'error', message: 'Error notification' },
            { type: 'warning', message: 'Warning notification' },
            { type: 'info', message: 'Info notification' }
        ];
        
        for (const notif of notificationTypes) {
            console.log(`  → Showing ${notif.type} notification`);
            
            if (window.formValidator) {
                window.formValidator.showNotification(notif.message, notif.type);
                
                // Check if notification was added to DOM
                const notifications = document.querySelectorAll('.notification');
                const hasNotification = notifications.length > 0;
                
                console.log(`    ${hasNotification ? '✅' : '❌'} Notification displayed`);
                
                await this.wait(1000);
            } else {
                console.log('    ❌ FormValidator not available');
            }
        }
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}

// Initialize demo when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.demo = new FormValidatorDemo();
    
    console.log('🎯 FormValidator Demo initialized!');
    console.log('Use demo.runDemo() in console to run the demo');
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormValidatorDemo;
}
