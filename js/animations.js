document.addEventListener("DOMContentLoaded", () => {
    // WEB3FORMS ACCESS KEY CONFIGURATION
    // To get your free access key, visit https://web3forms.com/ and enter your email,
    // then paste the received key here to receive contact form emails.
    const WEB3FORMS_ACCESS_KEY = "9b048e30-bd02-497e-9116-a5c17384e111";

    // 0. Premium Monospace Preloader Counter Logic
    const preloader = document.getElementById('preloader');
    const countEl = document.getElementById('preloader-count');
    const fillEl = document.getElementById('preloader-fill');
    if (preloader && countEl) {
        let count = 0;
        const interval = setInterval(() => {
            count += Math.floor(Math.random() * 20) + 2; // Increments much faster (2 to 5 per step)
            if (count >= 100) {
                count = 100;
                countEl.textContent = count;
                if (fillEl) fillEl.style.width = count + '%';
                clearInterval(interval);
                
                // Exquisite, high-end delayed transition out
                setTimeout(() => {
                    preloader.classList.add('preloader-hidden');
                    document.body.classList.remove('preloader-active');
                    // Refresh ScrollTrigger positions after layout settles
                    setTimeout(() => {
                        ScrollTrigger.refresh();
                    }, 400);
                }, 300); // Snappy holding beat at 100%
            } else {
                countEl.textContent = count;
                if (fillEl) fillEl.style.width = count + '%';
            }
        }, 2); // Snappy interval speed
    }

    // 0b. Get all header nav icon links
    const navIconLinks = document.querySelectorAll('.nav-icon-link');

    // 1. Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    // Request animation frame for Lenis
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Integrate Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // 1.5. Scroll Indicator Click Smooth Scroll
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                lenis.scrollTo(aboutSection, {
                    duration: 1.2
                });
            }
        });
    }

    // 1.6. Header Icon Nav: Apple-style Fluid Dock + Sliding Capsule Indicator
    if (navIconLinks.length > 0) {
        const navContainer = document.querySelector('.nav-pill-links');
        const activeBg = document.querySelector('.nav-active-pill-bg');
        let isScrollingClick = false;

        // Reset click scroll lock immediately if the user interacts or scrolls manually
        const resetScrollLock = () => {
            isScrollingClick = false;
        };
        window.addEventListener('wheel', resetScrollLock, { passive: true });
        window.addEventListener('touchmove', resetScrollLock, { passive: true });
        window.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Spacebar'].includes(e.key)) {
                isScrollingClick = false;
            }
        }, { passive: true });

        // Function to update sliding active background capsule
        function updateActiveCapsule(instant = false) {
            if (!activeBg) return;
            const activeLink = document.querySelector('.nav-icon-link.active');

            if (activeLink) {
                // Calculate dimensions relative to container
                const leftPos = activeLink.offsetLeft;
                const linkWidth = activeLink.offsetWidth;

                gsap.to(activeBg, {
                    left: leftPos,
                    width: linkWidth,
                    opacity: 1,
                    scale: 1,
                    duration: instant ? 0 : 0.5,
                    ease: 'power3.out',
                    overwrite: 'auto'
                });
            } else {
                // Hide if no item is active (e.g. on Hero section)
                gsap.to(activeBg, {
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.3,
                    ease: 'power2.in',
                    overwrite: 'auto'
                });
            }
        }

        // Run on load and on resize
        window.addEventListener('load', () => updateActiveCapsule(true));
        window.addEventListener('resize', () => updateActiveCapsule(true));
        // Fallback for fast load
        setTimeout(() => updateActiveCapsule(true), 200);

        // A. Handle click smooth scrolling for anchor links
        navIconLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    if (href === '#contact') {
                        if (typeof openContactDrawer === 'function') {
                            openContactDrawer();
                        } else {
                            const drawer = document.getElementById('contact-drawer');
                            const overlay = document.getElementById('contact-drawer-overlay');
                            if (drawer && overlay) {
                                drawer.classList.add('active');
                                overlay.classList.add('active');
                                document.body.style.overflow = 'hidden';
                            }
                        }
                    } else {
                        const targetSection = document.querySelector(href);
                        if (targetSection) {
                            isScrollingClick = true;
                            navIconLinks.forEach(l => {
                                if (l === link) {
                                    l.classList.add('active');
                                } else {
                                    l.classList.remove('active');
                                }
                            });
                            updateActiveCapsule();

                            // Cancel any existing fallback timer on this link
                            if (link.scrollTimeout) clearTimeout(link.scrollTimeout);

                            // Set safety fallback timer to unlock scrollspy after 1.6 seconds
                            link.scrollTimeout = setTimeout(() => {
                                isScrollingClick = false;
                            }, 1600);

                            lenis.scrollTo(targetSection, {
                                duration: 1.4,
                                offset: -50,
                                onComplete: () => {
                                    clearTimeout(link.scrollTimeout);
                                    setTimeout(() => {
                                        isScrollingClick = false;
                                    }, 50);
                                }
                            });
                        }
                    }
                }
            });
        });

        // A2. Handle logo click smooth scroll to top
        const navLogo = document.getElementById('nav-logo');
        if (navLogo) {
            navLogo.addEventListener('click', (e) => {
                e.preventDefault();
                isScrollingClick = true;
                navIconLinks.forEach(link => link.classList.remove('active'));
                updateActiveCapsule();

                // Cancel any existing fallback timer on logo
                if (navLogo.scrollTimeout) clearTimeout(navLogo.scrollTimeout);

                // Set safety fallback timer to unlock scrollspy after 1.7 seconds
                navLogo.scrollTimeout = setTimeout(() => {
                    isScrollingClick = false;
                }, 1700);

                lenis.scrollTo(0, {
                    duration: 1.5,
                    onComplete: () => {
                        clearTimeout(navLogo.scrollTimeout);
                        setTimeout(() => {
                            isScrollingClick = false;
                        }, 50);
                    }
                });
            });
        }

        // B. Scroll Spy using ScrollTrigger to auto-update active nav indicator
        const spySections = [
            { id: '#about', section: document.getElementById('about') },
            { id: '#experience', section: document.getElementById('experience') },
            { id: '#skills', section: document.getElementById('skills') },
            { id: '#expertise', section: document.getElementById('expertise') },
            { id: '#services', section: document.getElementById('services') },
            { id: '#approach', section: document.getElementById('approach') },
            { id: '#portfolio', section: document.getElementById('portfolio') },
            { id: '#insights', section: document.getElementById('insights') }
        ];

        spySections.forEach((item, index) => {
            if (item.section) {
                const isLast = (index === spySections.length - 1);
                ScrollTrigger.create({
                    trigger: item.section,
                    start: isLast ? "top 85%" : "top 50%",
                    end: isLast ? "bottom bottom" : "bottom 50%",
                    onEnter: () => {
                        if (isScrollingClick) return;
                        navIconLinks.forEach(link => {
                            if (link.getAttribute('href') === item.id) {
                                link.classList.add('active');
                            } else {
                                link.classList.remove('active');
                            }
                        });
                        updateActiveCapsule();
                    },
                    onEnterBack: () => {
                        if (isScrollingClick) return;
                        navIconLinks.forEach(link => {
                            if (link.getAttribute('href') === item.id) {
                                link.classList.add('active');
                            } else {
                                link.classList.remove('active');
                            }
                        });
                        updateActiveCapsule();
                    }
                });
            }
        });

        // Clear active states when scrolled back to hero section
        const heroSection = document.querySelector('.section-hero');
        if (heroSection) {
            ScrollTrigger.create({
                trigger: heroSection,
                start: "top top",
                end: "bottom 50%",
                onEnterBack: () => {
                    if (isScrollingClick) return;
                    navIconLinks.forEach(link => link.classList.remove('active'));
                    updateActiveCapsule();
                }
            });
        }

        // C. Interactive Fluid Dock Fisheye Scaling & Magnetic effect (Desktop only)
        if (window.innerWidth > 768 && navContainer) {
            navContainer.addEventListener('mousemove', (e) => {
                const rect = navContainer.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;

                navIconLinks.forEach(link => {
                    const linkLeft = link.offsetLeft;
                    const linkWidth = link.offsetWidth;
                    const linkCenterX = linkLeft + linkWidth / 2;

                    // Calculate distance in pixels
                    const distance = Math.abs(mouseX - linkCenterX);
                    const range = 110; // Influence zone

                    if (distance < range) {
                        // Proximity value: 1 at center, 0 at outer boundary
                        const proximity = 1 - (distance / range);
                        
                        // Refined subtle scale for text labels (8% max scale)
                        const scale = 1 + (0.08 * Math.sin(proximity * Math.PI / 2));
                        
                        // Gentle magnetic pull toward mouse X position
                        const pullX = (mouseX - linkCenterX) * 0.12 * proximity;

                        gsap.to(link, {
                            scale: scale,
                            x: pullX,
                            duration: 0.15,
                            ease: 'power2.out',
                            overwrite: 'auto'
                        });

                        // Scale and translate the active capsule background in sync if this is the active link
                        if (link.classList.contains('active') && activeBg) {
                            gsap.to(activeBg, {
                                scale: scale,
                                x: pullX,
                                duration: 0.15,
                                ease: 'power2.out',
                                overwrite: 'auto'
                            });
                        }

                        // Make the SVG scale proportionally
                        const svg = link.querySelector('svg');
                        if (svg) {
                            gsap.to(svg, {
                                scale: 1 + (0.04 * proximity),
                                duration: 0.15,
                                ease: 'power2.out',
                                overwrite: 'auto'
                            });
                        }
                    } else {
                        // Reset to normal if outside influence zone
                        gsap.to(link, {
                            scale: 1,
                            x: 0,
                            duration: 0.25,
                            ease: 'power2.out',
                            overwrite: 'auto'
                        });

                        // Reset active capsule if this is the active link outside the range
                        if (link.classList.contains('active') && activeBg) {
                            gsap.to(activeBg, {
                                scale: 1,
                                x: 0,
                                duration: 0.25,
                                ease: 'power2.out',
                                overwrite: 'auto'
                            });
                        }

                        const svg = link.querySelector('svg');
                        if (svg) {
                            gsap.to(svg, {
                                scale: 1,
                                duration: 0.25,
                                ease: 'power2.out',
                                overwrite: 'auto'
                            });
                        }
                    }
                });
            });

            // Reset all dock items when mouse leaves container
            navContainer.addEventListener('mouseleave', () => {
                navIconLinks.forEach(link => {
                    gsap.to(link, {
                        scale: 1,
                        x: 0,
                        y: 0,
                        duration: 0.4,
                        ease: 'elastic.out(1, 0.65)',
                        overwrite: 'auto'
                    });

                    const svg = link.querySelector('svg');
                    if (svg) {
                        gsap.to(svg, {
                            scale: 1,
                            duration: 0.4,
                            ease: 'power2.out',
                            overwrite: 'auto'
                        });
                    }
                });

                // Reset active background capsule scale and position
                if (activeBg) {
                    gsap.to(activeBg, {
                        scale: 1,
                        x: 0,
                        y: 0,
                        duration: 0.4,
                        ease: 'elastic.out(1, 0.65)',
                        overwrite: 'auto'
                    });
                }
            });
        }
    }

    // 2. Theme Switching Logic (Dark/Light mode on scroll)
    const themeSections = document.querySelectorAll('.theme-section');
    const body = document.body;

    themeSections.forEach(section => {
        const theme = section.getAttribute('data-theme');
        
        ScrollTrigger.create({
            trigger: section,
            start: "top 50%", // When the top of the section hits the middle of the viewport
            end: "bottom 50%",
            onEnter: () => updateTheme(theme),
            onEnterBack: () => updateTheme(theme)
        });
    });

    function updateTheme(theme) {
        if (theme === 'light') {
            body.classList.add('theme-light');
            body.classList.remove('theme-dark');
        } else {
            body.classList.add('theme-dark');
            body.classList.remove('theme-light');
        }
    }

    // 4. Hero 3D Mouse Parallax Effect
    const heroSection = document.querySelector('.section-hero');
    const heroImage = document.querySelector('.hero-center-image');
    
    if (heroSection && heroImage) {
        const heroEmblem = heroImage.querySelector('img');

        // Continuous floating animation on the parent wrapper
        gsap.to(heroImage, {
            y: -20,
            duration: 3,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
        });

        // Interactive mouse tilt on the inner emblem image
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            // Maximum 25 degrees tilt
            const rotateX = (y - 0.5) * -25;
            const rotateY = (x - 0.5) * 25;
            
            gsap.to(heroEmblem, {
                rotationX: rotateX,
                rotationY: rotateY,
                duration: 0.5,
                ease: "power2.out",
                transformPerspective: 1000,
                transformOrigin: "center center"
            });
        });
        
        heroSection.addEventListener('mouseleave', () => {
            gsap.to(heroEmblem, {
                rotationX: 0,
                rotationY: 0,
                duration: 0.8,
                ease: "power2.out"
            });
        });
    }

    // 5. Services Staggered Entrance Reveal Animation
    const serviceCards = document.querySelectorAll('.service-card-new');
    const servicesGrid = document.querySelector('.services-grid-new');
    const isMobileServices = window.innerWidth <= 768;

    if (servicesGrid && serviceCards.length > 0) {
        // Set initial invisible state to prevent layout shift before animation
        gsap.set(serviceCards, { opacity: 0, y: 40 });

        ScrollTrigger.batch(serviceCards, {
            start: "top 85%",
            onEnter: batch => gsap.to(batch, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.12,
                ease: "power3.out",
                overwrite: "auto"
            }),
            once: true
        });
    }

    // 5b. Services Mobile Scroll-Active State (Hover content shown automatically on scroll)
    if (isMobileServices && serviceCards.length > 0) {
        serviceCards.forEach(card => {
            ScrollTrigger.create({
                trigger: card,
                start: "top 55%",
                end: "bottom 45%",
                onToggle: self => {
                    if (self.isActive) {
                        card.classList.add("mob-active");
                    } else {
                        card.classList.remove("mob-active");
                    }
                }
            });
        });

        // Initialize first card as active on load
        serviceCards[0].classList.add("mob-active");
    }
    
    // 6. Services 3D Card Mouse Tilt Effect — strong mouse-driven movement (Desktop Only)
    if (!isMobileServices && serviceCards.length > 0) {
        serviceCards.forEach(card => {
            const inner = card.querySelector('.service-card-new .service-card-inner') || card.querySelector('.service-card-inner');
            if (!inner) return;

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const xc = rect.width / 2;
                const yc = rect.height / 2;

                const maxTilt = 6;
                const rotateX = ((yc - y) / yc) * maxTilt;
                const rotateY = ((x - xc) / xc) * maxTilt;

                gsap.to(inner, {
                    rotationX: rotateX,
                    rotationY: rotateY,
                    scale: 1.04,
                    duration: 0.3,
                    ease: "power2.out",
                    transformPerspective: 800,
                    transformOrigin: "center center",
                    overwrite: "auto"
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(inner, {
                    rotationX: 0,
                    rotationY: 0,
                    scale: 1.0,
                    duration: 0.3,
                    ease: "power3.out",
                    overwrite: "auto"
                });
            });
        });
    }

    // 7. Interactive Approach & Values Section Logic
    const approachIcons = document.querySelectorAll('.approach-icon-wrap');
    const highlightWords = document.querySelectorAll('.highlight-word');

    if (approachIcons.length > 0) {
        approachIcons.forEach(icon => {
            const activateStep = () => {
                const step = icon.getAttribute('data-step');
                
                // 1. Update Active states of Icons (Toggles the CSS badges automatically)
                approachIcons.forEach(i => i.classList.remove('active'));
                icon.classList.add('active');

                // 2. Update Active states of Highlighted Words
                highlightWords.forEach(word => {
                    if (word.getAttribute('data-step') === step) {
                        word.classList.add('active');
                    } else {
                        word.classList.remove('active');
                    }
                });
            };

            icon.addEventListener('mouseenter', activateStep);
            icon.addEventListener('click', activateStep);
        });
    }

    // 8. Magnetic Custom Cursor Pill for Latest Work Section (Desktop Only)
    if (window.innerWidth > 768) {
        const sectionLatestWork = document.querySelector('.section-latest-work');
        const seeProjectPill = document.querySelector('.see-project-pill');
        
        if (sectionLatestWork && seeProjectPill) {
            sectionLatestWork.addEventListener('mouseenter', () => {
                gsap.to(seeProjectPill, {
                    scale: 1,
                    opacity: 1,
                    duration: 0.45,
                    ease: "power3.out"
                });
            });
            
            sectionLatestWork.addEventListener('mousemove', (e) => {
                const rect = sectionLatestWork.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                gsap.to(seeProjectPill, {
                    x: x,
                    y: y,
                    duration: 0.35, // Premium magnetic damping lag
                    ease: "power2.out"
                });
            });
            
            sectionLatestWork.addEventListener('mouseleave', () => {
                gsap.to(seeProjectPill, {
                    scale: 0,
                    opacity: 0,
                    duration: 0.4,
                    ease: "power3.inOut"
                });
            });
        }
    }

    // 9. Shopify Expertise Cards Scroll-Triggered Staggered Entrance
    const expertiseCards = document.querySelectorAll('.expertise-card');
    const expertiseGrid = document.querySelector('.expertise-grid');

    if (expertiseGrid && expertiseCards.length > 0) {
        gsap.set(expertiseCards, { opacity: 0, y: 50 });

        ScrollTrigger.batch(expertiseCards, {
            start: "top 85%",
            onEnter: batch => gsap.to(batch, {
                opacity: 1,
                y: 0,
                duration: 1.0,
                stagger: 0.15,
                ease: "power3.out",
                overwrite: "auto"
            }),
            once: true
        });
    }

    // 10. Shopify Expertise — Stamp Follows Mouse + Subtle Card Tilt
    if (expertiseCards.length > 0) {
        expertiseCards.forEach(card => {
            const inner = card.querySelector('.expertise-card-inner');
            const stamp = card.querySelector('.card-stamp');
            const enquireBtn = card.querySelector('.btn-enquire');
            if (!inner) return;

            // Stamp hidden by default — will only appear once positioned at cursor
            if (stamp) {
                gsap.set(stamp, { opacity: 0, scale: 0.8 });
            }

            let stampRevealed = false; // track first move after entering
            let isOverEnquire = false;

            // Handle Enquire Button hover to restore native pointer and hide custom stamp cursor
            if (enquireBtn) {
                enquireBtn.addEventListener('mouseenter', () => {
                    isOverEnquire = true;
                    card.style.cursor = 'auto';
                    if (stamp) {
                        gsap.to(stamp, {
                            opacity: 0,
                            scale: 0.8,
                            duration: 0.15,
                            ease: "power2.out",
                            overwrite: "auto"
                        });
                    }
                });

                enquireBtn.addEventListener('mouseleave', () => {
                    isOverEnquire = false;
                    card.style.cursor = 'none';
                    if (stamp) {
                        gsap.to(stamp, {
                            opacity: 1,
                            scale: 1,
                            duration: 0.15,
                            ease: "power2.out",
                            overwrite: "auto"
                        });
                    }
                });

                enquireBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const drawer = document.getElementById('contact-drawer');
                    const overlay = document.getElementById('contact-drawer-overlay');
                    if (drawer && overlay) {
                        drawer.classList.add('active');
                        overlay.classList.add('active');
                        if (typeof lenis !== 'undefined') lenis.stop();
                    }
                });
            }

            card.addEventListener('mouseenter', () => {
                stampRevealed = false; // reset on each entry so stamp waits for mousemove
            });

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const xc = rect.width / 2;
                const yc = rect.height / 2;

                // Subtle elegant 3D tilt — 3° max
                const maxTilt = 3;
                const rotateX = ((yc - y) / yc) * maxTilt;
                const rotateY = ((x - xc) / xc) * maxTilt;

                gsap.to(inner, {
                    rotationX: rotateX,
                    rotationY: rotateY,
                    scale: 1.01, // subtle scale for elegant lift
                    duration: 0.15, // snappier response
                    ease: "power2.out",
                    transformPerspective: 1400,
                    transformOrigin: "center center",
                    overwrite: "auto"
                });

                if (stamp && !isOverEnquire) {
                    // Calculate stamp coordinates relative to .card-header parent
                    const header = card.querySelector('.card-header');
                    let stampX = x;
                    let stampY = y;
                    if (header) {
                        const headerRect = header.getBoundingClientRect();
                        stampX = e.clientX - headerRect.left;
                        stampY = e.clientY - headerRect.top;
                    }

                    if (!stampRevealed) {
                        // First move: snap stamp to cursor instantly, THEN fade in
                        // top: 0 and left: 0 removes the static CSS offset so we center precisely
                        gsap.set(stamp, { 
                            top: 0,
                            left: 0,
                            xPercent: -50,
                            yPercent: -50,
                            rotation: -6,
                            x: stampX, 
                            y: stampY 
                        });
                        gsap.to(stamp, {
                            opacity: 1,
                            scale: 1,
                            duration: 0.15,
                            ease: "power2.out"
                        });
                        stampRevealed = true;
                    } else {
                        // Fast, smooth follow with smaller duration as requested ("mouse base transition small set")
                        gsap.to(stamp, {
                            x: stampX,
                            y: stampY,
                            duration: 0.15,
                            ease: "power2.out",
                            overwrite: "auto"
                        });
                    }
                }
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(inner, {
                    rotationX: 0,
                    rotationY: 0,
                    scale: 1.0,
                    duration: 0.3, // snappier return
                    ease: "power2.out",
                    overwrite: "auto"
                });

                if (stamp) {
                    gsap.to(stamp, {
                        opacity: 0,
                        scale: 0.8,
                        duration: 0.15,
                        ease: "power2.in",
                        overwrite: "auto"
                    });
                }
                stampRevealed = false;
            });
        });
    }

    // 11. Skills Cards Scroll-Triggered Staggered Entrance
    const skillCards = document.querySelectorAll('.skill-card');
    const skillsGrid = document.querySelector('.skills-bento-grid');

    if (skillsGrid && skillCards.length > 0) {
        gsap.set(skillCards, { opacity: 0, y: 50 });

        ScrollTrigger.batch(skillCards, {
            start: "top 85%",
            onEnter: batch => gsap.to(batch, {
                opacity: 1,
                y: 0,
                duration: 1.0,
                stagger: 0.1,
                ease: "power3.out",
                overwrite: "auto"
            }),
            once: true
        });
    }

    // 11b. Progress Ring Fill — animate stroke-dashoffset when card enters viewport
    const CIRCUMFERENCE = 113.1; // 2 * π * r (r=18)

    skillCards.forEach((card, idx) => {
        const percent  = parseInt(card.getAttribute('data-percent') || '0', 10);
        const ringCircle = card.querySelector('.progress-ring-circle');
        if (!ringCircle) return;

        // Ensure ring starts empty
        ringCircle.style.strokeDashoffset = CIRCUMFERENCE;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                // Calculate target offset: 0% fill = 113.1, 100% fill = 0
                const targetOffset = CIRCUMFERENCE * (1 - percent / 100);

                // Animate with a CSS transition + slight stagger per card index
                setTimeout(() => {
                    ringCircle.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.25, 1, 0.5, 1)';
                    ringCircle.style.strokeDashoffset = targetOffset;
                }, idx * 80); // stagger each card by 80ms

                observer.disconnect();
            });
        }, { threshold: 0.4 });

        observer.observe(card);
    });



    // 12. Skills 3D Card Mouse Tilt + Ghost Icon Cursor Follower (Desktop Only)
    if (window.innerWidth > 768 && skillCards.length > 0) {

        skillCards.forEach(card => {
            const inner   = card.querySelector('.skill-card-inner');
            const origIcon = card.querySelector('.skill-icon'); // original icon element
            const iconImg  = card.querySelector('.skill-icon img');
            if (!inner) return;

            // ── Create a ghost icon that floats at the cursor position ──
            // The ORIGINAL .skill-icon is hidden on hover; this ghost takes its place
            // and follows the cursor precisely, appended to .skill-card.
            const ghost = document.createElement('div');
            ghost.className = 'skill-cursor-ghost';
            if (iconImg) {
                const clone = iconImg.cloneNode(true);
                ghost.appendChild(clone);
            }
            card.appendChild(ghost);

            // Start invisible; xPercent/yPercent centres it on the cursor
            gsap.set(ghost, {
                opacity: 0,
                scale: 0.5,
                xPercent: -50,
                yPercent: -50,
                x: 0,
                y: 0
            });

            let ghostRevealed = false;

            card.addEventListener('mouseenter', () => {
                ghostRevealed = false;
                // Hide the original icon so only ghost shows — prevents two icons
                if (origIcon) {
                    gsap.to(origIcon, {
                        opacity: 0,
                        duration: 0.15,
                        ease: 'power2.out',
                        overwrite: 'auto'
                    });
                }
            });

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const xc = rect.width  / 2;
                const yc = rect.height / 2;

                // Subtle 3D card tilt — 3° max
                const maxTilt = 3;
                const rotateX = ((yc - y) / yc) * maxTilt;
                const rotateY = ((x - xc) / xc) * maxTilt;

                gsap.to(inner, {
                    rotationX: rotateX,
                    rotationY: rotateY,
                    scale: 1.01,
                    duration: 0.15,
                    ease: 'power2.out',
                    transformPerspective: 1000,
                    transformOrigin: 'center center',
                    overwrite: 'auto'
                });

                card.style.setProperty('--mx', `${x}px`);
                card.style.setProperty('--my', `${y}px`);

                // Ghost cursor icon: snap to cursor on first move, then smooth follow
                if (!ghostRevealed) {
                    gsap.set(ghost, { x, y });
                    gsap.to(ghost, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.25,
                        ease: 'power3.out'
                    });
                    ghostRevealed = true;
                } else {
                    gsap.to(ghost, {
                        x,
                        y,
                        duration: 0.12,
                        ease: 'power2.out',
                        overwrite: 'auto'
                    });
                }
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(inner, {
                    rotationX: 0,
                    rotationY: 0,
                    scale: 1.0,
                    duration: 0.35,
                    ease: 'power2.out',
                    overwrite: 'auto'
                });

                // Hide ghost, restore original icon
                gsap.to(ghost, {
                    opacity: 0,
                    scale: 0.5,
                    duration: 0.2,
                    ease: 'power2.in',
                    overwrite: 'auto'
                });

                if (origIcon) {
                    gsap.to(origIcon, {
                        opacity: 1,
                        duration: 0.3,
                        delay: 0.1,
                        ease: 'power2.out',
                        overwrite: 'auto'
                    });
                }

                ghostRevealed = false;
            });
        });
    }

    // 13. Skills Timeline Scroll progress Axis & Navigator Highlights
    const timelineList = document.querySelector(".skills-timeline-list");
    const timelineProgress = document.querySelector(".skills-timeline-progress-fill");
    const sidebarProgress = document.querySelector(".skills-timeline-sidebar-progress");
    const timelineEntries = document.querySelectorAll(".skills-timeline-entry");
    const sidebarItems = document.querySelectorAll(".skills-sidebar-item");

    if (timelineList) {
        // A. Dynamic line progress filling scrubbed with scroll
        if (timelineProgress) {
            gsap.fromTo(timelineProgress,
                { height: "0%" },
                {
                    height: "100%",
                    ease: "none",
                    scrollTrigger: {
                        trigger: timelineList,
                        start: "top 30%",
                        end: "bottom 60%",
                        scrub: true
                    }
                }
            );
        }

        // B. Sticky sidebar navigator track progress filling scrubbed with scroll
        if (sidebarProgress) {
            gsap.fromTo(sidebarProgress,
                { height: "0%" },
                {
                    height: "100%",
                    ease: "none",
                    scrollTrigger: {
                        trigger: timelineList,
                        start: "top 30%",
                        end: "bottom 60%",
                        scrub: true
                    }
                }
            );
        }

        // C. Track active entry & highlight matching sidebar targets
        timelineEntries.forEach(entry => {
            const skillId = entry.getAttribute("data-skill-id");
            const brandColor = entry.getAttribute("data-brand-color");

            ScrollTrigger.create({
                trigger: entry,
                start: "top 50%",
                end: "bottom 50%",
                onEnter: () => activateSkill(skillId, brandColor),
                onEnterBack: () => activateSkill(skillId, brandColor)
            });
        });

        function activateSkill(id, color) {
            const activeIndex = Array.from(sidebarItems).findIndex(item => item.getAttribute("data-skill-target") === id);
            const isMobile = window.innerWidth <= 768;

            timelineEntries.forEach((e, idx) => {
                if (idx <= activeIndex) {
                    e.classList.add("active");
                } else {
                    e.classList.remove("active");
                }

                // Add or remove mob-hover-active class for mobile scroll-based reveal
                const card = e.querySelector('.skill-card');
                if (card) {
                    if (isMobile) {
                        if (idx === activeIndex) {
                            card.classList.add("mob-hover-active");
                        } else {
                            card.classList.remove("mob-hover-active");
                        }
                    } else {
                        card.classList.remove("mob-hover-active");
                    }
                }
            });

            sidebarItems.forEach((item, idx) => {
                if (idx <= activeIndex) {
                    item.classList.add("active");
                    const entryColor = timelineEntries[idx].getAttribute("data-brand-color");
                    item.style.setProperty("--active-brand-color", entryColor);
                } else {
                    item.classList.remove("active");
                    item.style.removeProperty("--active-brand-color");
                }
            });
        }

        // Initialize the first skill as active by default on load
        if (timelineEntries.length > 0) {
            const firstEntry = timelineEntries[0];
            const firstId = firstEntry.getAttribute("data-skill-id");
            const firstColor = firstEntry.getAttribute("data-brand-color");
            activateSkill(firstId, firstColor);
        }

        // D. Smooth Anchor Scroll to target timeline card
        sidebarItems.forEach(item => {
            item.addEventListener("click", () => {
                const targetId = item.getAttribute("data-skill-target");
                const targetElement = document.getElementById("skill-" + targetId);
                if (targetElement) {
                    lenis.scrollTo(targetElement, {
                        offset: -window.innerHeight * 0.15,
                        duration: 1.2
                    });
                }
            });
        });
    }

    // 14. Testimonials Scroll-Triggered Fade-In Reveal
    const testimonialWrapper = document.querySelector(".testimonials-marquee-wrapper");
    if (testimonialWrapper) {
        gsap.fromTo(testimonialWrapper,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: testimonialWrapper,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            }
        );
    }

    // 15. Work Experience Scroll Reveal & 3D Tilt
    const experienceSection = document.querySelector('.section-experience');
    if (experienceSection) {
        const leftEl  = experienceSection.querySelector('.experience-left-col');
        const rightEl = experienceSection.querySelector('.experience-right-col');
        const achieveItems = experienceSection.querySelectorAll('.achieve-item');
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            // ── Mobile: CSS class-based scroll reveal (avoids GSAP transform conflicts) ──
            // Set initial hidden state via class
            [leftEl, rightEl].forEach(el => { if (el) el.classList.add('mob-card-hidden'); });
            achieveItems.forEach(el => el.classList.add('mob-item-hidden'));

            // Observe the experience section and reveal on scroll
            const expObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            if (leftEl)  leftEl.classList.add('mob-card-visible');
                        }, 0);
                        setTimeout(() => {
                            if (rightEl) rightEl.classList.add('mob-card-visible');
                        }, 120);
                        // Stagger achieve items
                        achieveItems.forEach((item, i) => {
                            setTimeout(() => item.classList.add('mob-item-visible'), 300 + i * 80);
                        });
                        expObserver.disconnect();
                    }
                });
            }, { threshold: 0.1 });
            expObserver.observe(experienceSection);

        } else {
            // ── Desktop: original slide-in from sides animation ──
            gsap.set(leftEl, { opacity: 0, x: -60 });
            gsap.set(rightEl, { opacity: 0, x: 60 });
            gsap.set(achieveItems, { opacity: 0, x: -15 });

            ScrollTrigger.create({
                trigger: experienceSection,
                start: "top 75%",
                onEnter: () => {
                    gsap.to(rightEl, { opacity: 1, x: 0, duration: 0.9, ease: "power3.out" });
                    gsap.to(leftEl, {
                        opacity: 1, x: 0, duration: 0.9, delay: 0.15, ease: "power3.out",
                        onComplete: () => {
                            gsap.to(achieveItems, {
                                opacity: 1, x: 0, duration: 0.5,
                                stagger: 0.15, ease: "power2.out"
                            });
                        }
                    });
                }
            });

            // 3D console cards tilt (desktop only)
            const expCards = experienceSection.querySelectorAll('.exp-console-card');
            expCards.forEach(card => {
                const inner = card.querySelector('.exp-console-card-inner') || card;
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const xc = rect.width / 2;
                    const yc = rect.height / 2;
                    const maxTilt = 3;
                    const rotateX = ((yc - y) / yc) * maxTilt;
                    const rotateY = ((x - xc) / xc) * maxTilt;
                    gsap.to(inner, {
                        rotationX: rotateX, rotationY: rotateY, scale: 1.01,
                        duration: 0.15, ease: "power2.out",
                        transformPerspective: 1000, transformOrigin: "center center"
                    });
                });
                card.addEventListener('mouseleave', () => {
                    gsap.to(inner, {
                        rotationX: 0, rotationY: 0, scale: 1.0,
                        duration: 0.3, ease: "power2.out"
                    });
                });
            });
        }
    }

    // 16. Contact Drawer Controls

    const drawer = document.getElementById('contact-drawer');
    const overlay = document.getElementById('contact-drawer-overlay');
    const closeBtn = document.getElementById('contact-drawer-close');
    const closeSuccessBtn = document.getElementById('btn-close-success');
    const form = document.getElementById('contact-form');
    const successState = document.getElementById('contact-success-state');

    function openContactDrawer() {
        if (drawer && overlay) {
            // Close mobile menu if active
            const slideOver = document.getElementById('slide-over');
            const slideOverlay = document.getElementById('slide-overlay');
            if (slideOver) slideOver.classList.remove('active');
            if (slideOverlay) slideOverlay.classList.remove('active');

            overlay.classList.add('active');
            drawer.classList.add('active');
            if (typeof lenis !== 'undefined') lenis.stop();
        }
    }

    function closeContactDrawer() {
        if (drawer && overlay) {
            overlay.classList.remove('active');
            drawer.classList.remove('active');
            if (typeof lenis !== 'undefined') lenis.start();
            // Reset form after closing transitions
            setTimeout(() => {
                if (form) {
                    form.reset();
                    // Reset custom select dropdowns
                    const customSelects = form.querySelectorAll('.custom-select-container');
                    customSelects.forEach(c => {
                        c.classList.remove('has-value', 'open', 'invalid');
                        const valSpan = c.querySelector('.custom-select-value');
                        if (valSpan) valSpan.textContent = '';
                        const input = c.querySelector('input[type="hidden"]');
                        if (input) input.value = '';
                        const activeOption = c.querySelector('.custom-select-option.active');
                        if (activeOption) activeOption.classList.remove('active');
                    });
                }
                if (form) form.style.display = 'flex';
                if (successState) successState.classList.remove('active');
            }, 600);
        }
    }

    if (closeBtn) closeBtn.addEventListener('click', closeContactDrawer);
    if (overlay) overlay.addEventListener('click', closeContactDrawer);
    if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeContactDrawer);

    // Direct click listeners for all contact links to open the drawer and bypass smooth-scroll conflicts
    const contactLinks = document.querySelectorAll('a[href="#contact"], a[href="contact.html"]');
    contactLinks.forEach(link => {
        if (!link.classList.contains('nav-icon-link')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                openContactDrawer();
            });
        }
    });

    // Smooth scroll for footer Quick Links using Lenis scroll
    const quickLinks = document.querySelectorAll('.footer-quick-links a');
    quickLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                if (targetSection && typeof lenis !== 'undefined') {
                    lenis.scrollTo(targetSection, {
                        duration: 1.2
                    });
                }
            }
        });
    });

    // Explicit binding for footer CTA "Start a Project" button
    const footerCtaBtn = document.getElementById('footer-cta-btn');
    if (footerCtaBtn) {
        footerCtaBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openContactDrawer();
        });
    }

    // Fallback document-wide interceptor for dynamically generated links
    document.addEventListener('click', (e) => {
        const contactLink = e.target.closest('a[href="contact.html"], a[href="#contact"]');
        if (contactLink && drawer && overlay) {
            e.preventDefault();
            openContactDrawer();
        }
    });

    // Custom select dropdown logic
    const selectContainers = document.querySelectorAll('.custom-select-container');
    selectContainers.forEach(container => {
        const trigger = container.querySelector('.custom-select-trigger');
        const hiddenInput = container.querySelector('input[type="hidden"]');
        const valueSpan = container.querySelector('.custom-select-value');
        const options = container.querySelectorAll('.custom-select-option');

        // Toggle dropdown open state
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            container.classList.toggle('open');
        });

        // Handle option selection
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const val = option.getAttribute('data-value');
                const label = option.textContent.trim();

                if (hiddenInput) hiddenInput.value = val;
                if (valueSpan) valueSpan.textContent = label;

                // Clear active class from all options and add to selected one
                options.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');

                container.classList.add('has-value');
                container.classList.remove('open');
                container.classList.remove('invalid');

                // Trigger change event for form validation/state if needed
                const event = new Event('change', { bubbles: true });
                hiddenInput.dispatchEvent(event);
            });
        });
    });

    // Close select menus when clicking outside
    document.addEventListener('click', () => {
        selectContainers.forEach(c => c.classList.remove('open'));
    });

    // Form submit logic
    if (form) {
        form.addEventListener('submit', (e) => {
            // Remove previous invalid classes
            const customSelect = form.querySelector('.custom-select-container');
            if (customSelect) {
                customSelect.classList.remove('invalid');
            }

            // Check if service is selected
            const serviceInput = document.getElementById('contact-service');
            if (serviceInput && !serviceInput.value) {
                e.preventDefault();
                if (customSelect) {
                    customSelect.classList.add('invalid');
                    customSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }

            e.preventDefault();

            const submitBtn = document.getElementById('contact-submit-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            const originalText = btnText.textContent;

            btnText.textContent = 'Sending...';
            submitBtn.style.pointerEvents = 'none';
            submitBtn.style.opacity = '0.7';

            const formData = new FormData(form);
            formData.set('access_key', WEB3FORMS_ACCESS_KEY);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    form.style.display = 'none';
                    if (successState) successState.classList.add('active');
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(err => {
                alert('Submission error. Please try again.');
            })
            .finally(() => {
                btnText.textContent = originalText;
                submitBtn.style.pointerEvents = 'auto';
                submitBtn.style.opacity = '1';
            });
        });
    }
});

/* ============================================================
   FOOTER V2 — Square Dot Grid with Mouse Repulsion
   ============================================================ */
document.addEventListener('DOMContentLoaded', function initFooterCanvas() {
    const canvas = document.getElementById('footerCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const CELL   = 46;       // grid spacing
    const RADIUS  = 120;     // mouse repulsion radius
    const FORCE   = 2.8;     // repulsion strength
    const SPRING  = 0.09;    // spring back to base
    const DAMPING = 0.78;    // velocity damping (higher = snappier return)
    const BASE_SZ = 2.5;     // default square dot size (px)
    const HOVER_SZ = 6;      // enlarged size at cursor

    let width, height, cols, rows;
    let dots = [];
    let animFrame;
    let mouseX = -9999, mouseY = -9999;
    let isHovering = false;

    function resize() {
        const footer = canvas.closest('.footer-v2');
        width  = canvas.width  = footer ? footer.offsetWidth  : window.innerWidth;
        height = canvas.height = footer ? footer.offsetHeight : 400;
        cols = Math.ceil(width  / CELL) + 1;
        rows = Math.ceil(height / CELL) + 1;
        buildDots();
    }

    function buildDots() {
        dots = [];
        for (let r = 0; r <= rows; r++) {
            for (let c = 0; c <= cols; c++) {
                const bx = c * CELL;
                const by = r * CELL;
                dots.push({
                    x: bx, y: by,
                    baseX: bx, baseY: by,
                    vx: 0, vy: 0,
                    // Randomise base alpha slightly per dot
                    baseAlpha: 0.18 + Math.random() * 0.15
                });
            }
        }
    }

    function draw(ts) {
        ctx.clearRect(0, 0, width, height);

        dots.forEach(dot => {
            const dx = mouseX - dot.x;
            const dy = mouseY - dot.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Repulsion when cursor is within radius
            if (isHovering && dist < RADIUS && dist > 0) {
                const norm = dist / RADIUS;          // 0 (close) → 1 (edge)
                const strength = (1 - norm) * FORCE; // stronger when closer
                const angle = Math.atan2(dy, dx);
                dot.vx -= Math.cos(angle) * strength;
                dot.vy -= Math.sin(angle) * strength;
            }

            // Spring back to grid base position
            dot.vx += (dot.baseX - dot.x) * SPRING;
            dot.vy += (dot.baseY - dot.y) * SPRING;

            // Damping
            dot.vx *= DAMPING;
            dot.vy *= DAMPING;

            // Move
            dot.x += dot.vx;
            dot.y += dot.vy;

            // Subtle organic float on Y when not being pushed
            const floatOffset = Math.sin(ts * 0.0009 + dot.baseX * 0.04) * 0.6;

            // Displaced distance from base — used for glow intensity
            const dispX = dot.x - dot.baseX;
            const dispY = dot.y - dot.baseY;
            const disp  = Math.sqrt(dispX * dispX + dispY * dispY);
            const dispNorm = Math.min(disp / 30, 1); // 0 → 1

            // Proximity to mouse — for colour shift
            const proximity = isHovering ? Math.max(0, 1 - dist / RADIUS) : 0;

            // Interpolate colour: base grey → gold at high proximity
            const goldR = 204, goldG = 164, goldB = 59;
            const baseR =  80, baseG =  80, baseB = 80;
            const r = Math.round(baseR + (goldR - baseR) * proximity);
            const g = Math.round(baseG + (goldG - baseG) * proximity);
            const b = Math.round(baseB + (goldB - baseB) * proximity);

            // Alpha: base + brightens as displaced
            const alpha = dot.baseAlpha + dispNorm * 0.5 + proximity * 0.25;

            // Square size: grows near cursor
            const sz = BASE_SZ + (HOVER_SZ - BASE_SZ) * proximity;
            const half = sz / 2;

            const drawX = dot.x - half;
            const drawY = (dot.y + floatOffset) - half;

            ctx.globalAlpha = Math.min(alpha, 0.9);
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fillRect(drawX, drawY, sz, sz);
        });

        ctx.globalAlpha = 1;
        animFrame = requestAnimationFrame(draw);
    }

    // Resize handler
    window.addEventListener('resize', () => {
        cancelAnimationFrame(animFrame);
        resize();
        animFrame = requestAnimationFrame(draw);
    });

    // Mouse tracking on the entire footer
    const footer = canvas.closest('.footer-v2');
    if (footer) {
        footer.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
            isHovering = true;
        });

        footer.addEventListener('mouseleave', () => {
            isHovering = false;
            mouseX = -9999;
            mouseY = -9999;
        });
    }

    resize();
    animFrame = requestAnimationFrame(draw);
});

/* ============================================================
   FOOTER STATS — Scroll-Triggered Counter Animation (0 → target)
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
    const statsRow = document.getElementById('footer-stats-row');
    if (!statsRow) return;

    const statNums = statsRow.querySelectorAll('.footer-stat-num[data-target]');
    let hasAnimated = false;

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    function animateCounter(el, target, duration) {
        const countEl = el.querySelector('.footer-stat-count');
        if (!countEl) return;

        const startTime = performance.now();

        function tick(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutCubic(progress);
            const current = Math.round(eased * target);

            countEl.textContent = current;

            // Gold flash when near target
            if (progress > 0.85) {
                el.style.color = 'var(--color-gold-bright)';
                setTimeout(() => { el.style.color = ''; }, 300);
            }

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                countEl.textContent = target;
                el.style.color = '';
            }
        }

        requestAnimationFrame(tick);
    }

    function runCounters() {
        if (hasAnimated) return;
        hasAnimated = true;

        statNums.forEach((el, i) => {
            const target = parseInt(el.getAttribute('data-target'), 10);
            // Stagger each stat: 0ms, 220ms, 440ms
            setTimeout(() => {
                animateCounter(el, target, 1600);
            }, i * 220);
        });
    }

    // Use IntersectionObserver — trigger when stats row enters viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                runCounters();
                observer.disconnect();
            }
        });
    }, { threshold: 0.4 });

    observer.observe(statsRow);
});

/* ============================================================
   FOOTER INFO CARDS — 3D Tilt + Spotlight Mouse Move Effect
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
    const infoCards = document.querySelectorAll('.footer-info-card');
    if (!infoCards.length) return;

    infoCards.forEach(card => {
        // Inject a spotlight div into each card
        const spotlight = document.createElement('div');
        spotlight.classList.add('footer-card-spotlight');
        card.appendChild(spotlight);

        let raf = null;
        let currentRX = 0, currentRY = 0;
        let targetRX  = 0, targetRY  = 0;
        let isHovered = false;

        const MAX_TILT = 12; // degrees

        function lerp(a, b, t) { return a + (b - a) * t; }

        function updateTransform() {
            currentRX = lerp(currentRX, targetRX, 0.12);
            currentRY = lerp(currentRY, targetRY, 0.12);

            card.style.transform =
                `perspective(700px) rotateX(${currentRX}deg) rotateY(${currentRY}deg) scale3d(${isHovered ? 1.03 : 1}, ${isHovered ? 1.03 : 1}, 1)`;

            // Keep animating until settled
            if (
                Math.abs(currentRX - targetRX) > 0.01 ||
                Math.abs(currentRY - targetRY) > 0.01 ||
                isHovered
            ) {
                raf = requestAnimationFrame(updateTransform);
            } else {
                card.style.transform = '';
                raf = null;
            }
        }

        card.addEventListener('mouseenter', () => {
            isHovered = true;
            if (!raf) raf = requestAnimationFrame(updateTransform);
        });

        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;   // 0 → rect.width
            const y = e.clientY - rect.top;    // 0 → rect.height

            // Normalise to -1 → +1
            const nx = (x / rect.width  - 0.5) * 2;
            const ny = (y / rect.height - 0.5) * 2;

            targetRY =  nx * MAX_TILT;   // left ↔ right tilt
            targetRX = -ny * MAX_TILT;   // up ↕ down tilt

            // Move spotlight
            const pctX = (x / rect.width)  * 100;
            const pctY = (y / rect.height) * 100;
            spotlight.style.background =
                `radial-gradient(circle 90px at ${pctX}% ${pctY}%,
                    rgba(204, 164, 59, 0.18) 0%,
                    rgba(204, 164, 59, 0.05) 45%,
                    transparent 70%)`;
            spotlight.style.opacity = '1';
        });

        card.addEventListener('mouseleave', () => {
            isHovered = false;
            targetRX = 0;
            targetRY = 0;
            spotlight.style.opacity = '0';
            if (!raf) raf = requestAnimationFrame(updateTransform);
        });
    });
});

/* ============================================================
   BIOGRAPHY & CREDENTIALS BENTO CARDS
   Desktop: 3D Tilt + Spotlight mouse-move
   Mobile:  IntersectionObserver scroll-reveal per card
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
    const bentoCards = document.querySelectorAll('.about-bento-card');
    if (!bentoCards.length) return;

    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        // ── Mobile: CSS class-based scroll reveal, one card at a time ──
        bentoCards.forEach(card => card.classList.add('mob-card-hidden'));

        const bioObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('mob-card-visible');
                    bioObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

        bentoCards.forEach(card => bioObserver.observe(card));

    } else {
        // ── Desktop: 3D Tilt + Spotlight mouse-move effect ──
        bentoCards.forEach(card => {
            const spotlight = card.querySelector('.about-card-spotlight');
            let raf = null;
            let currentRX = 0, currentRY = 0;
            let targetRX  = 0, targetRY  = 0;
            let isHovered = false;
            const MAX_TILT = 5;

            function lerp(a, b, t) { return a + (b - a) * t; }

            function updateTransform() {
                currentRX = lerp(currentRX, targetRX, 0.12);
                currentRY = lerp(currentRY, targetRY, 0.12);
                card.style.transform =
                    `perspective(1000px) rotateX(${currentRX}deg) rotateY(${currentRY}deg) scale3d(${isHovered ? 1.015 : 1}, ${isHovered ? 1.015 : 1}, 1)`;
                if (Math.abs(currentRX - targetRX) > 0.01 || Math.abs(currentRY - targetRY) > 0.01 || isHovered) {
                    raf = requestAnimationFrame(updateTransform);
                } else {
                    card.style.transform = '';
                    raf = null;
                }
            }

            card.addEventListener('mouseenter', () => {
                isHovered = true;
                if (!raf) raf = requestAnimationFrame(updateTransform);
            });

            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const nx = (x / rect.width  - 0.5) * 2;
                const ny = (y / rect.height - 0.5) * 2;
                targetRY =  nx * MAX_TILT;
                targetRX = -ny * MAX_TILT;
                if (spotlight) {
                    const pctX = (x / rect.width)  * 100;
                    const pctY = (y / rect.height) * 100;
                    spotlight.style.background =
                        `radial-gradient(circle 120px at ${pctX}% ${pctY}%,
                            rgba(204, 164, 59, 0.15) 0%,
                            rgba(204, 164, 59, 0.04) 50%,
                            transparent 70%)`;
                    spotlight.style.opacity = '1';
                }
            });

            card.addEventListener('mouseleave', () => {
                isHovered = false;
                targetRX = 0;
                targetRY = 0;
                if (spotlight) spotlight.style.opacity = '0';
                if (!raf) raf = requestAnimationFrame(updateTransform);
            });
        });
    }

    // ==========================================================================
    // WhatsApp Floating Chat Widget Interactivity (Cartoon Mascot & Typing Delay)
    // ==========================================================================
    const waTab = document.getElementById('wa-chat-tab');
    const waTrigger = document.getElementById('wa-chat-trigger');
    const waBox = document.getElementById('wa-chat-box');
    const waClose = document.getElementById('wa-chat-close');
    const waInput = document.getElementById('wa-chat-input');
    const waSend = document.getElementById('wa-chat-send');
    const waPulse = waTrigger ? waTrigger.querySelector('.wa-chat-pulse') : null;
    const waTypingIndicator = document.getElementById('wa-typing-indicator');
    const waMsgDelayed = document.getElementById('wa-msg-delayed');

    if (waTab && waTrigger && waBox) {
        // 1. Tab click triggers mascot sliding into view
        waTab.addEventListener('click', (e) => {
            e.stopPropagation();
            waTrigger.classList.add('visible');
            waTab.classList.add('hidden');
        });

        // 2. Mascot click toggles chat box visibility and runs typing simulation
        waTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const isOpening = !waBox.classList.contains('active');
            waBox.classList.toggle('active');

            if (waPulse) {
                waPulse.style.display = 'none';
            }

            // If opening the chat box, simulate Sanjay typing
            if (isOpening) {
                // Reset states
                if (waTypingIndicator && waMsgDelayed) {
                    waMsgDelayed.style.display = 'none';
                    waMsgDelayed.style.opacity = '0';
                    waTypingIndicator.style.display = 'flex';
                    waTypingIndicator.style.opacity = '1';

                    // Simulate typing delay
                    setTimeout(() => {
                        // Fade out typing indicator using GSAP
                        gsap.to(waTypingIndicator, {
                            opacity: 0,
                            duration: 0.3,
                            ease: 'power2.out',
                            onComplete: () => {
                                waTypingIndicator.style.display = 'none';
                                
                                // Fade in greeting message using GSAP
                                waMsgDelayed.style.display = 'flex';
                                gsap.to(waMsgDelayed, {
                                    opacity: 1,
                                    duration: 0.4,
                                    ease: 'power2.out'
                                });
                            }
                        });
                    }, 1500); // 1.5 seconds typing simulation
                }
            }
        });

        // Close on close button click
        if (waClose) {
            waClose.addEventListener('click', (e) => {
                e.stopPropagation();
                waBox.classList.remove('active');
            });
        }

        // Close on document click (outside the widget)
        document.addEventListener('click', (e) => {
            if (!waBox.contains(e.target) && !waTrigger.contains(e.target) && !waTab.contains(e.target)) {
                waBox.classList.remove('active');
            }
        });

        // Send Message logic
        const sendWaMessage = () => {
            const userMsg = waInput.value.trim();
            if (!userMsg) return;

            // Append user message in the chat body for nice UI feedback
            const chatBody = waBox.querySelector('.wa-chat-body');
            if (chatBody) {
                const msgDiv = document.createElement('div');
                msgDiv.className = 'wa-message wa-message-outgoing';
                msgDiv.style.alignSelf = 'flex-end';
                msgDiv.style.marginTop = '10px';
                
                const contentDiv = document.createElement('div');
                contentDiv.className = 'wa-message-content';
                contentDiv.style.background = 'rgba(204, 164, 59, 0.15)';
                contentDiv.style.borderColor = 'rgba(204, 164, 59, 0.3)';
                contentDiv.style.borderRadius = '16px 0 16px 16px';
                
                const p = document.createElement('p');
                p.textContent = userMsg;
                
                const timeSpan = document.createElement('span');
                timeSpan.className = 'wa-message-time';
                timeSpan.textContent = 'Just now';
                
                contentDiv.appendChild(p);
                contentDiv.appendChild(timeSpan);
                msgDiv.appendChild(contentDiv);
                chatBody.appendChild(msgDiv);
                
                // Scroll to bottom
                chatBody.scrollTop = chatBody.scrollHeight;
            }

            // Clear input
            waInput.value = '';

            // Redirect to WhatsApp url (918160008766 is the user's WhatsApp number)
            const whatsappUrl = `https://wa.me/918160008766?text=${encodeURIComponent(userMsg)}`;
            
            // Open window with slight delay so user sees message sent animation
            setTimeout(() => {
                window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
                waBox.classList.remove('active');
            }, 550);
        };

        // Send on click
        if (waSend) {
            waSend.addEventListener('click', sendWaMessage);
        }

        // Send on Enter keypress
        if (waInput) {
            waInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    sendWaMessage();
                }
            });
        }
    }
});
