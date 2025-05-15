// Global variables (Keep as is)
let selectedService = '';
let selectedServiceName = '';
let selectedServicePrice = 0;

// New: Function to update active navigation link based on scroll
function updateActiveNavLink() {
    let scrollPosition = window.scrollY;
    document.querySelectorAll('.section').forEach(section => {
        const sectionTop = section.offsetTop - 100; // Adjust offset as needed
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
        // Special case for top of page
        else if (scrollPosition < document.getElementById('services').offsetTop - 100) {
             document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
             document.querySelector('.nav-link[href="#hero"]').classList.add('active');
        }
    });
}

// Expand service to show mini-services (Keep logic, minor adjustments possible)
function expandService(serviceType) {
  hideAllMiniServices();
  const miniServiceSection = document.getElementById(`${serviceType}-services`);
  miniServiceSection.classList.remove('hidden');
  // Scroll to the mini-services section smoothly
  miniServiceSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Hide all mini-service sections (Keep as is)
function hideAllMiniServices() {
  const miniServiceSections = document.querySelectorAll('.mini-services');
  miniServiceSections.forEach(section => {
    section.classList.add('hidden');
  });
}

// Order a specific service (Keep logic, maybe add loading state)
function orderService(serviceName, price) {
  selectedServiceName = serviceName;
  selectedServicePrice = price;

  document.getElementById('service-name').textContent = `Service: ${serviceName}`;
  document.getElementById('service-price').textContent = `Price: KSh ${price.toLocaleString()}`;

  const paymentSection = document.getElementById('payment');
  paymentSection.classList.remove('hidden');
  hideAllPaymentForms();
  document.getElementById('payment-method').value = ''; // Reset dropdown

  paymentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Show payment form based on selected method (Keep as is)
function showPaymentForm() {
  hideAllPaymentForms();
  const paymentMethod = document.getElementById('payment-method').value;
  if (paymentMethod) {
    const form = document.getElementById(`${paymentMethod.toLowerCase()}-form`);
    if(form) form.classList.remove('hidden');
  }
}

// Hide all payment forms (Keep as is)
function hideAllPaymentForms() {
  const paymentForms = document.querySelectorAll('.payment-form');
  paymentForms.forEach(form => {
    form.classList.add('hidden');
  });
}

// Hide payment section (Keep as is)
function hidePayment() {
  document.getElementById('payment').classList.add('hidden');
  document.getElementById('payment-method').value = '';
  hideAllPaymentForms();
  // Scroll back to services section
   document.getElementById('services').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Return to services after confirmation (Keep as is)
function returnToServices() {
  document.getElementById('confirmation').classList.add('hidden');
  hideAllMiniServices();
  document.getElementById('services').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Tax calculator function (Improved validation)
function calculateTax() {
  const incomeInput = document.getElementById('income');
  const resultDisplay = document.getElementById('result');
  const income = parseFloat(incomeInput.value);

  if (isNaN(income) || income < 0) {
    resultDisplay.textContent = 'Please enter a valid positive income.';
    resultDisplay.style.color = 'red';
    return;
  }
  if (income === 0) {
     resultDisplay.textContent = 'Estimated PAYE: KES 0.00 per month';
     resultDisplay.style.color = 'var(--secondary-color)'; // Use CSS variable
     return;
  }

  // Kenya PAYE bands (Ensure these are up-to-date for 2025 - placeholder values used)
  let tax = 0;
  const relief = 2400; // Monthly personal relief (example)

  if (income <= 24000) tax = income * 0.10;
  else if (income <= 32333) tax = 2400 + (income - 24000) * 0.25;
  else if (income > 32333) tax = 2400 + (32333 - 24000) * 0.25 + (income - 32333) * 0.30;
  // Add more bands if necessary based on current KRA rates

  let netTax = Math.max(0, tax - relief); // Ensure tax is not negative after relief

  resultDisplay.textContent = `Estimated PAYE: KES ${netTax.toFixed(2)} per month`;
  resultDisplay.style.color = 'var(--secondary-color)'; // Use CSS variable
}

document.addEventListener('DOMContentLoaded', () => {
  const topButton = document.getElementById('top-button');

  // Show the "Top" button when scrolling down
  window.addEventListener('scroll', () => {
      if (window.scrollY > 400) { // Show after scrolling 400px
          topButton.classList.add('visible');
      } else {
          topButton.classList.remove('visible');
      }
  });

  // Scroll to the top when the button is clicked
  topButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// New: Copy to Clipboard Functionality
function copyToClipboard(text, buttonElement) {
    navigator.clipboard.writeText(text).then(() => {
        // Success feedback
        const tooltip = buttonElement.querySelector('.tooltip-text');
        const originalText = tooltip.textContent;
        tooltip.textContent = 'Copied!';
        buttonElement.classList.add('copied'); // Add class for styling if needed

        // Reset tooltip after a delay
        setTimeout(() => {
            tooltip.textContent = originalText;
            buttonElement.classList.remove('copied');
        }, 1500); // Reset after 1.5 seconds
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        // Optionally provide fallback or error message
        alert('Failed to copy. Please copy manually.');
    });
}


// Payment Processing Simulation (Add basic validation)
document.addEventListener('DOMContentLoaded', function() {
    // Update copyright year
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Initial nav link update
     updateActiveNavLink();

    // M-Pesa Payment
    document.getElementById('mpesa-pay-btn').addEventListener('click', function() {
        const phoneNumber = document.getElementById('mpesa-phone').value.trim();
        // Basic Kenyan phone number validation (example)
        if (!phoneNumber || !/^0[17]\d{8}$/.test(phoneNumber)) {
            alert('Please enter a valid M-Pesa phone number (e.g., 07XXXXXXXX or 01XXXXXXXX).');
            return;
        }
        console.log(`Processing M-Pesa payment for ${selectedServiceName} (KSh ${selectedServicePrice}) to phone: ${phoneNumber}`);
        processPayment('M-Pesa');
    });

    // PayPal Payment
    document.getElementById('paypal-pay-btn').addEventListener('click', function() {
        console.log(`Redirecting to PayPal for payment of ${selectedServiceName} (KSh ${selectedServicePrice})`);
        // Add actual PayPal SDK integration here if needed
        processPayment('PayPal');
    });

    // Bank Transfer Payment
    document.getElementById('bank-pay-btn').addEventListener('click', function() {
        const bankName = document.getElementById('bank-name').value.trim();
        const accountNumber = document.getElementById('account-number').value.trim();
        if (!bankName || !accountNumber) {
            alert('Please enter both Bank Name and Account Number.');
            return;
        }
        console.log(`Processing Bank Transfer for ${selectedServiceName} (KSh ${selectedServicePrice}) from ${bankName}, Account: ${accountNumber}`);
        processPayment('Bank Transfer');
    });

    // Card Payment (Simplified validation)
    document.getElementById('card-pay-btn').addEventListener('click', function() {
        const cardNumber = document.getElementById('card-number').value.trim();
        const expiryDate = document.getElementById('expiry-date').value.trim();
        const cvv = document.getElementById('cvv').value.trim();
        const cardName = document.getElementById('card-name').value.trim();

        // Basic presence check - real validation is complex and needs libraries/server-side checks
        if (!cardNumber || !expiryDate || !cvv || !cardName) {
            alert('Please enter all card details.');
            return;
        }
        // Basic format checks (examples)
        if (!/^\d{13,19}$/.test(cardNumber.replace(/\s/g, ''))) {
             alert('Please enter a valid card number.');
             return;
        }
         if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiryDate)) {
             alert('Please enter a valid expiry date (MM/YY).');
             return;
        }
        if (!/^\d{3,4}$/.test(cvv)) {
             alert('Please enter a valid CVV.');
             return;
        }

        console.log(`Processing Card payment for ${selectedServiceName} (KSh ${selectedServicePrice}) with card ending in ${cardNumber.slice(-4)}`);
        processPayment('Card');
    });
});

// Process Payment and Show Confirmation (Keep simulation logic)
function processPayment(method) {
  // Add a small delay to simulate processing
  // You might show a loading spinner here
  setTimeout(() => {
      document.getElementById('payment').classList.add('hidden');
      const confirmationSection = document.getElementById('confirmation');
      confirmationSection.classList.remove('hidden');
      confirmationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

      console.log(`Payment of KSh ${selectedServicePrice} for ${selectedServiceName} processed via ${method}`);
      // Here you would typically get a transaction ID from the real payment API
      // and potentially display it or send it in the confirmation email.
  }, 500); // 0.5 second delay simulation
}
// Slider Animation
document.addEventListener('DOMContentLoaded', function() {
  const teamSlider = document.querySelector('.team-slider');
  const blogSlider = document.querySelector('.blog-slider');
  
  [teamSlider, blogSlider].forEach(slider => {
    if (slider) {
      setInterval(() => {
        if (slider.scrollLeft + slider.offsetWidth >= slider.scrollWidth) {
          slider.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          slider.scrollBy({ left: 320, behavior: 'smooth' });
        }
      }, 6000);
    }
  });
});
// Add smooth scroll to all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Service Carousel Animation
function animateServices() {
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.2}s`;
  });
}
window.addEventListener('load', animateServices);

// Newsletter Subscription
document.querySelector('.newsletter-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = this.querySelector('input').value;
  // Add your newsletter service integration here
  console.log('Subscribed email:', email);
  alert('Thank you for subscribing!');
});
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    prevBtn.addEventListener('click', () => {
        slider.scrollBy({ left: -slider.offsetWidth, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
        slider.scrollBy({ left: slider.offsetWidth, behavior: 'smooth' });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close the menu when a link is clicked
    navLinks.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            navLinks.classList.remove('active');
        }
    });
});
// Inject red accents after DOM load
document.addEventListener("DOMContentLoaded", () => {
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
});

document.addEventListener('DOMContentLoaded', () => {
    const serviceCarousel = document.querySelector('.service-carousel');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    prevBtn.addEventListener('click', () => {
        serviceCarousel.scrollBy({ left: -300, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
        serviceCarousel.scrollBy({ left: 300, behavior: 'smooth' });
    });
});
// Language Toggle
function toggleLanguage() {
  const enContent = document.querySelector('.legal-content');
  const swContent = document.getElementById('swahili-content');
  
  enContent.classList.toggle('hidden');
  swContent.classList.toggle('hidden');
  
  // Update PDF link
  const pdfBtn = document.querySelector('.btn-pdf');
  const currentLang = swContent.classList.contains('hidden') ? 'en' : 'sw';
  pdfBtn.href = `${window.location.pathname.replace('.html','')}-${currentLang}.pdf`;
}

document.addEventListener('DOMContentLoaded', () => {
    const termsCheckbox = document.getElementById('terms-agreement');
    const termsError = document.getElementById('terms-error');

    termsCheckbox.addEventListener('change', () => {
        if (termsCheckbox.checked) {
            termsError.textContent = ''; // Clear error message
        }
    });

    // Example: Validate on form submission
    const form = document.querySelector('form'); // Replace with your form selector
    form.addEventListener('submit', (e) => {
        if (!termsCheckbox.checked) {
            e.preventDefault();
            termsError.textContent = 'You must agree to the terms and conditions.';
        }
    });
});

function submitDetails(cardIndex) {
    const kraPin = document.getElementById(`kra-pin-${cardIndex}`).value;
    const idUpload = document.getElementById(`id-upload-${cardIndex}`).files[0];
    const contact = document.getElementById(`contact-${cardIndex}`).value;

    if (!kraPin || !idUpload || !contact) {
        alert('Please fill in all required fields.');
        return;
    }

    // Simulate sending the details via email
    const email = 'customerservice@jambotax.co.ke';
    const subject = `Service Request for Card Index ${cardIndex}`;
    const body = `KRA PIN: ${kraPin}\nContact: ${contact}\nPlease find the attached ID document.`;

    alert(`Details submitted successfully to ${email}.\nSubject: ${subject}\nBody: ${body}`);
}

function checkPaymentStatus() {
    // Replace this with actual logic to check if payment is completed
    return true; // For now, assume payment is always completed
}

function showRequiredUploads(cardIndex) {
    const requiredUploads = document.querySelector(`.service-card.card-index-${cardIndex} .required-uploads`);
    requiredUploads.classList.remove('hidden');
}

function submitDetails(cardIndex) {
    const kraPin = document.getElementById(`kra-pin-${cardIndex}`).value;
    const idUpload = document.getElementById(`id-upload-${cardIndex}`).files[0];
    const contact = document.getElementById(`contact-${cardIndex}`).value;

    if (!kraPin || !idUpload || !contact) {
        alert('Please fill in all required fields.');
        return;
    }

    // Create a FormData object to send the details
    const formData = new FormData();
    formData.append('kraPin', kraPin);
    formData.append('idUpload', idUpload);
    formData.append('contact', contact);

    // Send the details via email
fetch('https://formspree.io/f/mdkgpdnks', {
    method: 'POST',
    body: formData,
})
.then(response => {
    if (response.ok) {
        alert('Details submitted successfully!');
        // Optionally hide the container again
        const requiredUploads = document.querySelector(`.service-card.card-index-${cardIndex} .required-uploads`);
        requiredUploads.classList.add('hidden');
    } else {
        alert('Failed to submit details. Please try again.');
    }
})
.catch(error => {
    console.error('Error submitting details:', error);
    alert('An error occurred. Please try again.');
});
}

function completePayment(cardIndex) {
    // Simulate payment completion
    const paymentCompleted = true; // Replace with actual payment logic

    if (paymentCompleted) {
        showRequiredUploads(cardIndex);
        alert('Payment completed! You can now enter your details.');
    } else {
        alert('Payment not completed. Please complete the payment first.');
    }
}

function initiatePayment(phoneNumber, amount, accountReference, transactionDesc) {
    fetch('payment.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            phoneNumber: phoneNumber,
            amount: amount,
            accountReference: accountReference,
            transactionDesc: transactionDesc,
        }),
    })
        .then(response => response.text())
        .then(data => {
            alert(data); // Display the response from the PHP file
        })
        .catch(error => {
            console.error('Error initiating payment:', error);
            alert('An error occurred while initiating payment.');
        });
}

document.addEventListener('DOMContentLoaded', () => {
    const accessibilityBtn = document.getElementById('accessibility-btn');
    const accessibilityOptions = document.getElementById('accessibility-options');
    const increaseFontBtn = document.getElementById('increase-font');
    const decreaseFontBtn = document.getElementById('decrease-font');
    const toggleContrastBtn = document.getElementById('toggle-contrast');
    const resetSettingsBtn = document.getElementById('reset-settings');

    let fontSize = 16; // Default font size

    // Toggle Accessibility Options
    accessibilityBtn.addEventListener('click', () => {
        accessibilityOptions.classList.toggle('hidden');
    });

    // Increase Font Size
    increaseFontBtn.addEventListener('click', () => {
        fontSize += 2;
        document.body.style.fontSize = `${fontSize}px`;
    });

    // Decrease Font Size
    decreaseFontBtn.addEventListener('click', () => {
        if (fontSize > 12) {
            fontSize -= 2;
            document.body.style.fontSize = `${fontSize}px`;
        }
    });

    // Toggle High Contrast Mode
    toggleContrastBtn.addEventListener('click', () => {
        document.body.classList.toggle('high-contrast');
    });

    // Reset Accessibility Settings
    resetSettingsBtn.addEventListener('click', () => {
        fontSize = 16;
        document.body.style.fontSize = '';
        document.body.classList.remove('high-contrast');
    });
});

function toggleUploadsContainer() {
    const uploadsContainer = document.getElementById('uploads-container');
    uploadsContainer.classList.toggle('hidden');
}

document.getElementById('uploads-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission

    const kraPin = document.getElementById('kra-pin').value;
    const idUpload = document.getElementById('id-upload').files[0];
    const contact = document.getElementById('contact').value;

    if (!kraPin || !idUpload || !contact) {
        alert('Please fill in all required fields.');
        return;
    }

    // Simulate form submission
    alert('Documents submitted successfully!');
    document.getElementById('uploads-container').classList.add('hidden'); // Hide the container after submission
});

document.addEventListener('DOMContentLoaded', () => {
    // Redirect to Home Functionality
    const backToHomeBtn = document.getElementById('back-to-home-btn');
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', redirectToHome);
    }
});

function redirectToHome() {
    window.location.href = '#hero'; // Scroll to the hero section
}

document.addEventListener('DOMContentLoaded', function() {
    const serviceType = document.getElementById('service-type');
    if (serviceType) {
        serviceType.addEventListener('change', function() {
            // Remove previous highlights
            Array.from(serviceType.options).forEach(option => {
                option.classList.remove('selected-option');
            });
            // Highlight selected options
            Array.from(serviceType.selectedOptions).forEach(option => {
                option.classList.add('selected-option');
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const serviceType = document.getElementById('service-type');
    const serviceTypeContainer = document.getElementById('service-type-container');
    if (serviceType) {
        serviceType.addEventListener('change', function() {
            // Highlight selected options
            Array.from(serviceType.options).forEach(option => {
                option.classList.remove('selected-option');
            });
            
            const selectedOption = serviceType.options[serviceType.selectedIndex];
            selectedOption.classList.add('selected-option');

            // Remove or comment out this block:
            // if (serviceTypeContainer && selectedOption) {
            //     serviceTypeContainer.innerHTML = `
            //         <div class="selected-display">
            //             <span>Selected: ${selectedOption.text}</span>
            //         </div>
            //     `;
            // }
        });
    }
});

// Add this to your existing script.js
document.addEventListener('DOMContentLoaded', function() {
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }
});