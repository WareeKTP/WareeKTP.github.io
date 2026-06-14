/* ============================================================
   NAVIGATION — scroll state + mobile hamburger
   ============================================================ */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');
const navLinks  = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navMenu.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ============================================================
   ACTIVE NAV HIGHLIGHT — throttled via requestAnimationFrame
   ============================================================ */
let rafPending = false;

window.addEventListener('scroll', () => {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
        const sections = document.querySelectorAll('section[id]');
        let current = '';

        sections.forEach(section => {
            const top    = section.offsetTop - 220;
            const bottom = top + section.offsetHeight;
            if (window.scrollY >= top && window.scrollY < bottom) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === '#' + current);
        });

        rafPending = false;
    });
}, { passive: true });

/* ============================================================
   FADE-IN ON SCROLL — IntersectionObserver
   ============================================================ */
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const delay = entry.target.closest('.projects-grid')
                ? [...entry.target.parentNode.children].indexOf(entry.target) * 80
                : 0;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -48px 0px'
});

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

/* ============================================================
   TYPING EFFECT — FIX: targets each hero line span separately
   so the <br> between names is preserved in the DOM
   ============================================================ */
function typeWriter(element, text, speed = 80) {
    const chars = [...text];
    let i = 0;
    element.textContent = '';
    element.style.borderRight = '2px solid rgba(255,255,255,0.7)';

    function type() {
        if (i < chars.length) {
            element.textContent += chars[i];
            i++;
            setTimeout(type, speed);
        } else {
            setTimeout(() => {
                element.style.borderRight = 'none';
            }, 900);
        }
    }
    type();
}

/* ============================================================
   TOAST NOTIFICATION
   ============================================================ */
let toastTimer = null;

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

/* ============================================================
   CLIPBOARD HELPERS
   ============================================================ */
function copyToClipboard(text, label) {
    navigator.clipboard.writeText(text)
        .then(() => showToast(`${label} copied`))
        .catch(() => showToast('Could not copy — try manually'));
}

/* ============================================================
   SKILL TAG — subtle hover tilt
   ============================================================ */
document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', () => {
        tag.style.transform = 'translateY(-2px) rotate(2deg)';
    });
    tag.addEventListener('mouseleave', () => {
        tag.style.transform = '';
    });
});

/* ============================================================
   INIT — DOMContentLoaded
   FIX: type each name span sequentially to preserve the <br>
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    const line1 = document.querySelector('.hero-line-1');
    if (line1) {
        setTimeout(() => typeWriter(line1, 'Kiattiphan Wareerak', 55), 600);
    }
});

/* ============================================================
   BODY REVEAL — waits for all assets
   ============================================================ */
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});