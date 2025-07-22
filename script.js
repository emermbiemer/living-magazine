document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    const body = document.body;
    body.classList.add('preloader-active');

    const leftLetters = document.querySelectorAll(".left-group .letter");
    const rightLetters = document.querySelectorAll(".right-group .letter");
    const gap = document.querySelector(".gap");
    const preloader = document.querySelector('.preloader');
    const mainContent = document.getElementById("main-content");

    const imgs = [];
    for (let i = 0; i <= 5; i++) imgs.push(`img/img${i}.jpg`);
    imgs.push("img/img6.jpeg");
    imgs.push("img/bg.jpeg");

    imgs.forEach(src => {
        const wrapper = document.createElement("div");
        wrapper.classList.add("gap-img-wrapper");
        const img = document.createElement("img");
        img.src = src;
        wrapper.appendChild(img);
        gap.appendChild(wrapper);
    });

    const gapWrappers = gap.querySelectorAll(".gap-img-wrapper");
    const gapImgs = gap.querySelectorAll("img");

    const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

    tl.to([...leftLetters, ...rightLetters], {
        y: 0,
        opacity: 1,
        stagger: 0.05,
        duration: 0.5,
    })
    .to({}, { duration: 0.5 })
    .to(".left-group", { x: "-160px", duration: 0.7 }, "<")
    .to(".right-group", { x: "160px", duration: 0.7 }, "<")
    .to(gap, { width: "12vw", duration: 0.7 }, "<")
    .add(() => {
        const slideshowTl = gsap.timeline({ defaults: { ease: "none" } });
        const lastIndex = gapWrappers.length - 1;

        gapImgs.forEach((img, i) => {
            if (i < lastIndex) {
                slideshowTl.to(img, { opacity: 1, duration: 0.1 }).to(img, { opacity: 0, duration: 0.1, delay: 0.1 });
            }
        });

        slideshowTl.to(gapImgs[lastIndex], { opacity: 1, duration: 0.2 });

        slideshowTl.eventCallback("onComplete", () => {
            zoomIn(gapWrappers[lastIndex]);
        });

        slideshowTl.play();
    });

    function zoomIn(wrapperToZoom) {
        const lastImgSrc = wrapperToZoom.querySelector('img').src;
        const siteHeader = document.getElementById('site-header');
        const nav = document.getElementById('main-nav');
        const headerTitle = document.querySelector('.header-title');
        const logo = document.querySelector('.logo');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        // Hide navbar and header title initially
        gsap.set(nav, { y: -50, opacity: 0 });
        gsap.set(headerTitle, { y: 50, opacity: 0 });
        gsap.set(logo, { scale: 0.8, opacity: 0 });
        gsap.set(navLinks, { y: -20, opacity: 0 });
        
        // Set background image
        siteHeader.style.backgroundImage = `url(${lastImgSrc})`;

        const zoomTl = gsap.timeline({
            defaults: { ease: "power2.inOut" },
            onComplete: () => {
                preloader.style.display = 'none';
                mainContent.classList.add("active");
                body.classList.remove('preloader-active');
                
                // Animate navbar and header title after preloader is gone
                const headerTl = gsap.timeline();
                
                // Animate navbar from top
                headerTl.to(nav, {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power3.out"
                });
                
                // Animate logo with a slight bounce
                headerTl.to(logo, {
                    scale: 1,
                    opacity: 1,
                    duration: 0.6,
                    ease: "back.out(1.7)"
                }, "-=0.4");
                
                // Staggered animation for nav links
                headerTl.to(navLinks, {
                    y: 0,
                    opacity: 1,
                    stagger: 0.1,
                    duration: 0.5
                }, "-=0.3");
                
                // Animate header title from bottom
                headerTl.to(headerTitle, {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power2.out"
                }, "-=0.4");
                
                // Initialize other animations
                initMainContentAnimations();
            }
        });

        zoomTl.set(wrapperToZoom, {
            position: "fixed",
            top: "50%",
            left: "50%",
            xPercent: -50,
            yPercent: -50,
            zIndex: 1000,
        })
        .to(wrapperToZoom, {
            width: "100vw",
            height: "100vh",
            duration: 1.5,
        })
        .to(".left-group", { x: "-150vw", duration: 1.5 }, "<")
        .to(".right-group", { x: "150vw", duration: 1.5 }, "<");
    }

    function initMainContentAnimations() {
        const nav = document.getElementById('main-nav');
        const headerHeight = document.getElementById('site-header').offsetHeight;
        const sectionTitles = document.querySelectorAll('.section-title');
        const articleLeads = document.querySelectorAll('.article-lead');
        const articleTitles = document.querySelectorAll('.article-title');
        const images = document.querySelectorAll('.image-collage img, .full-width-image, .side-by-side img, .image-grid img');
        const pullQuotes = document.querySelectorAll('.pull-quote');
        const paragraphs = document.querySelectorAll('.article-body p');
        
        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > headerHeight) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
        
        // Enhanced animations for section titles with scroll triggers - faster and snappier
        sectionTitles.forEach(title => {
            ScrollTrigger.create({
                trigger: title,
                start: 'top 90%',
                onEnter: () => {
                    gsap.fromTo(title,
                        { y: 20, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
                    );
                    
                    // Animate the border separately for a drawing effect - faster
                    gsap.fromTo(title,
                        { borderBottomWidth: '0px' },
                        { borderBottomWidth: '2px', duration: 0.3, delay: 0.1, ease: 'power1.inOut' }
                    );
                },
                once: true
            });
        });
        
        // Even faster animations for article leads
        articleLeads.forEach(lead => {
            ScrollTrigger.create({
                trigger: lead,
                start: 'top 90%',
                onEnter: () => {
                    gsap.fromTo(lead,
                        { x: -30, opacity: 0 },
                        { x: 0, opacity: 1, duration: 0.3, ease: 'power1.out' }
                    );
                },
                once: true
            });
        });
        
        // Faster animations for article titles
        articleTitles.forEach(title => {
            ScrollTrigger.create({
                trigger: title,
                start: 'top 90%',
                onEnter: () => {
                    gsap.fromTo(title,
                        { y: 15, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.25, ease: 'back.out(1.5)' }
                    );
                },
                once: true
            });
        });
        
        // Text paragraph animations - faster and snappier
        ScrollTrigger.batch(paragraphs, {
            onEnter: batch => gsap.to(batch, {
                opacity: 1,
                y: 0,
                stagger: 0.05, // Faster stagger
                duration: 0.3, // Faster duration
                ease: 'power1.out' // Snappier easing
            }),
            start: 'top 90%',
            once: true // Only animate once
        });
        
        // No special animation for first paragraphs
        
        // Enhanced scroll animations for images
        images.forEach((img, index) => {
            ScrollTrigger.create({
                trigger: img,
                start: 'top 90%',
                onEnter: () => {
                    // Different animation based on position
                    if (index % 3 === 0) {
                        // Scale up
                        gsap.fromTo(img, 
                            { opacity: 0, scale: 0.8 },
                            { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.2)' }
                        );
                    } else if (index % 3 === 1) {
                        // Slide in from right
                        gsap.fromTo(img, 
                            { opacity: 0, x: 30 },
                            { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }
                        );
                    } else {
                        // Slide in from bottom
                        gsap.fromTo(img, 
                            { opacity: 0, y: 30 },
                            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
                        );
                    }
                },
                once: true
            });
        });
        
        // Faster animation for pull quotes
        pullQuotes.forEach(quote => {
            ScrollTrigger.create({
                trigger: quote,
                start: 'top 85%',
                onEnter: () => {
                    gsap.fromTo(quote,
                        { x: -50, opacity: 0 },
                        { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
                    );
                },
                once: true
            });
        });
        
        // Animate paragraphs with the same style as titles
        paragraphs.forEach(paragraph => {
            ScrollTrigger.create({
                trigger: paragraph,
                start: 'top 95%',
                onEnter: () => {
                    gsap.fromTo(paragraph,
                        { y: 15, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.25, ease: 'back.out(1.5)' }
                    );
                },
                once: true
            });
        });
        
        // Smooth scroll for navigation links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    gsap.to(window, {
                        duration: 1,
                        scrollTo: {
                            y: targetElement,
                            offsetY: 100
                        },
                        ease: 'power3.inOut'
                    });
                }
            });
        });
    }
});
