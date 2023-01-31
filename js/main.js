const theme = localStorage.getItem('theme') ? localStorage.getItem('theme') : 'dark';
const lottieElms = $('.lottie-elm');
const lottieInstances = {};
var isNavAnimating = false;

lottieElms.each(function () {
    const lottieElm = $(this);
    const lottieName = lottieElm.data('lottieName');
    const lottiePath = `/res/lottie/${lottieName}_${theme}.json`;

    $.getJSON(lottiePath)
        .done(function (lottieData) {
            const lottieInstance = lottie.loadAnimation({
                container: lottieElm[0],
                renderer: 'svg',
                loop: false,
                autoplay: false,
                animationData: lottieData,
                speed: 4
            });
            lottieInstances[lottieName] = lottieInstance;
        })
        .fail(function (error) {
            console.error(error);
        });
});

// When menu button is clicked
var menuToggled = true;
var menuBtn = $("#menu-btn");
menuBtn.click(function () {
    if (isNavAnimating) return;
    isNavAnimating = true;
    const menuBtnAnim = lottieInstances['hamburger'];
    if (menuToggled) {
        isNavAnimating = true;
        menuBtnAnim.playSegments([0, 39], true);
        menuToggled = false;

        $(".menu").css("display", "flex");
        gsap.to(".menu", {
            duration: 0.5,
            opacity: "1",
            ease: "power4.out",
            onComplete: function () {
                $(".menu").addClass("menu-open");
                isNavAnimating = false;
                gsap.to(".menu-container", { opacity: 1, duration: 0.5});
            },
        });
        
        gsap.to(".nav .landing-text", {
            duration: 0.5,
            transform: "translate(10px, 70px)",
            ease: "power4.out",
            onStart: function () {
                $(".nav .landing-text").addClass("no-bg");
            }
        });
        
        
    } else {
        menuBtnAnim.playSegments([39, 78], true);
        menuToggled = true;

        
        gsap.to(".nav .landing-text", {
            duration: 0.5,
            transform: "translate(0px, 0px)",
            ease: "power4.out",
            onComplete: function () {
                $(".menu").removeClass("menu-open");
                $(".nav .landing-text").removeClass("no-bg");
            },
        });
        gsap.to(".menu-container", { opacity: 0, duration: 0.5 });
        gsap.to(".menu", {
            delay: 0.5,
            duration: 1,
            opacity: 0,
            ease: "power4.out",
            onComplete: function () {
                $(".menu").css("display", "none");
                isNavAnimating = false;
            }, 
        });
    }
});
