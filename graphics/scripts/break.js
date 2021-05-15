// Lottie anim

const logoAnim = lottie.loadAnimation({
    container: document.getElementById('cpLogoContainer'),
    renderer: 'svg',
    loop: false,
    autoplay: true,
    path: './lottie-anim/AnimatedCheckpointLogo.json'
});

// maps scene color switching

SBData.on('change', newValue => {
    const rgbA = hexToRgb(newValue.colorInfo.clrA);
    const rgbB = hexToRgb(newValue.colorInfo.clrB);
    var filterA = new Solver(new Color(rgbA[0], rgbA[1], rgbA[2])).solve().filter;
    var filterB = new Solver(new Color(rgbB[0], rgbB[1], rgbB[2])).solve().filter;

    gsap.to('.stageArt1', {duration: 1, filter: filterA});
    gsap.to('.stageArt2', {duration: 1, filter: filterB});
});

// Scene switching

currentBreakScene.on('change', (newValue, oldValue) => {
    let delay = 0;
    let mapsDelay = 2.25;
    let mapCount = 0;
    let animDelay = 0;

    if (oldValue === 'stages') {
        delay = 0.3;
    }

    if (oldValue === 'teams') {
        mapsDelay = 0.5;
    }

    switch (newValue) {
        case 'main':
            mapCount = toggleStages(false, 0);
            animDelay = 0.5;
            if (oldValue === 'stages') {
                animDelay = 0.5 + (mapCount * 0.1);
            }
            toggleMainScene(true, animDelay);
            toggleInfoBar(false);
            toggleNextUp(false);
            break;
        case 'teams':
            toggleMainScene(false, 0);
            mapCount = toggleStages(false, 0);
            animDelay = 2.25;
            if (oldValue === 'stages') {
                animDelay = 0.5 + (mapCount * 0.1);
            }
            toggleNextUp(true, animDelay);
            toggleInfoBar(true, animDelay);
            break;
        case 'stages':
            toggleMainScene(false, 0);
            toggleNextUp(false);
            toggleStages(true, mapsDelay);
            toggleInfoBar(true, mapsDelay);
            break;
        default:
            mapCount = toggleStages(false, 0);
            animDelay = 0.5;
            if (oldValue === 'stages') {
                animDelay = 0.5 + (mapCount * 0.1);
            }
            toggleMainScene(true, animDelay);
            toggleNextUp(false);
            break;
    }
});

function toggleMainScene(show, startDelay = 0) {
    let ease = 'power2.inOut';
    let opacity = show ? 1 : 0;
    let delay = show ? 0 : 1.75;
    delay = delay + startDelay;
    let timeoutDelay = (startDelay * 1000);

    setTimeout(() => {
        let logoDirection = show ? 1 : -1;
        let logoTo = show ? 1 : 99;
        logoAnim.setDirection(logoDirection);
        logoAnim.goToAndPlay(logoTo, true);
    }, timeoutDelay);

    gsap.to(['.mainSceneGrid', '.ipl-powered'], {duration: 0.5, opacity: opacity, delay: delay / 2, ease: ease});
    gsap.to('.mainScene', {duration: 0.5, opacity: opacity, delay: delay, ease: ease});
}

function toggleStages(show, startDelay = 0) {
    let opacity = show ? 1 : 0;

    let stageElems = document.querySelectorAll('.stageElem');

    for (let i = 0; i < stageElems.length; i++) {
        const elem = stageElems[i];
        let cardYTo = show ? 0 : -50;
        let cardYFrom = show ? -50 : 0;
        let cardDelay = (0.1 * i) + startDelay;
        let cardEase = show ? 'power2.out' : 'power2.in';

        gsap.fromTo(elem, {y: cardYFrom, opacity: (opacity === 1) ? 0 : 1}, {
            duration: 0.5,
            delay: cardDelay,
            y: cardYTo,
            ease: cardEase,
            opacity: opacity
        });
    }

    if (!show) {
        startDelay += stageElems.length * 0.1;
    }

    gsap.to('.sceneStages', {duration: 0.5, ease: 'power2.inOut', opacity: opacity, delay: startDelay});

    return stageElems.length;
}

function toggleNextUp(show, delay = 0) {
    let ease = 'power2.inOut';
    let opacity = show ? 1 : 0;
    let styleYTo = show ? 0 : -25;
    let styleYFrom = show ? -25 : 0;
    gsap.to('.sceneTeams', {duration: 0.5, opacity: opacity, delay: delay, ease: ease});
    gsap.fromTo('.nextTeamInfoContainer', {y: styleYFrom}, {duration: 0.5, y: styleYTo, delay: delay, ease: ease});
    gsap.fromTo('.nextTeamInfo', {
        filter: show ? 'drop-shadow(0px 7px 7px black)' : 'drop-shadow(0px 2px 2px black)'
    }, {
        duration: 0.5, delay: delay, ease: ease,
        filter: show ? 'drop-shadow(0px 2px 2px black)' : 'drop-shadow(0px 7px 7px black)'
    });
    if (show) {
        let teamAPlayers = document.querySelectorAll('.nextTeamAPlayer');
        let teamBPlayers = document.querySelectorAll('.nextTeamBPlayer');

        for (let i = 0; i < teamAPlayers.length; i++) {
            const element = teamAPlayers[i];

            gsap.fromTo(element, {clipPath: 'polygon(0 0, 0% 0, 0% 100%, 0% 100%)'}, {
                ease: 'power1.out',
                duration: 0.75,
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
                delay: (i * 0.2) + (delay * 1.2)
            });
        }

        for (let j = 0; j < teamBPlayers.length; j++) {
            const element = teamBPlayers[j];

            gsap.fromTo(element, {clipPath: 'polygon(0 0, 0% 0, 0% 100%, 0% 100%)'}, {
                ease: 'power1.out',
                duration: 0.75,
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
                delay: (j * 0.2) + (delay * 1.2)
            });
        }
    }
}

function toggleInfoBar(show, delay = 0) {
    const opacity = show ? 1 : 0;
    gsap.to('.info-bar-wrapper', {opacity: opacity, duration: 0.5, delay: delay});
}

// Informative texts on main scene

function measureText(text, fontFamily, fontSize, maxWidth, useInnerHTML = false) {
    const measurer = document.createElement('div');
    measurer.classList.add('measurer');
    if (useInnerHTML) {
        measurer.innerHTML = text;
    } else {
        measurer.innerText = text;
    }
    measurer.style.fontFamily = fontFamily;
    measurer.style.fontSize = fontSize;

    document.body.appendChild(measurer);
    let width = measurer.getBoundingClientRect().width;
    measurer.parentNode.removeChild(measurer);
    if (width > maxWidth) {
        return maxWidth;
    } else {
        return width;
    }
}

const breakMainTextProps = {
    fontFamily: "'Primer Print', 'Kosugi Maru', 'Roboto'",
    fontSize: '55px',
    maxWidth: 850
}

function setMainSceneText(elem, newText, tl) {
    if (elem.getAttribute('text') === newText) return;

    let textElem = elem;
    if (elem.tagName.toLowerCase() !== 'fitted-text') {
        textElem = elem.querySelector('fitted-text');
    }

    tl.add(gsap.fromTo(elem, {clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'}, {
        ease: 'power1.inOut',
        duration: 0.75,
        clipPath: 'polygon(100% 0, 125% 0, 100% 100%, 100% 100%)',
        opacity: 0.5,
        onComplete: function () {
            textElem.setAttribute('text', newText);
            elem.style.clipPath = 'polygon(0 0, 0% 0, 0% 100%, 0% 100%)';
            elem.style.opacity = '1';
        }
    }));
    tl.add(gsap.to(elem, {
        ease: 'power1.inOut',
        duration: 0.75,
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
    }));
}

const mainTextTL = gsap.timeline();

mainFlavorText.on('change', newValue => {
    setMainSceneText(document.getElementById('breakFlavorText'), newValue, mainTextTL);
});

const musicTL = gsap.timeline();

function checkStringEmptyOrUndef(string) {
    string = String(string);
    return (string === 'undefined' || string === '');
}

function getSongNameString(rep) {
    if (checkStringEmptyOrUndef(rep.artist) && checkStringEmptyOrUndef(rep.song)) {
        return 'No song is playing.'
    }

    if (checkStringEmptyOrUndef(rep.artist)) {
        return rep.song;
    } else if (checkStringEmptyOrUndef(rep.song)) {
        return rep.artist;
    }

    return rep.artist + ' - ' + rep.song;
}

NodeCG.waitForReplicants(nowPlaying).then(() => {
    const topBarMusicTl = gsap.timeline();

    nowPlaying.on('change', newValue => {
        setMainSceneText(document.getElementById('breakMusicText'), getSongNameString(newValue), musicTL);

        setMainSceneText(document.querySelector('.info-row-music > div'), getSongNameString(newValue), topBarMusicTl);
    });
});

function getGridRows(showMusic) {
    let gridStyle = '84px';

    if (showMusic) {
        gridStyle += ' 84px';
    } else {
        gridStyle += ' 0px';
    }

    gridStyle += ' 84px 84px 84px';

    return gridStyle;
}

function animToggleInfo(showMusic, infoElem, elemShown) {
    let gridStyle = getGridRows(showMusic), gridDelay, elemOpacity, elemDelay;
    if (elemShown) {
        elemOpacity = 1;
        elemDelay = 0.4;
        gridDelay = 0;
    } else {
        elemOpacity = 0;
        elemDelay = 0;
        gridDelay = 0.4;
    }

    gsap.to(infoElem, {duration: 0.5, opacity: elemOpacity, delay: elemDelay, ease: 'power2.inOut'});
    gsap.to('.mainSceneGrid', {duration: 0.5, gridTemplateRows: gridStyle, ease: 'power2.inOut', delay: gridDelay});
}

NodeCG.waitForReplicants(NSTimerShown, musicShown).then(() => {
    musicShown.on('change', newValue => {
        animToggleInfo(newValue, '#breakMusic', newValue);
    });
});


// teams

nextTeams.on('change', newValue => {
    nextTeamAName.setAttribute('text', newValue.teamAInfo.name);
    nextTeamBName.setAttribute('text', newValue.teamBInfo.name);

    teamAplayersBG.innerHTML = '';
    teamBplayersBG.innerHTML = '';

    newValue.teamAInfo.players.forEach(player => {
        const elem = createNextTeamPlayerElem(player.name, 'left', 'a');
        teamAplayersBG.appendChild(elem);
    });

    newValue.teamBInfo.players.forEach(player => {
        const elem = createNextTeamPlayerElem(player.name, 'left', 'b');
        teamBplayersBG.appendChild(elem);
    });
});

function createNextTeamPlayerElem(name, align, team) {
    const textElem = document.createElement('fitted-text');
    textElem.setAttribute('text', name);
    textElem.setAttribute('max-width', '400');
    textElem.setAttribute('align', align);

    const checkElem = document.createElement('i');
    checkElem.classList.add('fas');
    checkElem.classList.add('fa-check');

    const container = document.createElement('div');
    container.classList.add('teamsItemContainer');
    container.appendChild(checkElem);
    container.appendChild(textElem);
    if (team === 'a') {
        container.classList.add('nextTeamAPlayer');
    } else {
        container.classList.add('nextTeamBPlayer');
    }

    return container;
}

// Stages

const mapNameToImagePath = {
    "Ancho-V Games": "S2_Stage_Ancho-V_Games.png",
    "Arowana Mall": "S2_Stage_Arowana_Mall.png",
    "Blackbelly Skatepark": "S2_Stage_Blackbelly_Skatepark.png",
    "Camp Triggerfish": "S2_Stage_Camp_Triggerfish.png",
    "Goby Arena": "S2_Stage_Goby_Arena.png",
    "Humpback Pump Track": "S2_Stage_Humpback_Pump_Track.png",
    "Inkblot Art Academy": "S2_Stage_Inkblot_Art_Academy.png",
    "Kelp Dome": "S2_Stage_Kelp_Dome.png",
    "MakoMart": "S2_Stage_MakoMart.png",
    "Manta Maria": "S2_Stage_Manta_Maria.png",
    "Moray Towers": "S2_Stage_Moray_Towers.png",
    "Musselforge Fitness": "S2_Stage_Musselforge_Fitness.png",
    "New Albacore Hotel": "S2_Stage_New_Albacore_Hotel.png",
    "Piranha Pit": "S2_Stage_Piranha_Pit.png",
    "Port Mackerel": "S2_Stage_Port_Mackerel.png",
    "Shellendorf Institute": "S2_Stage_Shellendorf_Institute.png",
    "Shifty Station": "S2_Stage_Shifty_Station.png",
    "Snapper Canal": "S2_Stage_Snapper_Canal.png",
    "Starfish Mainstage": "S2_Stage_Starfish_Mainstage.png",
    "Sturgeon Shipyard": "S2_Stage_Sturgeon_Shipyard.png",
    "The Reef": "S2_Stage_The_Reef.png",
    "Wahoo World": "S2_Stage_Wahoo_World.png",
    "Walleye Warehouse": "S2_Stage_Walleye_Warehouse.png",
    "Skipper Pavilion": "S2_Stage_Skipper_Pavilion.png",
    "Unknown Map": "unnamed-unknown-map.png"
};

function createMapListElems(maplist) {
    const stagesGrid = document.querySelector('.stagesGrid');
    const imageLoads = [];

    gsap.to(stagesGrid, {
        duration: 0.5, opacity: 0, onComplete: async function () {
            stagesGrid.innerHTML = '';
            stagesGrid.style.gridTemplateColumns = `repeat(${maplist.games.length}, 1fr)`;

            let mapsHTML = '';
            let elemWidth;
            let fontSize = '40px';
            let winnerFontSize = '32px';

            switch (maplist.games.length) {
                case 3:
                    elemWidth = '380';
                    stagesGrid.style.width = '1200px';
                    winnerFontSize = '35px';
                    break;
                case 5:
                    elemWidth = '260';
                    stagesGrid.style.width = '1400px';
                    fontSize = '35px';
                    winnerFontSize = '35px';
                    break;
                case 7:
                    elemWidth = '190';
                    stagesGrid.style.width = '1600px';
                    fontSize = '35px';
                    break;
            }

            for (let i = 0; i < maplist.games.length; i++) {
                const element = maplist.games[i];

                const imageUrl = `img/stages/${mapNameToImagePath[element.stage]}`;
                imageLoads.push(loadImagePromise(imageUrl));

                // noinspection CssUnknownTarget
                const elem = `
                <div class="stageElem">
                    <div class="dot-wrapper">
                        <img class="mapsDot" src="img/cp-mapsdot.png">
                    </div>
                    <div class="stageImage" style="background-image: url(${imageUrl});">
                        <div class="stageWinner" id="stageWinner_${i}" style="opacity: 0; font-size: ${winnerFontSize}"></div>
                    </div>
                    <div class="stageInfo">
                        <div class="stageMode">
                            <fitted-text text="${element.mode}" max-width="${elemWidth}" align="center"></fitted-text>
                        </div>
                        <div class="stageName" style="font-size: ${fontSize}">${element.stage}</div>
                    </div>
                </div>`

                mapsHTML += elem;
            }

            await Promise.all(imageLoads);

            stagesGrid.innerHTML = mapsHTML;
            setWinners(mapWinners.value)
        }
    });

    gsap.to(stagesGrid, {duration: 0.5, opacity: 1, delay: 0.5});
}

function loadImagePromise(imageUrl) {
    return new Promise((resolve) => {
        const imageLoaderElem = document.createElement("img");
        imageLoaderElem.src = imageUrl;

        imageLoaderElem.addEventListener('load', () => {
            resolve();
        });
    })
}

function roundsDiffer(val1, val2) {
    if (val1.games.length !== val2.games.length) return true;
    for (let i = 0; i < val1.games.length; i++) {
        if (val1.games[i].stage !== val2.games[i].stage || val1.games[i].mode !== val2.games[i].mode) return true;
    }
    return false;
}

NodeCG.waitForReplicants(rounds, activeRound, mapWinners).then(() => {
    activeRound.on('change', newValue => {
        const round = rounds.value[newValue];

        createMapListElems(round);
    });

    rounds.on('change', (newValue, oldValue) => {
        if (!oldValue) return;
        let newCurrentList = newValue[activeRound.value];
        let oldCurrentList = oldValue[activeRound.value];

        if (roundsDiffer(newCurrentList, oldCurrentList)) {
            createMapListElems(newCurrentList);
        }
    });
});

window.addEventListener('load', () => {
    NodeCG.waitForReplicants(mapWinners, SBData).then(() => {
        mapWinners.on('change', (newValue, oldValue) => {
            setWinners(newValue);
        });

        SBData.on('change', newValue => {
            setWinners(mapWinners.value);

            document.querySelector('#teamAName').setAttribute('text', newValue.teamAInfo.name);
            document.querySelector('#teamBName').setAttribute('text', newValue.teamBInfo.name);
        });
    });
});

function setWinners(val) {
    for (let i = 0; i < val.length; i++) {
        const element = val[i];
        if (element === 0) {
            setWinner(i, '', false);
        } else if (element === 1) {
            setWinner(i, SBData.value.teamAInfo.name, true);
        } else {
            setWinner(i, SBData.value.teamBInfo.name, true);
        }
    }
}

function setWinner(index, name, shown) {
    let winnerElem = document.querySelector(`#stageWinner_${index}`);
    if (!winnerElem) return;
    let opacity;

    if (shown) {
        opacity = 1;
    } else {
        opacity = 0
    }

    if (shown) {
        winnerElem.innerText = name;
    }

    gsap.to(winnerElem, {opacity: opacity, duration: 0.5});
}

// Scoreboard on maps page

teamScores.on('change', newValue => {
    document.querySelector('#teamAScore').setAttribute('text', newValue.teamA);
    document.querySelector('#teamBScore').setAttribute('text', newValue.teamB);
});

// Social media text loop

const discordLinks = ["iplabs.ink/discord",
    "discord.io/CHECKPOINT1"];

const twitterLinks = ["@IPLSplatoon",
    "@Checkpoint1SPL"];

function startTextLoop(arr, tl, elemID) {
    for (i = 0; i < arr.length; i++) {
        setMainSceneText(document.getElementById(elemID), arr[i], tl);

        if (i === arr.length - 1) {
            tl.add(gsap.to({}, {
                duration: 8.5, onComplete: () => {
                    startTextLoop(arr, tl, elemID)
                }
            }));
        }
    }
}

const discordTL = gsap.timeline();
const twitterTL = gsap.timeline();

window.addEventListener('load', () => {
    startTextLoop(discordLinks, discordTL, 'breakDiscordText');

    // stagger animation starts
    twitterTL.add(gsap.to({}, {duration: 5}));

    startTextLoop(twitterLinks, twitterTL, 'breakTwitterText');
});

const nextRoundTimeElem = document.getElementById('breakTimerText');
let nextStageDate;
let lastDiff;

nextRoundTime.on('change', newValue => {
    nextStageDate = luxon.DateTime.fromObject(newValue);
});

setInterval(() => {
    const diff = Math.ceil(nextStageDate.diffNow(['minutes']).toObject().minutes);
    if (lastDiff !== diff) {
        lastDiff = diff;
        let newText;

        if (diff < 1) {
            newText = 'Stream resumes <span class="count-minutes">soon!</span>';
        } else if (diff === 1) {
            newText = `Returning in&nbsp;<span class="count-minutes">~${diff}</span>&nbsp;minute...`;
        } else {
            newText = `Returning in&nbsp;<span class="count-minutes">~${diff}</span>&nbsp;minutes...`;
        }

        nextRoundTimeElem.setAttribute('text', newText);
    }
}, 1000);

nextRoundStartTimeShown.on('change', newValue => {
    gsap.to('#breakTimer', {duration: 0.5, opacity: newValue ? 1 : 0});
});
