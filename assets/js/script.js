const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
  });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

const payButtons = document.querySelectorAll('.pay-btn');
const modal = document.getElementById('payment-modal');
const closeModal = document.getElementById('modal-close');
const submitPayment = document.getElementById('submit-payment');
let currentService, currentAmount, currentMethod;

payButtons.forEach(btn => {
  btn.addEventListener('click', function() {
    currentService = this.previousElementSibling.dataset.service;
    currentAmount = this.previousElementSibling.dataset.amount;
    currentMethod = this.previousElementSibling.value;
    modal.style.display = 'block';
    document.getElementById('paypal-button-container').innerHTML = '';
  });
});

closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
  clearForm();
});

window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
    clearForm();
  }
});

function clearForm() {
  document.getElementById('payment-name').value = '';
  document.getElementById('payment-email').value = '';
  document.getElementById('payment-phone').value = '';
}

submitPayment.addEventListener('click', () => {
  const name = document.getElementById('payment-name').value;
  const email = document.getElementById('payment-email').value;
  const phone = document.getElementById('payment-phone').value;

  if (!name || !email || !phone) {
    alert('All fields are required to proceed with payment.');
    return;
  }

  const phoneRegex = /^(?:\+254|0)7\d{8}$/;
  if (!phoneRegex.test(phone)) {
    alert('Please enter a valid Kenyan phone number (e.g., +2547XXXXXXXX or 07XXXXXXXX).');
    return;
  }

  modal.style.display = 'none';
  clearForm();

  if (currentMethod === 'paypal') {
    initiatePayPalPayment(currentService, currentAmount, name, email);
  } else {
    makeFlutterwavePayment(currentService, currentAmount, currentMethod, name, email, phone);
  }
});

function makeFlutterwavePayment(service, amount, method, name, email, phone) {
  const paymentOptions = method === 'mpesa' ? 'mobilemoney' : 'card,googlepay';
  FlutterwaveCheckout({
    public_key: "FLWPUBK-XXXXXXXXXXXXXXXXXXXXXXXXX",
    tx_ref: `jambotax_${service.replace(/\s+/g, '').toLowerCase()}_${Date.now()}`,
    amount: amount,
    currency: "KES",
    payment_options: paymentOptions,
    customer: {
      email: email,
      phone_number: phone,
      name: name
    },
    customizations: {
      title: "Jambo Tax Payment",
      description: `Payment for ${service}`,
      logo: "assets/images/logo.png"
    }
  });
}

function initiatePayPalPayment(service, amount, name, email) {
  paypal.Buttons({
    createOrder: function(data, actions) {
      return actions.order.create({
        purchase_units: [{
          description: `Payment for ${service}`,
          amount: {
            currency_code: "KES",
            value: amount
          },
          payee: {
            email_address: email
          }
        }]
      });
    },
    onApprove: function(data, actions) {
      return actions.order.capture().then(function(details) {
        alert('Payment completed successfully! Transaction ID: ' + details.id);
      });
    },
    onError: function(err) {
      console.error(err);
      alert('An error occurred during the payment process. Please try again.');
    }
  }).render('#paypal-button-container');
}