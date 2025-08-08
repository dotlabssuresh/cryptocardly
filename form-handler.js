// Form submission handler
class FormHandler {
    constructor() {
        this.baseURL = window.location.origin;
        this.init();
    }

    init() {
        // Bind form submissions
        this.bindForm('#demoForm', '/api/demo');
        this.bindForm('#contactForm', '/api/contact');
        this.bindForm('#quoteForm', '/api/quote');
    }

    bindForm(formSelector, endpoint) {
        const form = document.querySelector(formSelector);
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSubmit(form, endpoint);
        });
    }

    async handleSubmit(form, endpoint) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        this.setLoadingState(submitBtn, true);
        
        try {
            // Collect form data
            const formData = new FormData(form);
            const data = {};
            
            // Handle regular fields
            for (let [key, value] of formData.entries()) {
                if (key.endsWith('[]')) {
                    // Handle checkbox arrays
                    const arrayKey = key.slice(0, -2);
                    if (!data[arrayKey]) data[arrayKey] = [];
                    data[arrayKey].push(value);
                } else {
                    data[key] = value;
                }
            }

            // Send request
            const response = await fetch(this.baseURL + endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                this.showMessage('success', result.message);
                form.reset();
            } else {
                this.showMessage('error', result.message);
            }

        } catch (error) {
            console.error('Form submission error:', error);
            this.showMessage('error', 'Network error. Please check your connection and try again.');
        } finally {
            // Reset button state
            this.setLoadingState(submitBtn, false, originalText);
        }
    }

    setLoadingState(button, isLoading, originalText = '') {
        if (isLoading) {
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        } else {
            button.disabled = false;
            button.innerHTML = originalText;
        }
    }

    showMessage(type, message) {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message form-message-${type}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Insert message before the first form on the page
        const firstForm = document.querySelector('form');
        if (firstForm) {
            firstForm.parentNode.insertBefore(messageDiv, firstForm);
            
            // Scroll to message
            messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

// Initialize form handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FormHandler();
});

// Add CSS for form messages
const messageStyles = `
<style>
.form-message {
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 8px;
    font-weight: 500;
    animation: slideIn 0.3s ease-out;
}

.form-message-success {
    background-color: #d1fae5;
    border: 1px solid #a7f3d0;
    color: #065f46;
}

.form-message-error {
    background-color: #fee2e2;
    border: 1px solid #fca5a5;
    color: #991b1b;
}

.message-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.message-content i {
    font-size: 1.1rem;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Loading button styles */
button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.fa-spinner {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', messageStyles); 