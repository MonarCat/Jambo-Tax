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
    // Top button
    const topButton = document.getElementById('top-button');
    if (topButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                topButton.classList.add('visible');
            } else {
                topButton.classList.remove('visible');
            }
        });
        topButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
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

    // Uploads form
    const uploadsForm = document.getElementById('my-form');
    if (uploadsForm) {
        uploadsForm.addEventListener('submit', function(e) {
            const uploadsContainer = document.getElementById('uploads-container');
            if (uploadsContainer) uploadsContainer.classList.add('hidden');
            showToast('Documents uploaded successfully! Our team will contact you shortly.', 'success');
        });
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
// Add these Netlify form enhancements:
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('form-submitted') === 'uploads') {
    showToast('Documents uploaded successfully! Our team will contact you shortly.', 'success');
    const uploadsContainer = document.getElementById('uploads-container');
    if (uploadsContainer) uploadsContainer.classList.add('hidden');
    history.replaceState(null, '', window.location.pathname);
  }
});

// New Toast Notification System
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => toast.remove(), 5000);
}
