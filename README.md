Jambo Tax
Jambo Tax is a modern, user-friendly platform offering fast, reliable, and affordable tax filing services for Kenyan individuals and businesses. Our mission is to simplify tax compliance with an intuitive online interface, expert support, and secure payment options.
Features

Services: Individual Tax Filing (PAYE), Business Tax Filing, VAT Returns, HELB/KRA Compliance Certificates, and Tax Consultancy & Training.
Payment Gateway: Supports Mpesa, PayPal, and Bank Transfer/Card/Gpay via Flutterwave and PayPal SDK.
Responsive Design: Optimized for desktop and mobile devices.
SEO Optimized: Includes meta tags for better search engine visibility.
Payment Modal: User-friendly modal for entering payment details with Kenyan phone number validation.

Project Structure
jambotax/
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── script.js
│   └── images/
│       ├── logo.png
│       └── hero.jpg
├── index.html
├── about.html
├── index.html
├── Privacy Policy.html
├── script.js
├── style.css
├── README.md
└── .gitignore

Setup Instructions

Clone the Repository:git clone <repository-url>
cd jambotax


Serve the Project:
Use a local server (e.g., python -m http.server or VS Code Live Server) to view the website.
Ensure assets/images/logo.png and assets/images/hero.jpg are present or update paths accordingly.


Payment Gateway Configuration:
Flutterwave: Replace FLWPUBK-XXXXXXXXXXXXXXXXXXXXXXXXX in assets/js/script.js with your Flutterwave public key (https://flutterwave.com/).
PayPal: Replace TEST_CLIENT_ID in services.html with your PayPal client ID (https://developer.paypal.com/).
Test payments in sandbox mode before going live.


Deploy:
Host on platforms like Webflow, Netlify, or Vercel.
Ensure HTTPS is enabled for secure payment processing.



Payment Integration

Mpesa: Handled via Flutterwave’s mobile money option, popular in Kenya for seamless mobile payments.
PayPal: Integrated using PayPal JavaScript SDK for international transactions.
Bank Transfer/Card/Gpay: Processed via Flutterwave’s card and Google Pay options, supporting Visa, Mastercard, and digital wallets.
Modal UI: Payment details are collected via a modal with input validation for Kenyan phone numbers (format: +2547XXXXXXXX or 07XXXXXXXX).

Future Enhancements

Backend Integration: Add a backend (e.g., Node.js, Firebase) to store payment confirmations and transaction details for better tracking and reporting.
Improved Payment UI: Enhance the modal with advanced styling, animations, or additional input fields (e.g., order notes).
Phone Number Validation: Expand validation to support other formats or integrate with APIs for real-time verification.

Development

Dependencies: No build tools required; uses vanilla HTML/CSS/JS.
Styles: style.css uses the Inter font and a clean, modern design.
Scripts: script.js handles smooth scrolling, back-to-top, payment modal, and payment processing.

Contributing

Fork the repository.
Create a feature branch (git checkout -b feature-name).
Commit changes (git commit -m "Add feature").
Push to the branch (git push origin feature-name).
Open a pull request.

License
© 2025 Jambo Tax. All rights reserved. See privacy.html and terms.html for policies.
Contact

Email: support@jambotax.co.ke
Phone: +254 702 359 618
Address: 123 Tax House, Nairobi, Kenya

