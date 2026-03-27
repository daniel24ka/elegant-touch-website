/* ============================================
   ELEGANT TOUCH - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // === Preloader ===
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 1500);
    });
    // Fallback
    setTimeout(() => preloader.classList.add('hidden'), 3500);

    // === Initialize AOS ===
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 80,
        disable: 'mobile'
    });

    // === Cursor Glow Effect ===
    const cursorGlow = document.getElementById('cursorGlow');
    if (window.matchMedia('(hover: hover)').matches && cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });
    }

    // === Header Scroll Effect ===
    const header = document.getElementById('mainHeader');
    const backToTop = document.getElementById('backToTop');

    function handleScroll() {
        const scrollY = window.scrollY;
        if (scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (scrollY > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Back to top click
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // === Mobile Navigation ===
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // === Active Navigation Link ===
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        const scrollY = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navLinksAll.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // === Counter Animation ===
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        });
    }

    // Trigger counter animation when hero stats are visible
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) statsObserver.observe(heroStats);

    // === Particle Effect ===
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        function createParticle() {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            const size = Math.random() * 4 + 1;
            const x = Math.random() * 100;
            const duration = Math.random() * 15 + 10;
            const delay = Math.random() * 5;

            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${x}%;
                bottom: -10px;
                background: rgba(201, 169, 110, ${Math.random() * 0.3 + 0.1});
                animation-duration: ${duration}s;
                animation-delay: ${delay}s;
            `;

            particlesContainer.appendChild(particle);

            setTimeout(() => particle.remove(), (duration + delay) * 1000);
        }

        // Create initial particles
        for (let i = 0; i < 30; i++) {
            setTimeout(createParticle, i * 300);
        }

        // Keep creating particles
        setInterval(createParticle, 800);
    }

    // === Gallery Filter ===
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            galleryItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.classList.remove('hidden');
                    item.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // === Testimonials Slider ===
    const track = document.getElementById('testimonialTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('sliderDots');

    if (track) {
        const cards = track.querySelectorAll('.testimonial-card');
        let currentSlide = 0;
        const totalSlides = cards.length;

        // Create dots
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }

        const dots = dotsContainer.querySelectorAll('.slider-dot');

        function goToSlide(index) {
            currentSlide = index;
            const isRTL = document.dir === 'rtl' || document.documentElement.dir === 'rtl';
            const direction = isRTL ? 1 : -1;
            track.style.transform = `translateX(${direction * currentSlide * 100}%)`;
            dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
        }

        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            goToSlide(currentSlide);
        });

        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            goToSlide(currentSlide);
        });

        // Auto-play
        let autoPlay = setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            goToSlide(currentSlide);
        }, 5000);

        // Pause on hover
        const slider = document.getElementById('testimonialsSlider');
        slider.addEventListener('mouseenter', () => clearInterval(autoPlay));
        slider.addEventListener('mouseleave', () => {
            autoPlay = setInterval(() => {
                currentSlide = (currentSlide + 1) % totalSlides;
                goToSlide(currentSlide);
            }, 5000);
        });

        // Touch/Swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff < 0) {
                    // Swiped right (prev in RTL)
                    currentSlide = (currentSlide + 1) % totalSlides;
                } else {
                    // Swiped left (next in RTL)
                    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
                }
                goToSlide(currentSlide);
            }
        }, { passive: true });
    }

    // === FAQ Accordion ===
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            faqItems.forEach(i => i.classList.remove('active'));

            // Open clicked (toggle)
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // === Contact Form ===
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const name = formData.get('name');

            // Show success message
            contactForm.innerHTML = `
                <div class="form-success">
                    <i class="fas fa-check-circle"></i>
                    <h3>תודה ${name}!</h3>
                    <p>הפנייה שלך התקבלה בהצלחה. ניצור איתך קשר בהקדם האפשרי.</p>
                </div>
            `;
        });
    }

    // === Smooth Scroll for anchor links ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = targetEl.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // === Parallax micro-effect on hero ===
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && window.matchMedia('(hover: hover)').matches) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
                heroContent.style.opacity = 1 - (scrollY / (window.innerHeight * 0.8));
            }
        }, { passive: true });
    }

    // === Reveal animations on scroll for elements without AOS ===
    const revealElements = document.querySelectorAll('.contact-card, .about-feature');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        revealObserver.observe(el);
    });

});