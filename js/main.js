// KAELEN SONG PORTFOLIO - MAIN INTERACTIONS

// =============================================
// NAVIGATION - HAMBURGER MENU
// =============================================

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// =============================================
// NAVIGATION Bar Shrink on Scroll EFFECT
// =============================================

window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navigation');
    
    // Applies only to pages where navbar is fixed (skips project pages)
    if (nav && !document.body.classList.contains('project-page')) {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
});

// =============================================
// PROJECT FILTERING
// =============================================

const filterButtons = document.querySelectorAll('.filter-btn');
const projectItems = document.querySelectorAll('.project-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Filter projects
        const selectedFilter = button.getAttribute('data-filter');

        projectItems.forEach(project => {
            const projectCategory = project.getAttribute('data-category');
            const shouldShow = selectedFilter === 'all' || projectCategory === selectedFilter;

            project.classList.toggle('hidden', !shouldShow);
            project.style.display = shouldShow ? '' : 'none';
            project.style.opacity = shouldShow ? '1' : '0';

            if (shouldShow) {
                project.style.animation = 'none';
                void project.offsetWidth;
                project.style.animation = 'fadeInUp 0.8s ease-out';
            }
        });
    });
});

// =============================================
// ANIMATE ON HOVER -- PROJECT COVERS
// =============================================

document.querySelectorAll('.hover-gif').forEach(img => {
  const staticSrc = img.src;
  const gifSrc = img.getAttribute('data-hover');

  // Preload the GIF in the background so there's no lag on hover
  const preload = new Image();
  preload.src = gifSrc;

  // Swap to GIF on mouse enter
  img.addEventListener('mouseenter', () => img.src = gifSrc);
  
  // Swap back to static image on mouse leave
  img.addEventListener('mouseleave', () => img.src = staticSrc);
});


// =============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// =============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.project-item, .service-column, .social-item').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// =============================================
// SMOOTH SCROLL BEHAVIOR
// =============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// =============================================
// PAGE LOAD ANIMATIONS
// =============================================

window.addEventListener('load', () => {
    // Add animation to hero elements
    const heroLines = document.querySelectorAll('.hero-line');
    heroLines.forEach((line, index) => {
        line.style.animation = `fadeInUp 0.8s ease-out ${index * 0.1}s both`;
    });
});

// =============================================
// BUTTON HOVER EFFECTS
// =============================================

const buttons = document.querySelectorAll('.cta-button, .project-link');

buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });

    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// =============================================
// ACTIVE NAVIGATION LINK ON SCROLL
// =============================================

window.addEventListener('scroll', () => {
    let current = '';
    
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// =============================================
// SCROLL PROGRESS DOT (nav horizontal line) — smooth + ghost trail
// =============================================

const progressDot = document.querySelector('.dot');
const dotContainer = document.querySelector('.dot-container');

if (progressDot && dotContainer) {
    const GHOST_COUNT = 4;      // number of trailing echo dots
    const TRAIL_SPACING = 6;    // frames of history between each ghost (higher = longer tail)
    const SMOOTHING = 0.09;     // lower = the dot lags/eases more before catching up
    const IDLE_DELAY = 500;     // ms of no scrolling before ghosts start fading out
    const FADE_SPEED = 0.04;    // lower = slower fade in/out
    const MAX_GHOST_SIZE = 12;   // px, size of the nearest (first) ghost
    const MIN_GHOST_SIZE = 3;   // px, size of the farthest (last) ghost

    // Build the ghost trail elements once, remembering each one's full-strength opacity.
    // Ghosts shrink the farther back in the trail they sit, to read as "distance."
    const ghosts = [];
    for (let i = 0; i < GHOST_COUNT; i++) {
        const ghost = document.createElement('div');
        ghost.className = 'dot-ghost';

        const sizeRatio = GHOST_COUNT > 1 ? 1 - i / (GHOST_COUNT - 1) : 1;
        const size = MIN_GHOST_SIZE + (MAX_GHOST_SIZE - MIN_GHOST_SIZE) * sizeRatio;
        ghost.style.width = `${size}px`;
        ghost.style.height = `${size}px`;
        ghost.style.top = `${-9 - size / 2}px`; //keep centered on line

        const baseOpacity = (1 - (i + 1) / (GHOST_COUNT + 1)) * 0.8;
        ghost.dataset.baseOpacity = baseOpacity;
        ghost.style.opacity = 0; // start invisible; fades in as soon as scrolling begins
        dotContainer.appendChild(ghost);
        ghosts.push(ghost);
    }

    let currentPercent = 0;
    let lastScrollTop = null;
    let lastScrollTime = Date.now();
    let ghostFade = 0; // 0 = fully hidden, 1 = full strength
    const history = [];
    const maxHistory = GHOST_COUNT * TRAIL_SPACING + 1;

    // Section -> dot color. Uses the accent palette already defined in :root.
    const SECTION_COLORS = {
        hero: 'var(--color-mint)',
        'motion-reel': 'var(--color-text)',
        work: 'var(--accent-lime)',
        'what-i-do': 'var(--accent-coral)',
        social: 'var(--accent-blue)',
        about: 'var(--accent-yellow)',
        contact: 'var(--accent-bg)'
    };
    const trackedSections = document.querySelectorAll('section[id]');
    let lastSectionId = null;
 
    function updateDotColor() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let current = null;
        trackedSections.forEach(section => {
            if (scrollTop >= section.offsetTop - 200) {
                current = section.id;
            }
        });
        if (current && current !== lastSectionId) {
            lastSectionId = current;
            document.documentElement.style.setProperty(
                '--dot-color',
                SECTION_COLORS[current] || 'var(--color-text)'
            );
            console.log(`Dot color updated to ${SECTION_COLORS[current] || 'var(--color-text)'} for section ${current}`);
        }
    }

    function getScrollPercent() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        return docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    }

    function animate() {
        const targetPercent = getScrollPercent();

        // Only count it as "scrolling" if the position actually moved
        if (lastScrollTop === null || Math.abs(targetPercent - lastScrollTop) > 0.001) {
            lastScrollTime = Date.now();
        }
        lastScrollTop = targetPercent;

        currentPercent += (targetPercent - currentPercent) * SMOOTHING;
        if (Math.abs(targetPercent - currentPercent) < 0.01) {
            currentPercent = targetPercent;
        }

        progressDot.style.left = `${currentPercent}%`;
        updateDotColor();

        history.unshift(currentPercent);
        if (history.length > maxHistory) history.length = maxHistory;

        // Fade ghosts out once we've been idle for IDLE_DELAY, fade back in on scroll
        const idle = Date.now() - lastScrollTime > IDLE_DELAY;
        const fadeTarget = idle ? 0 : 1;
        ghostFade += (fadeTarget - ghostFade) * FADE_SPEED;
        if (Math.abs(fadeTarget - ghostFade) < 0.01) ghostFade = fadeTarget;

        ghosts.forEach((ghost, i) => {
            const idx = (i + 1) * TRAIL_SPACING;
            const pos = history[idx] !== undefined ? history[idx] : history[history.length - 1];
            ghost.style.left = `${pos}%`;
            ghost.style.opacity = parseFloat(ghost.dataset.baseOpacity) * ghostFade;
        });

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

// =============================================
// PREVENT LAYOUT SHIFT ON SCROLL
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    // Force scrollbar to always show to prevent layout shift
    document.documentElement.style.scrollbarGutter = 'stable';
});