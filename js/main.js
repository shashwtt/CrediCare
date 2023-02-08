var lottieElms = $('.lottie-elm');
var lottieInstances = {};
var isNavAnimating = false;

var hoverSoundElms = $('.hover-sound');
var clickSoundElms = $('.click-sound');


function loadLottie(lottie_id = null) {
    let _loop = lottieElms;
    if (lottie_id != null) {
        _loop = $(`.lottie-elm[data-lottie-name="${lottie_id}"]`);
    }
    _loop.each(function () {
        let removeOnLoad = false;
        var lottieElm = $(this);
        var lottieName = lottieElm.data('lottieName');

        if (lottieInstances[lottieName]) {
            lottieInstances[lottieName].destroy();
        }

        var lottiePath = `/res/lottie/${lottieName}_${theme}.json`;
        if (lottieName.endsWith('_')) {
            lottiePath = `/res/lottie/${lottieName}.json`;
        } else if (lottieName.endsWith('$')) {
            lottiePath = `/res/lottie/${lottieName.replace('$', '')}_${oppTheme}.json`;
            removeOnLoad = true;
        }


        $.getJSON(lottiePath)
            .done(function (lottieData) {
                var lottieInstance = lottie.loadAnimation({
                    container: lottieElm[0],
                    renderer: 'svg',
                    // loop if attribute is set to true
                    loop: false,
                    autoplay: false,
                    animationData: lottieData,
                    speed: 4
                });

                lottieInstance.addEventListener('DOMLoaded', function () {
                    if (lottieName == 'theme') {
                        lottieInstances['theme'].play();
                    }

                    if (removeOnLoad) {
                        lottieElm.remove();
                    }
                });

                lottieInstances[lottieName] = lottieInstance;
            })
            .fail(function (error) {
                console.log(lottiePath);
                console.error(error);
            });
    });
}

loadLottie();

// When menu button is clicked
var menuToggled = true;
var menuBtn = $("#menu-btn");
menuBtn.click(function () {
    if (isNavAnimating) return;
    isNavAnimating = true;
    var menuBtnAnim = lottieInstances['hamburger'];
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
                gsap.to(".menu-container", {
                    opacity: 1, duration: 0.5, onComplete: function () {
                    }
                });
                gsap.to('.menu-separator', {
                    duration: 0.5,
                    transform: "scaleX(1)",
                    ease: "power4.out",
                });
            },
        });

        gsap.to(".nav .landing-text", {
            duration: 0.5,
            transform: "translate(40px, 40px)",
            ease: "power4.out",
        });
        gsap.to('.nav .options', {
            duration: 0.5,
            transform: "translate(-60px, 40px)",
            ease: "power4.out",
        });
        $(".nav").addClass("nav-open");


    } else {
        menuToggled = true;

        gsap.to('.menu-separator', {
            duration: 0.5,
            transform: "scaleX(0)",
            ease: "power4.out",
            onComplete: function () {
                gsap.to('.nav .options', {
                    duration: 0.5,
                    transform: "translate(0, 0)",
                    ease: "power4.out",
                });

                gsap.to(".nav .landing-text", {
                    duration: 0.5,
                    transform: "translate(0px, 0px)",
                    ease: "power4.out",
                    onComplete: function () {
                        $(".menu").removeClass("menu-open");
                        $(".nav").removeClass("nav-open");
                    },
                });

                gsap.to(".menu-container", { opacity: 0, duration: 0.5 });
                gsap.to(".menu", {
                    delay: 0.5,
                    opacity: 0,
                    ease: "power4.out",
                    onComplete: function () {
                        $(".menu").css("display", "none");
                        isNavAnimating = false;
                    },
                });
                menuBtnAnim.playSegments([39, 78], true);
            }
        });
    }
});




var tapSound = new Howl({ src: ['/res/sounds/box.wav'], volume: 0.3, sprite: { tap: [20, 200] } });
hoverSoundElms.mouseenter(function () {
    tapSound.play('tap');
});

var clickSound = new Howl({ src: ['/res/sounds/click.wav'], sprite: { click: [0, 1048] } });
clickSoundElms.click(function () {
    clickSound.play('click');
});


// parallax effect
var landing_img = document.querySelector("#landing-img");

$(window).scroll(function () {
    var scroll = $(window).scrollTop();
    if (scroll > 50 && scroll <= 200) {
        $("#navbar").css("--nav-opacity", scroll / 150);
    } else if (scroll > 200) {
        $("#navbar").css("--nav-opacity", 1);
    } else if (scroll <= 100) {
        $("#navbar").css("--nav-opacity", 0);
    }

    // zoom parallax
    landing_img.style.transform = "scale(" + (1 + scroll / 1000) + ")";


});


function scroll2(identifier, replay = true) {
    var elm = document.querySelector(identifier);
    elm.scrollIntoView({ behavior: 'smooth', duration: 1000 });
    if (replay) {
        AOS.refresh();
    }
}


AOS.init({
    // duration: 1000,
    // once: true,
    // disable: 'mobile',
    easing: 'ease-in-out',
    offset: 50,
});