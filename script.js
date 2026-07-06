// ── TERMINAL BOOT SEQUENCE (Accessibility Hardened) ──
const lines = [
  { type: 'cmd',   text: 'whoami' },
  { type: 'out',   text: 'snethemba-promise-ngcobo', cls: 'hi' },
  { type: 'blank' },
  { type: 'cmd',   text: 'cat profile.json' },
  { type: 'out',   text: '{', cls: '' },
  { type: 'out',   text: '  "role":       "Junior IT Tech & Developer",', cls: 'purple' },
  { type: 'out',   text: '  "location":   "Hlabisa, KZN",', cls: '' },
  { type: 'out',   text: '  "ships":      "without being asked",', cls: 'warn' },
  { type: 'out',   text: '  "status":     "available"', cls: 'ok' },
  { type: 'out',   text: '}', cls: '' },
  { type: 'blank' },
  { type: 'cmd',   text: 'ls ./projects' },
  { type: 'out',   text: 'ENSAT/  EnsEmulator/  Network-Automation/', cls: 'hi' },
  { type: 'out',   text: 'Zaziza-Nexus/  B-BBEE-Automation/  IoT-Monitoring/', cls: 'hi' },
  { type: 'blank' },
  { type: 'cmd',   text: 'contact --reach-out' },
  { type: 'out',   text: 's.p.ngcobo@outlook.com', cls: 'ok' },
  { type: 'cursor' },
];

const body = document.getElementById('terminal-body');
let li = 0;
const delays = { cmd: 60, out: 30, blank: 200, cursor: 0 };
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function nextLine() {
  if (li >= lines.length) return;
  const l = lines[li++];

  if (l.type === 'blank') {
    const d = document.createElement('div'); 
    d.className = 't-blank'; 
    body.appendChild(d);
  } else if (l.type === 'cursor') {
    const d = document.createElement('div'); 
    d.className = 't-line';
    d.innerHTML = '<span class="t-prompt">$</span><span class="t-cursor"></span>';
    body.appendChild(d); 
    return;
  } else if (l.type === 'cmd') {
    const d = document.createElement('div'); 
    d.className = 't-line';
    d.innerHTML = `<span class="t-prompt">$</span><span class="t-cmd"></span>`;
    body.appendChild(d);
    
    if (prefersReducedMotion) {
      d.querySelector('.t-cmd').textContent = l.text;
      setTimeout(nextLine, 10); 
      return;
    } else {
      const span = d.querySelector('.t-cmd'); 
      let ci = 0;
      const typer = setInterval(() => {
        span.textContent += l.text[ci++];
        if (ci >= l.text.length) { 
          clearInterval(typer); 
          setTimeout(nextLine, 120); 
        }
      }, delays.cmd); 
      return;
    }
  } else {
    const d = document.createElement('div');
    d.className = `t-out${l.cls ? ' ' + l.cls : ''}`; 
    d.textContent = l.text;
    body.appendChild(d);
  }

  body.scrollTop = body.scrollHeight;
  const wait = prefersReducedMotion ? 10 : (l.type === 'blank' ? delays.blank : delays.out * l.text.length * 0.3 + 80);
  setTimeout(nextLine, Math.min(wait, 300));
}

setTimeout(nextLine, prefersReducedMotion ? 100 : 600);

// ── NAVBAR & SCROLL MANAGEMENT ──
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navAnchors = navLinks.querySelectorAll('a');

// Scroll event
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// Hamburger menu toggle
hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('active');
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close menu when link clicked
navAnchors.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    hamburger.setAttribute('aria-expanded', false);
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── SCROLL REVEAL (Intersection Observer) ──
const revealElements = document.querySelectorAll('.reveal');
const revealOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, revealOptions);

revealElements.forEach(el => observer.observe(el));

// ── SKILL TABS (Vanilla JS) ──
const skillButtons = document.querySelectorAll('.skill-nav-item');
const skillPanes = document.querySelectorAll('.skill-pane');

skillButtons.forEach(button => {
  button.addEventListener('click', () => {
    const skillType = button.getAttribute('data-skill');
    
    // Remove active from all buttons and panes
    skillButtons.forEach(b => b.classList.remove('active'));
    skillPanes.forEach(p => p.classList.remove('active'));
    
    // Add active to clicked button and matching pane
    button.classList.add('active');
    document.querySelector(`.skill-pane[data-skill="${skillType}"]`)?.classList.add('active');
  });
});

// ── EXPERIENCE ACCORDION ──
const expCards = document.querySelectorAll('.exp-card');

expCards.forEach(card => {
  const header = card.querySelector('.exp-head');
  header.addEventListener('click', () => {
    card.classList.toggle('open');
  });
});

// ── CONTACT FORM (Option A: mailto) ──
const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // HTML5 Validation
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  
  // Extract values
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const company = document.getElementById('company').value.trim();
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value.trim();
  
  // Build mailto link
  const toEmail = 's.p.ngcobo@outlook.com';
  const mailtoSubject = encodeURIComponent(`Portfolio Contact: ${subject} from ${name}`);
  const mailtoBody = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\nCompany: ${company || 'Not provided'}\n\nMessage:\n${message}`
  );
  
  const mailtoLink = `mailto:${toEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;
  
  // Show success status
  formStatus.className = 'form-status success';
  formStatus.innerHTML = '✓ Opening your email client...';
  formStatus.style.display = 'block';
  
  // Trigger mailto
  window.location.href = mailtoLink;
  
  // Reset form
  setTimeout(() => {
    form.reset();
    formStatus.style.display = 'none';
  }, 1500);
});