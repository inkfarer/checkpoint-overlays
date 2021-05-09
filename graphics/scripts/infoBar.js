const topBarInfoRows = document.querySelectorAll('.info-bar > .info-row');
let topInfoTl;

function setTopBarAnim() {
    const switchDelay = 10;

    if (topInfoTl) {
        topInfoTl.kill();
    }
    topInfoTl = gsap.timeline({repeat: -1});

    for (let i = 0; i < topBarInfoRows.length; i++) {
        const elem = topBarInfoRows[i];

        if (!musicShown.value && elem.classList.contains('info-row-music')) {
            gsap.set(elem, {opacity: 0});
            continue;
        }

        topInfoTl.add(gsap.fromTo(elem, {opacity: 1, clipPath: 'polygon(0 0, 0% 0, 0% 100%, 0% 100%)'}, {
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            duration: 0.75,
            ease: 'power1.inOut',
            force3D: false
        }));

        if (elem.classList.contains('info-row-commentators')) {
            topInfoTl.add(gsap.to({}, {duration: switchDelay / 2}));
        } else {
            topInfoTl.add(gsap.to({}, {duration: switchDelay}));
        }

        topInfoTl.add(gsap.to(elem, {
            clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)',
            duration: 0.75,
            opacity: 1,
            ease: 'power1.inOut',
            force3D: false
        }));
    }
}

musicShown.on('change', newValue => {
    setTopBarAnim();
});
