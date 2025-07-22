document.addEventListener('DOMContentLoaded', () => {
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
        siteHeader.style.backgroundImage = `url(${lastImgSrc})`;

        const zoomTl = gsap.timeline({
            defaults: { ease: "power2.inOut" },
            onComplete: () => {
                preloader.style.display = 'none';
                mainContent.classList.add("active");
                body.classList.remove('preloader-active');
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

        window.addEventListener('scroll', () => {
            if (window.scrollY > headerHeight) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }
});
