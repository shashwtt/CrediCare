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

function toggleNav(enableNav, fastClose=false, callback = null) {
    var menuBtnAnim = lottieInstances['hamburger'];
    if (enableNav) {
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
                        if (callback) callback();
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
                if (!fastClose) {

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
                            if (callback) callback();
                        },
                    });
                    menuBtnAnim.playSegments([39, 78], true);
                }
            }
        });
        if (fastClose) {
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
                opacity: 0,
                ease: "power4.out",
                onComplete: function () {
                    $(".menu").css("display", "none");
                    isNavAnimating = false;
                    if (callback) callback();
                },
            });
            menuBtnAnim.playSegments([39, 78], true);
        }
    }
}


menuBtn.click(function () {
    if (isNavAnimating) return;
    isNavAnimating = true;
    if (menuToggled) {
        toggleNav(true);
    } else {
        toggleNav(false);
    }
});




var tapSound = new Howl({ src: ['/res/sounds/box.wav'], volume: 0.1, sprite: { tap: [20, 200] } });
hoverSoundElms.mouseenter(function () {
    tapSound.play('tap');
});

var clickSound = new Howl({ src: ['/res/sounds/click.wav'], sprite: { click: [0, 1048] }, volume: 0.2 });
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


function scroll2(identifier, closeNav = true) {
    var elm = document.querySelector(identifier);

    if (closeNav) {
        return toggleNav(enableNav=false, fastClose=true, function () {
            elm.scrollIntoView({ behavior: 'smooth', duration: 1000 });
        });
    } else {
        elm.scrollIntoView({ behavior: 'smooth', duration: 1000 });
    }
}


function scrollback() {
    if (menuToggled) {
        scroll2("#landing", false);
    } else {
        scroll2("#landing");
    }

}
 

AOS.init({
    easing: 'ease-in-out',
    offset: 50,
});



function themeAnim() {
    var themeScreen = $("#theme-screen");
    var themeLottie = $("#theme-btn .lottie-elm svg");

    themeScreen.css("display", "block");
    gsap.to(themeLottie, {
        duration: 0.3,
        transform: "scale(3.5)",
        background: 'transparent',
        ease: "power4.out",
        onComplete: function () {
            themeLottie.css("transform", "scale(1)");
        }
    });

    gsap.to(themeScreen, {
        duration: 0.1,
        opacity: "1",
        onComplete: function () {
            gsap.to(themeScreen, {
                duration: 0.2,
                delay: 0.3,
                opacity: "0",
                onComplete: function () {
                    themeScreen.css("display", "none");
                },
                onStart: function () {
                    applyTheme();
                    loadLottie();
                }
            });
        }
    });
}