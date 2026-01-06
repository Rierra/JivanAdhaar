/* ============================================
   Jeevan Adhaar - JavaScript Functionality
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
    initCarousel();
    initNewsTicker();
    initMobileMenu();
    initAccessibility();
    initDarkMode();
    initSmoothScroll();
    initTestimonials();
    initVolunteerForm();
    animateCounter();
});

/* ============================================
   Image Carousel
   ============================================ */
function initCarousel() {
    const track = document.getElementById('carousel-track');
    const dotsContainer = document.getElementById('carousel-dots');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');

    if (!track) return;

    const slides = track.querySelectorAll('.carousel-slide');
    if (slides.length === 0) return;

    let currentIndex = 0;
    let autoPlayInterval;
    const slideCount = slides.length;
    const autoPlayDelay = 5000;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.carousel-dot');

    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateDots();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slideCount;
        goToSlide(currentIndex);
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + slideCount) % slideCount;
        goToSlide(currentIndex);
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
    }

    function stopAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoPlay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoPlay(); });

    track.addEventListener('mouseenter', stopAutoPlay);
    track.addEventListener('mouseleave', startAutoPlay);

    // Touch support
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; stopAutoPlay(); }, { passive: true });
    track.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide();
        startAutoPlay();
    }, { passive: true });

    startAutoPlay();
}

/* ============================================
   News Ticker
   ============================================ */
function initNewsTicker() {
    const tickerContent = document.getElementById('ticker-content');
    if (!tickerContent) return;

    tickerContent.innerHTML += tickerContent.innerHTML;

    tickerContent.addEventListener('mouseenter', () => tickerContent.style.animationPlayState = 'paused');
    tickerContent.addEventListener('mouseleave', () => tickerContent.style.animationPlayState = 'running');
}

/* ============================================
   Mobile Menu
   ============================================ */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');

    if (!menuBtn || !mainNav) return;

    menuBtn.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        menuBtn.classList.toggle('active');
    });

    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
            menuBtn.classList.remove('active');
        });
    });
}

/* ============================================
   Accessibility Controls
   ============================================ */
function initAccessibility() {
    const fontDecrease = document.getElementById('font-decrease');
    const fontReset = document.getElementById('font-reset');
    const fontIncrease = document.getElementById('font-increase');

    const fontSizes = ['font-small', '', 'font-large', 'font-xlarge'];
    let currentFontIndex = parseInt(localStorage.getItem('ja-font-size') || '1');

    if (fontSizes[currentFontIndex]) document.body.classList.add(fontSizes[currentFontIndex]);

    function updateFontSize(newIndex) {
        fontSizes.forEach(cls => { if (cls) document.body.classList.remove(cls); });
        currentFontIndex = Math.max(0, Math.min(fontSizes.length - 1, newIndex));
        if (fontSizes[currentFontIndex]) document.body.classList.add(fontSizes[currentFontIndex]);
        localStorage.setItem('ja-font-size', currentFontIndex);
    }

    if (fontDecrease) fontDecrease.addEventListener('click', () => updateFontSize(currentFontIndex - 1));
    if (fontReset) fontReset.addEventListener('click', () => updateFontSize(1));
    if (fontIncrease) fontIncrease.addEventListener('click', () => updateFontSize(currentFontIndex + 1));
}

/* ============================================
   Dark Mode
   ============================================ */
function initDarkMode() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (!darkModeToggle) return;

    // Check saved preference or system preference
    const savedMode = localStorage.getItem('ja-dark-mode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedMode === 'true' || (savedMode === null && prefersDark)) {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = 'Light Mode';
        darkModeToggle.classList.add('active');
    }

    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        darkModeToggle.textContent = isDark ? 'Light Mode' : 'Dark Mode';
        darkModeToggle.classList.toggle('active', isDark);
        localStorage.setItem('ja-dark-mode', isDark);
    });
}

/* ============================================
   Smooth Scroll Navigation
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.main-header')?.offsetHeight || 0;
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.pageYOffset - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   Testimonials Slider
   ============================================ */
function initTestimonials() {
    const track = document.querySelector('.testimonial-track');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');

    if (!track) return;

    const cards = track.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    const visibleCards = window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1;
    const maxIndex = Math.max(0, cards.length - visibleCards);

    function updateSlider() {
        const cardWidth = cards[0]?.offsetWidth || 300;
        const gap = 12;
        track.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`;
    }

    if (prevBtn) prevBtn.addEventListener('click', () => {
        currentIndex = Math.max(0, currentIndex - 1);
        updateSlider();
    });

    if (nextBtn) nextBtn.addEventListener('click', () => {
        currentIndex = Math.min(maxIndex, currentIndex + 1);
        updateSlider();
    });

    // Auto slide
    setInterval(() => {
        currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
        updateSlider();
    }, 6000);

    window.addEventListener('resize', () => updateSlider());
}

/* ============================================
   Volunteer Form (Display Only)
   ============================================ */
function initVolunteerForm() {
    const form = document.getElementById('volunteer-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Fake success message
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Application Submitted!';
        btn.style.background = 'linear-gradient(135deg, #138808 0%, #0f6b06 100%)';
        btn.disabled = true;

        setTimeout(() => {
            form.reset();
            btn.textContent = originalText;
            btn.style.background = '';
            btn.disabled = false;
        }, 3000);
    });
}

/* ============================================
   Donate Page Functions
   ============================================ */
function initDonation() {
    const donateCards = document.querySelectorAll('.donate-card');
    const customInput = document.getElementById('custom-amount');

    donateCards.forEach(card => {
        card.addEventListener('click', () => {
            donateCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            if (customInput) customInput.value = '';
        });
    });

    if (customInput) {
        customInput.addEventListener('focus', () => {
            donateCards.forEach(c => c.classList.remove('selected'));
        });
    }
}

// Call on donate page
if (document.querySelector('.donate-options')) {
    initDonation();
}

/* ============================================
   Counter Animation
   ============================================ */
function animateCounter() {
    const counter = document.getElementById('visitor-count');
    if (!counter) return;

    const target = parseInt(counter.textContent.replace(/,/g, ''));
    let current = 0;
    const duration = 2000;
    const increment = target / (duration / 16);

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target.toLocaleString('en-IN');
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current).toLocaleString('en-IN');
                }
            }, 16);
            observer.disconnect();
        }
    });

    observer.observe(counter);
}
