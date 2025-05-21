// Global variables (Keep as is)
let selectedService = '';
let selectedServiceName = '';
let selectedServicePrice = 0;

// New: Function to update active navigation link based on scroll
function updateActiveNavLink() {
    let scrollPosition = window.scrollY;
    document.querySelectorAll('.section').forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
        else if (scrollPosition < (document.getElementById('services')?.offsetTop ?? 0) - 100) {
            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
            const heroLink = document.querySelector('.nav-link[href="#hero"]');
            if (heroLink) heroLink.classList.add('active');
        }
    });
}

function expandService(serviceType) {
    hideAllMiniServices();
    const miniServiceSection = document.getElementById(`${serviceType}-services`);
    if (miniServiceSection) {
        miniServiceSection.classList.remove('hidden');
        miniServiceSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function hideAllMiniServices() {
    const miniServiceSections = document.querySelectorAll('.mini-services');
    miniServiceSections.forEach(section => {
        section.classList.add('hidden');
    });
}

function orderService(serviceName, price) {
    selectedServiceName = serviceName;
    selectedServicePrice = price;

    const nameEl = document.getElementById('service-name');
    const priceEl = document.getElementById('service-price');
    const paymentSection = document.getElementById('payment');
    const paymentMethod = document.getElementById('payment-method');

    if (nameEl) nameEl.textContent = `Service: ${serviceName}`;
    if (priceEl) priceEl.textContent = `Price: KSh ${price.toLocaleString()}`;
    if (paymentSection) paymentSection.classList.remove('hidden');
    hideAllPaymentForms();
    if (paymentMethod) paymentMethod.value = '';

    if (paymentSection) paymentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showPaymentForm() {
    hideAllPaymentForms();
    const paymentMethod = document.getElementById('payment-method');
    if (paymentMethod && paymentMethod.value) {
        const form = document.getElementById(`${paymentMethod.value.toLowerCase()}-form`);
        if (form) form.classList.remove('hidden');
    }
}

function hideAllPaymentForms() {
    const paymentForms = document.querySelectorAll('.payment-form');
    paymentForms.forEach(form => {
        form.classList.add('hidden');
    });
}

function hidePayment() {
    const payment = document.getElementById('payment');
    const paymentMethod = document.getElementById('payment-method');
    if (payment) payment.classList.add('hidden');
    if (paymentMethod) paymentMethod.value = '';
    hideAllPaymentForms();
    const services = document.getElementById('services');
    if (services) services.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function returnToServices() {
    const confirmation = document.getElementById('confirmation');
    if (confirmation) confirmation.classList.add('hidden');
    hideAllMiniServices();
    const services = document.getElementById('services');
    if (services) services.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function calculateTax() {
    const incomeInput = document.getElementById('income');
    const resultDisplay = document.getElementById('result');
    if (!incomeInput || !resultDisplay) return;
    const income = parseFloat(incomeInput.value);

    if (isNaN(income) || income < 0) {
        resultDisplay.textContent = 'Please enter a valid positive income.';
        resultDisplay.style.color = 'red';
        return;
    }
    if (income === 0) {
        resultDisplay.textContent = 'Estimated PAYE: KES 0.00 per month';
        resultDisplay.style.color = 'var(--secondary-color)';
        return;
    }

    let tax = 0;
    const relief = 2400;

    if (income <= 24000) tax = income * 0.10;
    else if (income <= 32333) tax = 2400 + (income - 24000) * 0.25;
    else if (income > 32333) tax = 2400 + (32333 - 24000) * 0.25 + (income - 32333) * 0.30;

    let netTax = Math.max(0, tax - relief);

    resultDisplay.textContent = `Estimated PAYE: KES ${netTax.toFixed(2)} per month`;
    resultDisplay.style.color = 'var(--secondary-color)';
}

function copyToClipboard(text, buttonElement) {
    if (!navigator.clipboard) {
        alert('Clipboard API not supported.');
        return;
    }
    navigator.clipboard.writeText(text).then(() => {
        const tooltip = buttonElement?.querySelector('.tooltip-text');
        if (!tooltip) return;
        const originalText = tooltip.textContent;
        tooltip.textContent = 'Copied!';
        buttonElement.classList.add('copied');
        setTimeout(() => {
            tooltip.textContent = originalText;
            buttonElement.classList.remove('copied');
        }, 1500);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy. Please copy manually.');
    });
}

function processPayment(method) {
    setTimeout(() => {
        const payment = document.getElementById('payment');
        const confirmationSection = document.getElementById('confirmation');
        if (payment) payment.classList.add('hidden');
        if (confirmationSection) {
            confirmationSection.classList.remove('hidden');
            confirmationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        console.log(`Payment of KSh ${selectedServicePrice} for ${selectedServiceName} processed via ${method}`);
    }, 500);
}

function animateServices() {
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });
}

function toggleLanguage() {
    const enContent = document.querySelector('.legal-content');
    const swContent = document.getElementById('swahili-content');
    if (!enContent || !swContent) return;
    enContent.classList.toggle('hidden');
    swContent.classList.toggle('hidden');
    const pdfBtn = document.querySelector('.btn-pdf');
    if (pdfBtn) {
        const currentLang = swContent.classList.contains('hidden') ? 'en' : 'sw';
        pdfBtn.href = `${window.location.pathname.replace('.html','')}-${currentLang}.pdf`;
    }
}

function toggleUploadsContainer() {
    const uploadsContainer = document.getElementById('uploads-container');
    if (uploadsContainer) uploadsContainer.classList.toggle('hidden');
}

function redirectToHome() {
    window.location.href = '#hero';
}

// Make all HTML-called functions global
window.expandService = expandService;
window.hideAllMiniServices = hideAllMiniServices;
window.orderService = orderService;
window.toggleUploadsContainer = toggleUploadsContainer;
window.redirectToHome = redirectToHome;
window.calculateTax = calculateTax;
window.copyToClipboard = copyToClipboard;

// Combined DOMContentLoaded listeners and wrapped all DOM queries in checks
document.addEventListener('DOMContentLoaded', () => {
   // Top Button Logic - Fixed
const topButton = document.getElementById('top-button');
if (topButton) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      topButton.classList.add('visible');
    } else {
      topButton.classList.remove('visible');
    }
  });

  topButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
    // Service card buttons
    document.querySelectorAll('.service-card button').forEach(button => {
        button.addEventListener('click', function() {
            const serviceType = this.dataset.serviceType;
            expandService(serviceType);
        });
    });

    // Upload button
    const uploadBtn = document.getElementById('upload-documents-btn');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', toggleUploadsContainer);
    }

 
    // Copyright year
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Initial nav link update
    updateActiveNavLink();

    

    

    // Smooth scroll for all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Service Carousel Animation
    animateServices();

    // Newsletter Subscription
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input')?.value;
            console.log('Subscribed email:', email);
            alert('Thank you for subscribing!');
        });
    }

    // Slider controls
    const slider = document.querySelector('.slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    if (slider && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            slider.scrollBy({ left: -slider.offsetWidth, behavior: 'smooth' });
        });
        nextBtn.addEventListener('click', () => {
            slider.scrollBy({ left: slider.offsetWidth, behavior: 'smooth' });
        });
    }

    // Hamburger menu
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.getElementById('main-nav-list');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        navLinks.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                navLinks.classList.remove('active');
            }
        });
    }

    // Red accents
    const redTargets = [
        document.querySelector(".hero h1"),
        document.querySelector(".hero p"),
        document.querySelector(".btn.btn-primary"),
        document.querySelector(".footer h2"),
        ...document.querySelectorAll(".service-card:nth-child(2) h3"),
        ...document.querySelectorAll(".service-card:nth-child(2) .price"),
        ...document.querySelectorAll(".team-member:nth-child(4) h3"),
        ...document.querySelectorAll(".team-member:nth-child(4) p")
    ];
    redTargets.forEach(el => {
        if (el) el.classList.add("highlight-red");
    });

    const redBackgrounds = [
        document.querySelector(".newsletter-form button"),
        ...document.querySelectorAll(".slider-item:nth-child(2)")
    ];
    redBackgrounds.forEach(el => {
        if (el) el.classList.add("bg-highlight-red");
    });

    const redBorders = document.querySelectorAll(".uploads");
    for (let i = 0; i < redBorders.length; i += 3) {
        redBorders[i].classList.remove("border-left");
        redBorders[i].classList.add("border-highlight-red");
    }

    // Service carousel controls
    const serviceCarousel = document.querySelector('.service-carousel');
    const prevBtn2 = document.querySelector('.prev-btn');
    const nextBtn2 = document.querySelector('.next-btn');
    if (serviceCarousel && prevBtn2 && nextBtn2) {
        prevBtn2.addEventListener('click', () => {
            serviceCarousel.scrollBy({ left: -300, behavior: 'smooth' });
        });
        nextBtn2.addEventListener('click', () => {
            serviceCarousel.scrollBy({ left: 300, behavior: 'smooth' });
        });
    }

    // Terms agreement
    const termsCheckbox = document.getElementById('terms-agreement');
    const termsError = document.getElementById('terms-error');
    const form = document.querySelector('form');
    if (termsCheckbox && termsError && form) {
        termsCheckbox.addEventListener('change', () => {
            if (termsCheckbox.checked) {
                termsError.textContent = '';
            }
        });
        form.addEventListener('submit', (e) => {
            if (!termsCheckbox.checked) {
                e.preventDefault();
                termsError.textContent = 'You must agree to the terms and conditions.';
            }
        });
    }

    // Accessibility
    const accessibilityBtn = document.getElementById('accessibility-btn');
    const accessibilityOptions = document.getElementById('accessibility-options');
    const increaseFontBtn = document.getElementById('increase-font');
    const decreaseFontBtn = document.getElementById('decrease-font');
    const toggleContrastBtn = document.getElementById('toggle-contrast');
    const resetSettingsBtn = document.getElementById('reset-settings');
    let fontSize = 16;
    if (accessibilityBtn && accessibilityOptions) {
        accessibilityBtn.addEventListener('click', () => {
            accessibilityOptions.classList.toggle('hidden');
        });
    }
    if (increaseFontBtn) {
        increaseFontBtn.addEventListener('click', () => {
            fontSize += 2;
            document.body.style.fontSize = `${fontSize}px`;
        });
    }
    if (decreaseFontBtn) {
        decreaseFontBtn.addEventListener('click', () => {
            if (fontSize > 12) {
                fontSize -= 2;
                document.body.style.fontSize = `${fontSize}px`;
            }
        });
    }
    if (toggleContrastBtn) {
        toggleContrastBtn.addEventListener('click', () => {
            document.body.classList.toggle('high-contrast');
        });
    }
    if (resetSettingsBtn) {
        resetSettingsBtn.addEventListener('click', () => {
            fontSize = 16;
            document.body.style.fontSize = '';
            document.body.classList.remove('high-contrast');
        });
    }

    // Back to home
    const backToHomeBtn = document.getElementById('back-to-home-btn');
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', redirectToHome);
    }

    // Service type highlight
    const serviceType = document.getElementById('service-type');
    if (serviceType) {
        serviceType.addEventListener('change', function() {
            Array.from(serviceType.options).forEach(option => {
                option.classList.remove('selected-option');
            });
            Array.from(serviceType.selectedOptions).forEach(option => {
                option.classList.add('selected-option');
            });
        });
    }

    // Lazy loading images
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            if (img.dataset.src) img.src = img.dataset.src;
        });
    } else {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }

   
});
// Enhanced Toast Notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
    
    // Allow manual dismiss
    toast.addEventListener('click', () => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    });
}
// Enhanced FAQ Toggle
function initializeFAQ() {
    document.querySelectorAll('.faq-question').forEach(button => {
        // Ensure answers start hidden (in case CSS fails)
        const answer = button.nextElementSibling;
        answer.style.maxHeight = '0';
        answer.style.padding = '0 1.25rem';
        
        button.addEventListener('click', () => {
            // Toggle active class on question
            button.classList.toggle('active');
            
            // Toggle answer visibility
            if (button.classList.contains('active')) {
                answer.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.padding = '1.25rem';
            } else {
                answer.classList.remove('active');
                answer.style.maxHeight = '0';
                answer.style.padding = '0 1.25rem';
            }
            
            // Close other FAQs in the same category when opening one
            if (button.classList.contains('active')) {
                const category = button.closest('.faq-category');
                category.querySelectorAll('.faq-question').forEach(otherButton => {
                    if (otherButton !== button && otherButton.classList.contains('active')) {
                        otherButton.classList.remove('active');
                        const otherAnswer = otherButton.nextElementSibling;
                        otherAnswer.classList.remove('active');
                        otherAnswer.style.maxHeight = '0';
                        otherAnswer.style.padding = '0 1.25rem';
                    }
                });
            }
        });
    });
}

// Call this function when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeFAQ);
// File compression function
async function compressFile(file, { quality = 0.8, maxWidth = 1024, maxHeight = 1024 } = {}) {
    if (!file.type.match('image.*')) return file; // Skip non-image files
    
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                // Calculate new dimensions while maintaining aspect ratio
                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width = Math.floor(width * ratio);
                    height = Math.floor(height * ratio);
                }
                
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                canvas.toBlob((blob) => {
                    resolve(new File([blob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    }));
                }, 'image/jpeg', quality);
            };
        };
        reader.readAsDataURL(file);
    });
}

// Form submission handler
async function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const uploadProgress = document.querySelector('.upload-progress');
    
    // Show progress bar if it exists
    if (uploadProgress) uploadProgress.classList.remove('hidden');

    try {
        // Submit form with XMLHttpRequest to track progress
        const xhr = new XMLHttpRequest();
        xhr.open('POST', form.action, true);
        
        // For text-only forms, we can skip the progress tracking
        // or show a simple loading state
        if (uploadProgress) {
            // Simulate progress for text form submission
            let progress = 0;
            const interval = setInterval(() => {
                progress += 20;
                const progressBar = document.querySelector('.progress-bar');
                const progressPercentage = document.querySelector('#progress-percentage');
                if (progressBar) progressBar.style.width = `${progress}%`;
                if (progressPercentage) progressPercentage.textContent = `${progress}%`;
                if (progress >= 100) clearInterval(interval);
            }, 200);
        }
        
        xhr.onload = () => {
            if (uploadProgress) uploadProgress.classList.add('hidden');
            
            try {
                // Try to parse the response as JSON
                const response = JSON.parse(xhr.responseText);
                
                if (xhr.status >= 200 && xhr.status < 300) {
                    showToast(response.message || 'Form submitted successfully!', 'success');
                    form.reset();
                    const uploadsContainer = document.getElementById('uploads-container');
                    if (uploadsContainer) uploadsContainer.classList.add('hidden');
                } else {
                    showToast(response.error || 'Submission failed. Please try again.', 'error');
                }
            } catch (e) {
                // If response isn't JSON, check the status code
                if (xhr.status >= 200 && xhr.status < 300) {
                    showToast('Form submitted successfully!', 'success');
                    form.reset();
                    const uploadsContainer = document.getElementById('uploads-container');
                    if (uploadsContainer) uploadsContainer.classList.add('hidden');
                } else {
                    showToast('Submission failed. Please try again.', 'error');
                }
            }
        };
        
        xhr.onerror = () => {
            if (uploadProgress) uploadProgress.classList.add('hidden');
            showToast('An error occurred. Please try again.', 'error');
        };
        
        xhr.send(formData);
        
    } catch (error) {
        console.error('Error:', error);
        if (uploadProgress) uploadProgress.classList.add('hidden');
        showToast('An error occurred. Please try again.', 'error');
    }
}

// Update the form event listener in your DOMContentLoaded section
document.addEventListener('DOMContentLoaded', () => {
    // ... existing code ...
    
    const uploadsForm = document.getElementById('my-form');
    if (uploadsForm) {
        uploadsForm.addEventListener('submit', handleFormSubmit);
    }
    
    // ... rest of your existing code ...
});