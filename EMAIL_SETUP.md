// ── EMAILJS INITIALIZATION ──
// Ensure you have included the EmailJS script in your <head>:
// <script defer src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/index.min.js"></script>

(function() {
    // Replace with your actual Public Key from Account Settings > API
    emailjs.init("YOUR_PUBLIC_KEY_HERE"); 
})();

// ── BACKGROUND CONTACT FORM HANDLER ──
const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // 1. Native HTML5 Validation Check
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // 2. Extract and Sanitize Values
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        company: document.getElementById('company').value.trim(),
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value.trim()
    };
    
    // 3. Trigger Loading State
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Sending...</span>';
    submitBtn.disabled = true;
    formStatus.style.display = 'none'; // Clear any previous status
    
    try {
        // 4. Send Payload via EmailJS API
        const response = await emailjs.send(
            "YOUR_SERVICE_ID_HERE",   // Replace with your actual Service ID
            "YOUR_TEMPLATE_ID_HERE",  // Replace with your actual Template ID
            {
                to_email: "s.p.ngcobo@outlook.com",
                from_name: formData.name,
                from_email: formData.email,
                company: formData.company || "Not provided",
                subject: formData.subject,
                message: formData.message,
                reply_to: formData.email
            }
        );
        
        // 5. Success UX State
        formStatus.className = 'form-status success';
        formStatus.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
        formStatus.style.display = 'block';
        
        // 6. Reset Form & Button
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // 7. Auto-Hide Success Message
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 5000);
        
    } catch (error) {
        // 8. Error UX State
        formStatus.className = 'form-status error';
        formStatus.textContent = '✗ Failed to send message. Please check your connection or email me directly.';
        formStatus.style.display = 'block';
        
        // Reset Button to allow retry
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        console.error('EmailJS Execution Error:', error);
    }
});
 
