// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Active navigation highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// Animated particles background
function createParticles() {
    const hero = document.querySelector('.hero');
    const particlesContainer = document.createElement('div');
    particlesContainer.classList.add('particles');
    hero.appendChild(particlesContainer);

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Typing effect for hero text
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    element.style.borderRight = '2px solid white';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            setTimeout(() => {
                element.style.borderRight = 'none';
            }, 1000);
        }
    }
    type();
}

// Floating icons animation
function createFloatingIcons() {
    const about = document.querySelector('.about');
    const icons = ['💻', '🚀', '⚡', '🎨', '📊', '🔧'];
    
    icons.forEach((icon, index) => {
        const floatingIcon = document.createElement('div');
        floatingIcon.classList.add('floating-icon');
        floatingIcon.textContent = icon;
        floatingIcon.style.left = Math.random() * 100 + '%';
        floatingIcon.style.animationDelay = (index * 2) + 's';
        about.appendChild(floatingIcon);
    });
}

// Skill tags animation on hover
function animateSkills() {
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            tag.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        tag.addEventListener('mouseleave', () => {
            tag.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// Project cards staggered animation
function staggerProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.animationDelay = (index * 0.2) + 's';
        card.classList.add('slide-in');
    });
}

// Progress bars for skills (if you want to add them)
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const progress = bar.getAttribute('data-progress');
                bar.style.width = progress + '%';
            }
        });
    });

    progressBars.forEach(bar => progressObserver.observe(bar));
}

// Initialize all animations when page loads
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    createFloatingIcons();
    animateSkills();
    staggerProjectCards();
    
    // Typing effect for hero title
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero h1');
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 150);
    }, 1000);
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

function copyEmailToClipboard() {
    const text = "waree.kiattiphan@gmail.com";
    navigator.clipboard.writeText(text).then(function() {
        console.log('Text copied successfully!');
        // Optional: show alert or custom message
        alert('Copied: ' + text);
    }).catch(function(err) {
        console.error('Failed to copy: ', err);
    });
}

function copyPhoneToClipboard() {
    const text = "064-197-2727";
    navigator.clipboard.writeText(text).then(function() {
        console.log('Text copied successfully!');
        // Optional: show alert or custom message
        alert('Copied: ' + text);
    }).catch(function(err) {
        console.error('Failed to copy: ', err);
    });
}
