/* ============================================================
   NAVIGATION — scroll state + mobile hamburger
   ============================================================ */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');
const navLinks  = document.querySelectorAll('.nav-menu a');

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
   ACTIVE NAV HIGHLIGHT — throttled via requestAnimationFrame
   ============================================================ */
let rafPending = false;

window.addEventListener('scroll', () => {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);

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
            const isActive = href === '#' + current;
            link.classList.toggle('active', isActive);
            if (isActive) {
                link.setAttribute('aria-current', 'true');
            } else {
                link.removeAttribute('aria-current');
            }
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

document.querySelectorAll('.fade-in').forEach(el => {
    el.classList.add('fade-in-armed');
    observer.observe(el);
});

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
    if (!navigator.clipboard) {
        showToast('Could not copy — try manually');
        return;
    }
    navigator.clipboard.writeText(text)
        .then(() => showToast(`${label} copied`))
        .catch(() => showToast('Could not copy — try manually'));
}

/* ============================================================
   INIT — DOMContentLoaded
   FIX: type each name span sequentially to preserve the <br>
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    const line1 = document.querySelector('.hero-line-1');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (line1 && !prefersReducedMotion) {
        setTimeout(() => typeWriter(line1, 'Kiattiphan Wareerak', 55), 600);
    }
});

/* ============================================================
   BODY REVEAL — waits for all assets
   ============================================================ */
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

/* ============================================================
   MODAL HELPERS — shared inert-based focus containment.
   Everything outside the active modal goes inert while it's open, so
   focus and screen readers can't reach hidden page content — and the
   modal itself goes inert while closed, so it's never a hidden tab stop.
   ============================================================ */
function setBackgroundInert(activeModal, isInert) {
    [...document.body.children].forEach(el => {
        if (el === activeModal || el.tagName === 'SCRIPT') return;
        el.inert = isInert;
    });
}

function openModal(modal, focusEl) {
    modal.removeAttribute('inert');
    setBackgroundInert(modal, true);
    modal.classList.add('open');
    focusEl.focus();
}

function closeModal(modal, restoreFocusEl) {
    modal.classList.remove('open');
    setBackgroundInert(modal, false);
    modal.setAttribute('inert', '');
    restoreFocusEl.focus();
}

/* ============================================================
   RESUME PICKER MODAL
   ============================================================ */
const resumeModal     = document.getElementById('resumeModal');
const resumePickerBtn = document.getElementById('resumePickerBtn');
const resumeModalClose = document.getElementById('resumeModalClose');

resumePickerBtn.addEventListener('click', () => openModal(resumeModal, resumeModalClose));

function closeResumeModal() {
    closeModal(resumeModal, resumePickerBtn);
}

resumeModalClose.addEventListener('click', closeResumeModal);
resumeModal.addEventListener('click', e => {
    if (e.target === resumeModal) closeResumeModal();
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && resumeModal.classList.contains('open')) closeResumeModal();
});

/* ============================================================
   PROJECT DETAILS MODAL
   ============================================================ */
const projectModal             = document.getElementById('projectModal');
const projectModalClose        = document.getElementById('projectModalClose');
const projectModalTitle        = document.getElementById('projectModalTitle');
const projectModalGallery      = document.getElementById('projectModalGallery');
const projectModalObjective    = document.getElementById('projectModalObjective');
const projectModalArchitecture = document.getElementById('projectModalArchitecture');

/* Hotel Booking System has no frontend yet, so its "preview" is a generated
   system-design diagram instead of a screenshot. Inline (not a data-URI
   image) so it inherits the page's fonts and color tokens. */
const hotelDiagramSVG = `
<svg viewBox="0 0 640 300" role="img" aria-label="Architecture diagram: an API Gateway routes to Auth, Booking, and Payment services, all backed by one PostgreSQL instance split into three schemas.">
    <style>
        .node-box { fill: var(--accent-bg); stroke: var(--accent); stroke-width: 1.5; }
        .node-label { fill: var(--ink); font-family: var(--font-display); font-weight: 600; font-size: 15px; }
        .node-sub { fill: var(--ink-muted); font-family: var(--font-body); font-size: 11px; }
        .db-box { fill: var(--ink); }
        .db-label { fill: #fff; font-family: var(--font-display); font-weight: 600; font-size: 15px; }
        .db-sub { fill: rgba(255,255,255,0.65); font-family: var(--font-body); font-size: 11px; }
        .diagram-line { stroke: var(--border); stroke-width: 1.5; }
    </style>
    <line class="diagram-line" x1="320" y1="70" x2="110" y2="110"/>
    <line class="diagram-line" x1="320" y1="70" x2="320" y2="110"/>
    <line class="diagram-line" x1="320" y1="70" x2="530" y2="110"/>
    <line class="diagram-line" x1="110" y1="160" x2="110" y2="220"/>
    <line class="diagram-line" x1="320" y1="160" x2="320" y2="220"/>
    <line class="diagram-line" x1="530" y1="160" x2="530" y2="220"/>

    <rect class="node-box" x="220" y="20" width="200" height="50" rx="10"/>
    <text class="node-label" x="320" y="42" text-anchor="middle">API Gateway</text>
    <text class="node-sub" x="320" y="58" text-anchor="middle">:4000 · JWT + rate limit</text>

    <rect class="node-box" x="20" y="110" width="180" height="50" rx="10"/>
    <text class="node-label" x="110" y="132" text-anchor="middle">Auth Service</text>
    <text class="node-sub" x="110" y="148" text-anchor="middle">:4010</text>

    <rect class="node-box" x="230" y="110" width="180" height="50" rx="10"/>
    <text class="node-label" x="320" y="132" text-anchor="middle">Booking Service</text>
    <text class="node-sub" x="320" y="148" text-anchor="middle">:4020</text>

    <rect class="node-box" x="440" y="110" width="180" height="50" rx="10"/>
    <text class="node-label" x="530" y="132" text-anchor="middle">Payment Service</text>
    <text class="node-sub" x="530" y="148" text-anchor="middle">:4030</text>

    <rect class="db-box" x="60" y="220" width="520" height="60" rx="10"/>
    <text class="db-label" x="320" y="248" text-anchor="middle">PostgreSQL 16</text>
    <text class="db-sub" x="320" y="266" text-anchor="middle">schemas: auth · booking · payment</text>
</svg>`;

const projectDetails = {
    boothbooth: {
        title: 'BoothBooth',
        images: [
            { src: './img/boothbooth%20preview/POS%20page.png', alt: 'BoothBooth point-of-sale screen for recording a booth sale' },
            { src: './img/boothbooth%20preview/Booth%20Inventory.png', alt: 'BoothBooth inventory view for a single booth' },
            { src: './img/boothbooth%20preview/Warehouse%20Stock.png', alt: 'BoothBooth warehouse stock overview' },
            { src: './img/boothbooth%20preview/Daily%20sales.png', alt: 'BoothBooth daily sales dashboard' },
            { src: './img/boothbooth%20preview/Log-in%20page.png', alt: 'BoothBooth login page' }
        ],
        objective: 'Booth staff at expos and markets were tracking inventory by hand, which meant restocking delays and no real-time view into what was selling. BoothBooth gives owners live visibility across every booth while staff manage sales and stock from their own device.',
        architecture: 'A three-tier containerized setup: an nginx-served React frontend proxies to a Fastify API, which writes to PostgreSQL through two least-privilege database roles — one for migrations, one for the app itself. Sales are recorded as an immutable, append-only ledger, so stock is always derived from real transactions, never edited directly.'
    },
    monie: {
        title: 'Monie — Skincare Routine Helper',
        images: [
            { src: './img/Monie%20preview/Home%20page.png', alt: 'Monie home page' },
            { src: './img/Monie%20preview/Plan%20page.png', alt: 'Monie AM/PM routine planner' },
            { src: './img/Monie%20preview/Learn%20page%20top.png', alt: 'Monie ingredient learning page, top section' },
            { src: './img/Monie%20preview/Learn%20page%20bot.png', alt: 'Monie ingredient learning page, bottom section' }
        ],
        objective: "Skincare beginners don't know what their ingredients actually do, which ones clash, or in what order to apply them — getting it wrong can undo the routine entirely. Monie answers all three: ingredient education, a routine builder, and real-time compatibility warnings.",
        architecture: 'A React SPA talks to an Express/TypeScript API over a versioned REST surface for sessions, products, routines, and ingredients. Anonymous JWT sessions mean no signup friction. At the core is a compatibility engine that flags risky pairings — like Retinol with Vitamin C — before a routine gets saved.'
    },
    hotel: {
        title: 'Hotel Booking System',
        diagram: hotelDiagramSVG,
        objective: "Naive booking systems let two customers reserve the same room at the same time if their requests land close enough together. This project removes that risk entirely by enforcing the booking constraint at the database layer, not the application layer, so it can't happen no matter how many requests arrive at once.",
        architecture: "Four services on a private Docker network: an API Gateway handling JWT verification and rate limiting, with separate Auth, Booking, and Payment services behind it. All four share one PostgreSQL instance split into three schemas. The key piece is a PostgreSQL exclusion constraint on the booking schema — it makes overlapping reservations for the same room impossible at the engine level, even under concurrent load. There's no frontend yet, so this is the system as designed."
    }
};

let lastProjectTrigger = null;

function openProjectModal(key, triggerBtn) {
    const data = projectDetails[key];
    if (!data) return;

    lastProjectTrigger = triggerBtn;
    projectModalTitle.textContent = data.title;
    projectModalObjective.textContent = data.objective;
    projectModalArchitecture.textContent = data.architecture;

    projectModalGallery.innerHTML = '';
    if (data.diagram) {
        projectModalGallery.insertAdjacentHTML('beforeend', data.diagram);
    } else if (data.images) {
        data.images.forEach(img => {
            const el = document.createElement('img');
            el.src = img.src;
            el.alt = img.alt;
            el.loading = 'lazy';
            projectModalGallery.appendChild(el);
        });
    }

    openModal(projectModal, projectModalClose);
}

function closeProjectModal() {
    closeModal(projectModal, lastProjectTrigger || document.body);
}

document.querySelectorAll('.project-details-btn').forEach(btn => {
    btn.addEventListener('click', () => openProjectModal(btn.dataset.project, btn));
});

projectModalClose.addEventListener('click', closeProjectModal);
projectModal.addEventListener('click', e => {
    if (e.target === projectModal) closeProjectModal();
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && projectModal.classList.contains('open') && !lightbox.classList.contains('open')) {
        closeProjectModal();
    }
});

/* ============================================================
   IMAGE LIGHTBOX — nested inside the project modal, so it only
   needs to inert its one sibling (the modal card) rather than
   re-running the whole-page inert scheme.
   ============================================================ */
const lightbox         = document.getElementById('lightbox');
const lightboxImg      = document.getElementById('lightboxImg');
const lightboxClose    = document.getElementById('lightboxClose');
const projectModalCard = document.querySelector('.project-modal-card');
let lightboxLastTrigger = null;

function openLightbox(imgEl) {
    lightboxLastTrigger = imgEl;
    lightboxImg.src = imgEl.src;
    lightboxImg.alt = imgEl.alt;
    projectModalCard.inert = true;
    lightbox.removeAttribute('inert');
    lightbox.classList.add('open');
    lightboxClose.focus();
}

function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('inert', '');
    projectModalCard.inert = false;
    if (lightboxLastTrigger) lightboxLastTrigger.focus();
}

projectModalGallery.addEventListener('click', e => {
    const img = e.target.closest('img');
    if (img) openLightbox(img);
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
});