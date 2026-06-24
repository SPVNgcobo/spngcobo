// Typewriter Effect (Accessibility Aware)
const phrases = ["IT Systems Engineer", "Software Developer", "Network Automator"];
let pI = 0, cI = 0, isDel = false;
const el = document.getElementById('typing-text');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function type() {
    if (prefersReducedMotion) {
        el.textContent = phrases[0]; // Fallback for motion sensitivity
        return;
    }
    
    const curr = phrases[pI];
    el.textContent = isDel ? curr.substring(0, cI - 1) : curr.substring(0, cI + 1);
    isDel ? cI-- : cI++;
    
    if (!isDel && cI === curr.length) {
        isDel = true;
        setTimeout(type, 2000);
    } else if (isDel && cI === 0) {
        isDel = false;
        pI = (pI + 1) % phrases.length;
        setTimeout(type, 500);
    } else {
        setTimeout(type, isDel ? 50 : 100);
    }
}
type();

// Scroll Reveal
const reveal = () => {
    const els = document.querySelectorAll('.reveal');
    els.forEach(el => {
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight - 100) el.classList.add('active');
    });
};
window.addEventListener('scroll', reveal, { passive: true });
reveal();

// Nav Scroll
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// Hamburger (ARIA compliant)
const ham = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
ham.addEventListener('click', () => {
    const isActive = navLinks.classList.toggle('active');
    ham.setAttribute('aria-expanded', isActive);
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const t = document.querySelector(a.getAttribute('href'));
        if (t) {
            t.scrollIntoView({ behavior: 'smooth' });
            navLinks.classList.remove('active');
            ham.setAttribute('aria-expanded', 'false');
        }
    });
});

// Particle System (Performance & Accessibility Handled)
const canvas = document.getElementById('particles-canvas');
if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    class Particle {
        constructor() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.r = Math.random() * 2 + 1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > w) this.vx *= -1;
            if (this.y < 0 || this.y > h) this.vy *= -1;
        }
        draw() {
            ctx.fillStyle = 'rgba(0, 217, 255, 0.6)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const particles = Array.from({ length: 80 }, () => new Particle());

    function animate() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach((p, i) => {
            p.update();
            p.draw();
            for (let j = i + 1; j < particles.length; j++) {
                const dx = p.x - particles[j].x;
                const dy = p.y - particles[j].y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 217, 255, ${0.2 * (1 - d / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        });
        requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    });
}

// Native Mailto Contact Form Handler (Zero Dependency)
const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // HTML5 Validation check
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Opening Client...</span>';
    submitBtn.disabled = true;
    
    // Extract & Encode Values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const company = document.getElementById('company').value.trim();
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value.trim();
    
    const toEmail = "s.p.ngcobo@outlook.com";
    const emailSubject = encodeURIComponent(`Portfolio Contact: ${subject} from ${name}`);
    const emailBody = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nCompany: ${company || 'Not provided'}\n\nMessage:\n${message}`
    );
    
    const mailtoLink = `mailto:${toEmail}?subject=${emailSubject}&body=${emailBody}`;
    
    // Success UX State
    formStatus.className = 'form-status success';
    formStatus.innerHTML = `✓ Opening your default email client...<br><span style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-top: 8px;">If it didn't open automatically, email me directly at: <strong>${toEmail}</strong></span>`;
    formStatus.style.display = 'block';
    
    // Trigger native client
    window.location.href = mailtoLink;
    
    // Reset UI
    setTimeout(() => {
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
});
